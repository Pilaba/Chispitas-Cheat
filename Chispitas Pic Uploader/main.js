// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, shell, dialog} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.on('ready', () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 400,  height: 200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            icon: path.join(__dirname, 'icon.ico'),
        }
    })
    mainWindow.loadFile('index.html')
    mainWindow.setIcon(path.join(__dirname, 'icon.ico'))
    mainWindow.setTitle("Chispitas Pic Uploader")
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    var menu = Menu.buildFromTemplate([{
        label: 'Menu',
        submenu: [
            {
                label: 'Open Chispitas', accelerator: 'Alt+O',
                click(){ shell.openExternal("http://chispitas.sytes.net") }
            },
             {role: 'toggledevtools' },
            {
                label: 'about', click(){ 
                    dialog.showMessageBox({
                        type: "info", title: "About", 
                        message: "Chispitas Pic Uploader v1.0.0",
                        detail:"© Baldemar Alejandres Garcia",
                        icon: path.join(__dirname, 'icon.ico'),
                    }) 
                }
            },
            { type : 'separator' },  
            { label: 'Exit', click(){ app.quit() }},
        ]
    }])
    Menu.setApplicationMenu(menu);
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
