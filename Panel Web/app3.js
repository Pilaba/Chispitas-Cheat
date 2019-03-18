//Web setup
const app = require("express")();
const http = require('http').createServer(app);
const io = require("socket.io").listen(http);
//Dengurs - Autorizar sitios https con certificado caduco o auto firmado
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';  

//SocketIO setup
let coneccionesSocket = []
let respuestasArray = []
io.on('connection', function (socket) {
    coneccionesSocket.push(socket);
    socket.on("disconnect", () => { //Disconected guy
        coneccionesSocket.splice(coneccionesSocket.indexOf(socket), 1) 
    })
    socket.on("REquestion", (data) => {
        googleSearch(data.q, respuestasArray, data.id)
        bingSearch(data.q, respuestasArray, data.id)
    })
});

//3rd party Libraries setup
const busboy = require('connect-busboy');
const GET = require('request-promise');                          // api rest client
const cheerio = require('cheerio');                              // Basically jQuery for node.js
const sharp = require('sharp');                                  // Cortar imagenes
const vision = require('@google-cloud/vision');                  // google vision api
const client = new vision.ImageAnnotatorClient({
    projectId: 'cloudapi-test-230302',
    keyFilename: './GoogleVisioApiCred.json'
});
app.use(busboy({ immediate: true }));
app.use(require("serve-favicon")(__dirname + '/favicon.ico'));

app.post("/", (req, res, next) => {
    //INIT TIME
    var inicio = new Date();

    req.busboy.on('field', (fieldname, data, filename, encoding, mimetype) => {
        let bufferFile = Buffer.from(data, 'base64')
        let pregunta = sharp(bufferFile).resize(480, 135 ,{position : "top"}).toBuffer()
        let respuestas = sharp(bufferFile).resize(480, 270, {position : "bottom"}).toBuffer()

        Promise.all([pregunta, respuestas]).then(bufferImagenes => {
            let resultadoPregunta = client.textDetection( {image: { content: bufferImagenes[0] }} )
            let resultadoRespuestas= client.textDetection( {image: { content: bufferImagenes[1] }} )

            return Promise.all([resultadoPregunta, resultadoRespuestas])
        }).then(textImages => {
            let pregunta = textImages[0][0].fullTextAnnotation.text
                .replace("\n", " ").replace(/\r?\n|\r/g, " ")    //Replace all white spaces and new lines
            if(pregunta.match(/^\d/)){                           //Remover al inicio de algunas preguntas en Q12
                pregunta = pregunta.substring(4, pregunta.lenght);
            }

            respuestasArray = textImages[1][0].fullTextAnnotation.text
                .split("\n").filter(word => word.length > 0);   //replace empty words
            console.log(`P: ${pregunta} \nR: ${respuestasArray}`);

            ///// Google Search
            googleSearch(pregunta, respuestasArray)

            ///// Bing search
            bingSearch(pregunta, respuestasArray)

            //TIMES UP
            let time = ( new Date() - inicio ) / 1000
            console.log("TIME TO PROCESS ", time);
            emitSockets('T', time)
            
        }).catch(err => {
            console.log("error file")
        })

        //Terminar la conexion
        res.end();
    })
});

function googleSearch(pregunta, respuestasArray, socketID){
    GET({
        uri: "https://www.google.com.mx/search",
        headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
        qs: {
            q : pregunta,
            count : 15
        }, transform: function (body) { return cheerio.load(body); } 
    }).then($ => {
        let resultados = $("div.g")
        let items = []

        let countA = countB = countC = 0;
        let BuscaPalabra = [[{}], [{}], [{}]];

        for (let i = 0; i < resultados.length; i++) {
            let title = $(resultados[i]).find("h3").text();
            let link = $(resultados[i]).find(".r > a").attr("href");
            let parseoIniciado = new Date();
            
            if(title != undefined && link != undefined && !title.startsWith("Noticias") && !title.startsWith("Im")){
                link = link.substring(link.indexOf("http"), link.indexOf("&sa=")) || link;
                items.push({link : link, htmlTitle : title})
            
                GET({
                    uri: link,
                    headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
                    transform: function (body) { return cheerio.load(body); } 
                }).then($ => {
                    let body = $("body").text().replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    title = title.replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")

                    let encontradosA = 
                        (body.match(new RegExp(respuestasArray[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                        (title.match(new RegExp(respuestasArray[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length
                    let encontradosB = 
                        (body.match(new RegExp(respuestasArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                        (title.match(new RegExp(respuestasArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length
                    let encontradosC = 
                        (body.match(new RegExp(respuestasArray[2].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                        (title.match(new RegExp(respuestasArray[2].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length

                    countA += encontradosA
                    countB += encontradosB
                    countC += encontradosC

                    if((new Date() - parseoIniciado) / 1000 < 7){
                        let matriz = [
                            [respuestasArray[0], countA], 
                            [respuestasArray[1], countB], 
                            [respuestasArray[2], countC]
                        ]
                        emitSockets('GraficaGoogle', {
                            matriz: matriz, 
                            dataExta: {indice:i, extra: [encontradosA, encontradosB, encontradosC] }
                        }, socketID)
                    }

                    //SEARCH FOR EVERY WORD BETA
                    respuestasArray.forEach((resp, index, arr) => {
                        let split = removeWords(resp).split(" ").filter(el => el.length > 0)
                        
                        split.forEach((word, i) => {
                            let encontrados = 
                                (body.match(new RegExp('\\b'+word.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'\\b', "gi")) || []).length +
                                (title.match(new RegExp('\\b'+word.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'\\b', "gi")) || []).length
                            
                            let sum = 0
                            if(BuscaPalabra[index][i] && BuscaPalabra[index][i].count){
                                sum = BuscaPalabra[index][i].count
                            }
                            BuscaPalabra[index][i] = {
                                resp: resp,
                                word: word,
                                count : sum + encontrados
                            }
                        });
                    });

                    emitSockets("EachWordSeach", {data: BuscaPalabra}, socketID)

                    //<!-- -->
                }).catch(err => {
                    console.log("error parsing google link ", link, " ", "at index", " ", i)
                })
            }
        }

        emitSockets('Q', {pregunta: pregunta, respuestas: respuestasArray, items: items}, socketID)
    })
}

function bingSearch(pregunta, respuestasArray, socketID){
    GET({
        uri: "https://www.bing.com/search",
        headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
        qs: {
            q : pregunta,
            count : 15
        }, transform: function (body) { return cheerio.load(body); } 
    }).then($ => {
        let resultados = $("#b_results > li.b_algo")

        var countA = countB = countC = 0;

        for (let i = 0; i < resultados.length; i++) {
            let title = $(resultados[i]).find("h2 > a").text();
            let link = $(resultados[i]).find("h2 > a").attr("href");
            let desc = $(resultados[i]).find("div > p").text();
            let parseoIniciado = new Date();

            GET({
                uri: link,
                headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
                transform: function (body) { return cheerio.load(body); } 
            }).then($ => {
                let body = $("body").text().replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                title = title.replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")

                let encontradosA = 
                    (body.match(new RegExp(respuestasArray[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                    (title.match(new RegExp(respuestasArray[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length
                let encontradosB = 
                    (body.match(new RegExp(respuestasArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                    (title.match(new RegExp(respuestasArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length
                let encontradosC = 
                    (body.match(new RegExp(respuestasArray[2].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                    (title.match(new RegExp(respuestasArray[2].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length

                countA += encontradosA
                countB += encontradosB
                countC += encontradosC

                if((new Date() - parseoIniciado) / 1000 < 7){
                    let matriz = [
                        [respuestasArray[0], countA], 
                        [respuestasArray[1], countB], 
                        [respuestasArray[2], countC]
                    ]
                    emitSockets('GraficaBing', {
                        matriz: matriz, 
                        dataExta: {indice:i, extra: [encontradosA, encontradosB, encontradosC] } 
                    }, socketID)
                }

            }).catch(err => {
                console.log("error parsing bing link ", link, " ", "at index", " ", i)
            })
        }
    })
}

function emitSockets(nombre, data, socketID){
    if(socketID){
        coneccionesSocket.forEach(socket => {
            if(socket.id == socketID){
                socket.emit(nombre, data)
                return
            }
        })
    }else{
        coneccionesSocket.forEach(socket => {
            socket.emit(nombre, data)
        })
    }

}

function removeWords(str){
    let words = ["el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "y", "o","en", "tu", "mis", "para", "no", "si", "su", "sus", "a"]
    str = str.replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    //Reemplazar signos
    str = str.replace(/,|;|\.|\*|:|-|_|'|"|´|`/g, "")
    
    //Reemplazar palabras
    words.forEach(el => {
        str = str.replace(new RegExp('\\b'+el+'\\b', "gi"), "")
    });

    return str
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

var port = process.env.PORT || 80
http.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});