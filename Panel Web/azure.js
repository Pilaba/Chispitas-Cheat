'use strict';

const request = require('request');
const fs      = require('fs')

const b64 = fs.readFileSync('./imagenes/1561254286172.jpg', {encoding: "base64"})
let bufferImage = Buffer.from(b64, 'base64')

const options = {
    uri : 'https://southcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr',
    qs  : { 'language': 'es', },
    body: bufferImage,
    headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key' : '84fae83715e44c49b7889738fd1b9c05'
    }
};

let inicio = new Date()
request.post(options, (error, response, body) => {
    if (error) { console.log('Error: ', error); return; }

    let json = JSON.parse(body)
    let lineas = json.regions[0].lines
    
    let respuestas = [
        lineas.pop().words.map(el => el.text).join(" "), 
        lineas.pop().words.map(el => el.text).join(" "), 
        lineas.pop().words.map(el => el.text).join(" ")
    ].reverse()

    let pregunta = lineas.map(el => el.words.map(el => el.text).join(" ")).join(" ")

    console.log(pregunta, respuestas);
    console.log(( new Date() - inicio ) / 1000);
});
