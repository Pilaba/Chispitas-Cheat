/*let GET = require("request-promise")
let ocrSpaceApi = require("ocr-space-api")
let fs = require("fs")
let util = require("util")

let res = "¿Cuál de estos NO es un órgano del \r\naparato digestivo? \r\nHígado \r\nPáncreas \r\nAlvéolos \r\n"

var arr = res.split("\n").filter(item => item.length != 0)
console.log(arr);


let strBase64 = fs.readFileSync("./imagenes/1559605695886.jpg", {encoding: 'base64'});
let Base64Image = util.format('data:%s;base64,%s', "image/png", strBase64);

var options =  { 
    apikey: '795198753588957',
    language: 'spa', 
    isOverlayRequired: false,
    base64image: Base64Image
};

let inicio = new Date();
// Run and wait the result

GET.post({
    url: "https://api.ocr.space/parse/image",
    form: options,
    headers : {"content-type": "application/json"},
    json: true
}).then(res => {
    console.log(res);
}).catch(console.log)
*/
/*
ocrSpaceApi.parseImageFromLocalFile("./imagenes/1559605695886.jpg", options)
  .then(function (parsedResult) {
    console.log('parsedText: \n', parsedResult.parsedText);
    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);

    //TIMES UP
    let time = ( new Date() - inicio ) / 1000
    console.log("TIME TO PROCESS ", time);
  }).catch(function (err) {
    console.log('ERROR:', err);
  });*/