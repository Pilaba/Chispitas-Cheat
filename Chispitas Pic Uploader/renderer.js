// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {desktopCapturer, remote} = require('electron')
const Store = require('electron-store')
const axios = require('axios')

const store = new Store()
let mouse     = document.getElementById("mousePos")
let UpLeft    = document.getElementById("UpLeft")
let DownRight = document.getElementById("DownRight")
let IP        = document.getElementById("IP")

///LOAD STORE IF NEEDED
if(store.get('INPUTA') != undefined){
    UpLeft.value    = store.get('INPUTA')
} if (store.get('INPUTB') != undefined){
    DownRight.value = store.get('INPUTB')
} if(store.get('IP') != undefined){
    IP.value        = store.get('IP')
}

document.getElementById("SAVE").addEventListener("click", () => {
    store.set('INPUTA', UpLeft.value)
    store.set('INPUTB', DownRight.value)
    store.set('IP', IP.value)
})
document.getElementById("GO").addEventListener("click", () => {
    takeScreenshot()
})
setInterval(()=> {
    let mousePos = remote.screen.getCursorScreenPoint();
    mouse.textContent = mousePos.x + "," + mousePos.y
}, 150)

async function takeScreenshot() {
    const thumbSize = determineScreenShotSize()
    let options = { types: ['screen'], thumbnailSize: thumbSize }
  
    let source = await desktopCapturer.getSources(options)
    if (source[0].name === 'Entire screen' || source[0].name === 'Screen 1') {
        let PointA = {
            x: parseInt(UpLeft.value.split(",")[0]),
            y: parseInt(UpLeft.value.split(",")[1]),
        }
        let PointB = {
            x: parseInt(DownRight.value.split(",")[0]),
            y: parseInt(DownRight.value.split(",")[1]),
        }

        let screen = source[0].thumbnail.crop({
            height : PointB.y - PointA.y, 
            width  : PointB.x - PointA.x, 
            x : PointA.x,  y : PointA.y
        })
        screen = screen.toPNG()

        let response = await axios({
            method: 'post',
            url   : IP.value,
            data  : {
                imgasB64: screen.toString("base64")
            }
        })
        console.log(response);
    }
}

function determineScreenShotSize () {
    const screenSize = remote.screen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    }
}