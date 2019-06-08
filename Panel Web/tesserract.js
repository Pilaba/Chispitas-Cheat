let path = require("path")
let Tesseract = require("tesseract.js")

const worker = new Tesseract.TesseractWorker();
const config = { lang: 'spa', psm: 3 }
 
worker.recognize("imagenes/1559952703316.jpg", "spa").then(function(result){
    console.log(result);
});