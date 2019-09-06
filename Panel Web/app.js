//Core setup
const express = require('express');
const app     = express();   
const http    = require('http').createServer(app)
const io      = require("socket.io").listen(http)
const fs      = require("fs")
const path    = require("path")
const sharp   = require('sharp') 

require('dotenv').config();                         // Cargar variables de entorno .env  
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';  // Autorizar sitios https con certificado caduco o auto firmado

//SocketIO setup
let respuestasArray = []
let activeRequest = []
io.on('connection', function (socket) {
    socket.on("REquestion", (data) => {
        activeRequest.forEach(req => {
            req.abort();
        });
        googleSearch(data.q, respuestasArray, data.id, true)
        bingSearch(data.q, respuestasArray, data.id, true)
    })

    socket.on("Pruebas", (data) => {
        respuestasArray = data.respuestas
        googleSearch(data.q, respuestasArray, data.id)
        bingSearch(data.q, respuestasArray, data.id)
    })
})

//3rd party Libraries setup
const GET = require('request-promise');                                  // API REST CLIENT
const cheerio = require('cheerio');                                      // JQUERY FOR NODEJS
app.use(express.json({limit: '10mb'}));                                  // PARSEAR JSON AUTOMATICAMENTE
app.use(express.urlencoded({limit: '10mb', extended: false }));          // PROCESAR FORMULARIOS
app.use(require("serve-favicon")(__dirname + '/public/favicon.ico'))     // ICONO DE LA APP
app.use(express.static('public'));                                       // DIRECTORIO PUBLICO

app.post("/", async (req, res, next) => {
    //INIT TIME
    let inicio = new Date();

    let bufferImagen = Buffer.from(req.body.imgasB64, 'base64')
    //Guardar imagen async
    fs.writeFile(path.resolve(`imagenes`, inicio.getTime()+".jpg"), bufferImagen, (err) => { })

    try {
        let bufferImagenCortada = await Promise.all([
            sharp(bufferImagen).resize(480, 130, {position : "top"}).toBuffer(),
            sharp(bufferImagen).resize(480, 255, {position : "bottom"}).toBuffer()
        ])
    
        let options = {
            method: 'post',
            uri : process.env.AZURE_OCR_URI,
            qs  : { 'language': 'es', },  //body: bufferImage,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key' : process.env.AZURE_API_KEY
            }
        }
    
        //Azure in action
        let ocrPregunta   = GET( Object.assign({body: bufferImagenCortada[0]}, options) )
        let ocrRespuestas = GET( Object.assign({body: bufferImagenCortada[1]}, options) )
    
        let ocrImagenes = await Promise.all([ocrPregunta, ocrRespuestas])
    
        let pregunta   = decodePreguntaOCR( JSON.parse(ocrImagenes[0]).regions )
        respuestasArray = decodeRespuestasOCR(JSON.parse(ocrImagenes[1]).regions )

        //Remover el numero de inicio en algunas preguntas de Q12
        if(pregunta.match(/^\d/)){ pregunta = pregunta.substring(4, pregunta.lenght);  }

        //Para la app movil 
        emitSockets("APP_QUESTION", {P: pregunta, R: respuestasArray})

        pregunta = removeWords(pregunta)
        pregunta = pregunta.replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")

        googleSearch(pregunta, respuestasArray)
        bingSearch(pregunta, respuestasArray)

        let time = ( new Date() - inicio ) / 1000
        console.log(pregunta, respuestasArray, " T:", time)
        emitSockets('T', time)
    }catch(err){
        console.log("Error OCR", err);
    }

    res.end();
}) 

function googleSearch(pregunta, respuestasArray, socketID){
    //Resetear cotador de incidencias para cada palabra
    let BuscaPalabra = [[{}], [{}], [{}]]
    activeRequest = []

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

        for (let i = 0; i < resultados.length; i++) {
            let title = $(resultados[i]).find("h3").text();
            let link = $(resultados[i]).find(".r > a").attr("href");
            let parseoIniciado = new Date();
            
            if(title != undefined && link != undefined && !title.startsWith("Noticias") && !title.startsWith("Im")){
                link = link.substring(link.indexOf("http"), link.indexOf("&sa=")) || link;
                items.push({link : link, htmlTitle : title})
            
                let request = GET({
                    uri: link,
                    headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
                    transform: function (body) { return cheerio.load(body); } 
                })
                activeRequest.push(request);

                request.then($ => {
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

                    if((new Date() - parseoIniciado) / 1000 < 7){
                        emitSockets('Grafica', {
                            array: [encontradosA, encontradosB, encontradosC]
                        }, socketID)
                    }

                    //SEARCH FOR EVERY WORD 
                    let arrayClon = [...respuestasArray]  //Clon para prevenir que se modifiquen los valores dentro del array
                    arrayClon.forEach((resp, index, arr) => {
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
                                word: word,
                                count: sum + encontrados
                            }
                        });
                    });
                    emitSockets("EachWordSeach", {matriz: BuscaPalabra}, socketID)

                }).catch(err => {
                    console.log("error parsing google link ", link, " ", "at index", " ", i)
                })
            }
        }
        emitSockets('Q', {pregunta: pregunta, respuestas: respuestasArray, items: items}, socketID)

        //Google header 
        let googleHeaderRoot = $("div.ifM9O")
        if(googleHeaderRoot.text().trim() != ""){
            let cabeza = $(googleHeaderRoot).find(".kp-header")

            $(cabeza).find(".LEsW6e").remove()
            $(cabeza).find(".rhsl4").remove()
            $(cabeza).find("svg").remove()
            let cuerpo = $(googleHeaderRoot).find(".SALvLe")
            $(cuerpo).find(".LEsW6e").remove()

            let container = $(googleHeaderRoot).find(".rl_container") 

            emitSockets("googleHeader", { htmlHeader: cabeza.html() + container.html() + cuerpo.html()  })

            //Experimental
            let headerTexto = $(googleHeaderRoot).find(".LGOjhe")
            emitSockets("textoHeader", { htmlTextoHeader: headerTexto.html() })
        }
    })
}

function bingSearch(pregunta, respuestasArray, socketID){
    GET({
        uri: "https://www.bing.com/search",
        headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
        qs: {
            q : pregunta,
            count : 12
        }, transform: function (body) { return cheerio.load(body); } 
    }).then($ => {
        let resultados2 = $("#b_results > li.b_algo")
        
        for (let j = 0; j < resultados2.length; j++) {
            let title2 = $(resultados2[j]).find("h2 > a").text();
            let link2 = $(resultados2[j]).find("h2 > a").attr("href");
            let parseoIniciado2 = new Date();

            let requestB = GET({
                uri: link2,
                headers : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' }, 
                transform: function (body) { return cheerio.load(body); } 
            })
            activeRequest.push(requestB);

            requestB.then($ => {
                let body2 = $("body").text().replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                title2 = title2.replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")

                let encontradosA2 = 
                    (body2.match(new RegExp(respuestasArray[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                    (title2.match(new RegExp(respuestasArray[0].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length
                let encontradosB2 = 
                    (body2.match(new RegExp(respuestasArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                    (title2.match(new RegExp(respuestasArray[1].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length
                let encontradosC2 = 
                    (body2.match(new RegExp(respuestasArray[2].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length +
                    (title2.match(new RegExp(respuestasArray[2].normalize('NFD').replace(/[\u0300-\u036f]/g, ""), "gi")) || []).length

                if((new Date() - parseoIniciado2) / 1000 < 7){
                    emitSockets('Grafica', {
                        array: [encontradosA2, encontradosB2, encontradosC2]
                    }, socketID)
                }
                //SEARCH FOR EVERY WORD 
                /* 
                let arrayClon2 = [...respuestasArray]  //Clon para prevenir que se modifiquen los valores dentro del array
                arrayClon2.forEach((resp, index, arr) => {
                    let split = removeWords(resp).split(" ").filter(el => el.length > 0)
                    
                    split.forEach((word, i) => {
                        let encontrados = 
                            (body2.match(new RegExp('\\b'+word.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'\\b', "gi")) || []).length +
                            (title2.match(new RegExp('\\b'+word.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+'\\b', "gi")) || []).length
                        
                        let sum = 0
                        if(BuscaPalabra[index][i] && BuscaPalabra[index][i].count){
                            sum = BuscaPalabra[index][i].count
                        }
                        BuscaPalabra[index][i] = {
                            word: word,
                            count: sum + encontrados
                        }
                    });
                });
                emitSockets("EachWordSeach", {matriz: BuscaPalabra}, socketID)*/
                
            }).catch(err => {
                console.log("error parsing bing link ", link2, " ", "at index", " ", j)
            })
        }
    })
}

function decodePreguntaOCR(regions) {
    let str = ""
    regions.forEach(region => {
        region.lines.forEach(linea => {
            linea.words.forEach(texto => {
                str += texto.text += " "
            });
        });
    });
    return str
}

function decodeRespuestasOCR(regions) {
    let respuestas = []
    regions.forEach(region => {
        region.lines.forEach(linea => {
            let str = ""
            linea.words.forEach(texto => {
                str += texto.text += " "
            });

            respuestas.push(str.trim())
        });
    });

    while(respuestas.length < 3 ){
        respuestas.push("NaN")
    }
    while (respuestas.length > 3) {
        respuestas.pop()
    }
    return respuestas
}

function emitSockets(nombre, data, socketID){
    if(socketID){
        io.sockets.connected[socketID].emit(nombre, data)
    }else{
        io.emit(nombre, data)
    }
}

function removeWords(str){
    let words = ["esta", "tiene", "el", "la", "que", "opciones", "e", "mi", "te", "da", "de", "cual", "estas", "estos", "siguientes", "le", "los", "me", "fue", "las", "se", "por", "ser", "es", "un", "con", "una", "unos", "unas", "de", "del", "al", "y", "o","en", "tu", "mis", "para", "no", "si", "su", "sus", "a"]

    str = str.replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    //Reemplazar signos
    str = str.replace(/,|;|\.|\*|:|-|_|\?|\¿|'|"|´|`/g, "")
    
    //Reemplazar palabras
    words.forEach(el => {
        str = str.replace(new RegExp('\\b'+el+'\\b', "gi"), "")
    });

    return str
}

function saveInDB(pregunta, respuestas) {

}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

var port = process.env.PORT || 80
http.listen(port, "0.0.0.0", function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
})