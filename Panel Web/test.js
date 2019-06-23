/*const mysql = require("mysql")
require('dotenv').config();                             //Cargar variables de entorno .env  
function saveInDB(data) {
    try{
        var connection = mysql.createConnection({
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASS,
            database : process.env.DB_DBNAME
        });
        console.log(process.env.DB_HOST);
        
        connection.connect(err => {
            if (err) {  throw err;  }
            connection.query('SELECT 1', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
            });
        });
    }catch(error){
        console.error(error)
    }
}
saveInDB()*/
//Web setup
const express = require('express');
const app = express();   
const http = require('http').createServer(app)
const io = require("socket.io").listen(http)
const fs = require("fs")
const path = require("path")
const mysql = require("mysql")
const request = require("request")                      //Request API
require('dotenv').config();                             //Cargar variables de entorno .env  

function busquedaChida(pregunta, respuestasArray, socketID) {
    //Resetear cotador de incidencias para cada palabra
    let BuscaPalabra = [[{}], [{}], [{}]]
    activeRequest = []

    for (const key in respuestasArray) {
        
    }

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

function emitSockets(nombre, data, socketID){
    if(socketID){
        io.sockets.connected[socketID].emit(nombre, data)
    }else{
        io.emit(nombre, data)
    }
}