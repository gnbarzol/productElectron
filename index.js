const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';
const env = process.env.NODE_ENV || 'development'
let mainWindow = null;
let productWindow = null;

// If development environment 
if (env === 'development') {
    try {
        require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
        });
    } catch (err) { console.log('Error'); }
}

app.whenReady().then(createMainWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('views/index.html');
    mainWindow.on('closed', () => {
        app.quit();
    })
    
    //Set menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenu));

}

function createProductWindow() {
    //Si la ventana ya está abierta mostrarla
    if (productWindow) {
        return productWindow.focus();
    }
    productWindow = new BrowserWindow({
        width: 400,
        height: 500,
        title: 'Agrega un nuevo producto',
        webPreferences: {
            nodeIntegration: true
        }
    });

    productWindow.setMenu(null);
    productWindow.loadFile('views/addProduct.html');

    productWindow.on('closed', () => {
        productWindow = null;
    });
}

ipcMain.on('new-product', (e, newProduct) => {
    //Le envio el producto a la mainWindow
    mainWindow.webContents.send('new-product', newProduct);
    productWindow.close();
});

const mainMenu = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: "Agregar producto",
                accelerator: isMac ? 'Cmd+N' : 'Ctrl+N',
                click() {
                    createProductWindow();
                }
            },
            {
                label: 'Limpiar tabla',
                click() {
                    mainWindow.webContents.send('clear-products');
                }
            },
            {
                label: 'Exit',
                accelerator: isMac ? 'Cmd+Q' : 'Ctrl+Q',
                click() { app.quit() }
            }
        ]
    }
];

if (env === 'development') {
    mainMenu.push(
        {
            label: 'DevTools',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }
    )
}


//Electron tiene dos procesos mainProcesses y renderingProcesses
//IpcRender para comunicacion entre ventanas