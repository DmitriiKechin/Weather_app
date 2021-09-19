const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  console.log('start');
  const win = new BrowserWindow({
    width: 600,
    height: 850,
    icon: __dirname + '/icon.ico',
    transparent: true,
    frame: false,
    webPreferences: {
      // contextIsolation: false,
      // nodeIntegration: true,
      // enableRemoteModule: true,
      //preload: path.join(app.getAppPath(), 'preload.js'),
    },
  });

  win.loadFile('index.html');
  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
