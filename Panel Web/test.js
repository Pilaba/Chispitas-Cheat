const GET   = require('request-promise')
const fs    = require('fs')
const util  = require('util')
const sharp = require('sharp')   

const AWS   = require('aws-sdk')
AWS.config.update({
    accessKeyId: 'AKIAUP37E4CK7ZUXFXQQ',
    secretAccessKey: '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',
    region: 'us-east-1'
})

const vision = require('@google-cloud/vision');             
const client = new vision.ImageAnnotatorClient({
    projectId: 'cloudapi-test-230302',
    keyFilename: './GoogleVisioApiCred.json'
})

let recognition = new AWS.Rekognition()
let strBase64   = fs.readFileSync("./imagenes/1559605695886.jpg", {encoding: 'base64'});

async function testFREEOCR() {
    let inicio = new Date()
    let Base64Image = util.format('data:%s;base64,%s', "image/png", strBase64);
    let options     = { 
        apikey: '795198753588957',
        language: 'spa', 
        isOverlayRequired: false,
        base64image: Base64Image
    };

    let response = await GET.post({
        url: "https://api.ocr.space/parse/image",
        form: options,
        headers : {"content-type": "application/json"},
        json: true
    })

    //TIMES UP
    return ( new Date() - inicio ) / 1000
}

async function testFREEOCRSHARP() {
    let inicio = new Date()

    let bufferImage = Buffer.from(strBase64, 'base64')

    let buffImages = await Promise.all([
        sharp(bufferImage).resize(480, 130, {position : "top"}).toBuffer(), 
        sharp(bufferImage).resize(480, 255, {position : "bottom"}).toBuffer()])

    let Base64ImageA = util.format('data:%s;base64,%s', "image/png", buffImages[0].toString("base64"));
    let Base64ImageB = util.format('data:%s;base64,%s', "image/png", buffImages[1].toString("base64"));

    let optionsA     = { 
        apikey: '795198753588957',
        language: 'spa', 
        isOverlayRequired: false,
        base64image: Base64ImageA
    };

    let optionsB     = { 
        apikey: '795198753588957',
        language: 'spa', 
        isOverlayRequired: false,
        base64image: Base64ImageB
    };

    let data = await Promise.all([ 
        GET.post({
            url: "https://api.ocr.space/parse/image",
            form: optionsA,
            headers : {"content-type": "application/json"},
            json: true
        }), 
        GET.post({ url: "https://api.ocr.space/parse/image",
            form: optionsB,
            headers : {"content-type": "application/json"},
            json: true
        })
    ])

    //TIMES UP
    return ( new Date() - inicio ) / 1000
}

async function testAmazonRekognition() {
    let inicio = new Date()
    let data = await recognition.detectText({Image: { Bytes: Buffer.from(strBase64, 'base64') }}).promise()
    return ( new Date() - inicio ) / 1000
}

async function testAmazonRekognitionSHARP() {
    let inicio = new Date()
    
    let bufferImage = Buffer.from(strBase64, 'base64')

    let buffImages = await Promise.all([
        sharp(bufferImage).resize(480, 130, {position : "top"}).toBuffer(), 
        sharp(bufferImage).resize(480, 255, {position : "bottom"}).toBuffer()])

    let data = await Promise.all([
        recognition.detectText({Image: { Bytes: buffImages[0] }}).promise(),
        recognition.detectText({Image: { Bytes: buffImages[1] }}).promise()
    ])

    return ( new Date() - inicio ) / 1000
}

async function testGoogleOCR(){
    let inicio = new Date()
    let bufferImage = Buffer.from(strBase64, 'base64')

    let result = await client.textDetection( {image: { content: bufferImage }} )
    let text = result[0].fullTextAnnotation.text

    return ( new Date() - inicio ) / 1000
}

async function testGoogleOCRSHARP(){
    let inicio = new Date()
    let bufferImage = Buffer.from(strBase64, 'base64')

    let pregunta = sharp(bufferImage).resize(480, 130, {position : "top"}).toBuffer()
    let respuestas = sharp(bufferImage).resize(480, 255, {position : "bottom"}).toBuffer()

    let bufferImagenes = await Promise.all([pregunta, respuestas])
    let OCR            = await Promise.all([
        client.textDetection( {image: { content: bufferImagenes[0] }} ),
        client.textDetection( {image: { content: bufferImagenes[1] }} )
    ])

    return ( new Date() - inicio ) / 1000
}

async function startTest(number) {
    // FREE OCR API TEST, WITH AND WITHOUT SHARP
    // WINNER 
    /*let TIME = []
    for (let index = 0; index < number; index++) {
        TIME.push(await testFREEOCR())
    }
    console.log(TIME);

    TIME = []
    for (let index = 0; index < number; index++) {
        TIME.push(await testFREEOCRSHARP())
    }
    console.log(TIME);*/

    
    // AMAZON REKONITION TEST, WITH AND WITHOUT SHARP
    // WINNER 
    /*TIME = []
    for (let index = 0; index < number; index++) {
        TIME.push(await testAmazonRekognition())
    }
    console.log(TIME);

    TIME = []
    for (let index = 0; index < number; index++) {
        TIME.push(await testAmazonRekognitionSHARP())
    }
    console.log(TIME);*/

    // GOOGLE VISION OCR TEST, WITH AND WITHOUT SHARPING AN IMAGE
    let TIME = []
    for (let index = 0; index < number; index++) {
        TIME.push(await testGoogleOCR())
    }
    console.log(TIME);

    TIME = []
    for (let index = 0; index < number; index++) {
        TIME.push(await testGoogleOCRSHARP())
    }
    console.log(TIME);
}

startTest(5)
