const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});
  if (process.env.NODE_ENV === 'dev') {
    mainWindow.loadURL('http://localhost:9999/index.html');
    mainWindow.webContents.openDevTools();
    // Open the DevTools.
  } else {
    const urlPath = path.join(__dirname, '../static');
    mainWindow.loadURL(`file://${urlPath}/index.html`);
    mainWindow.webContents.openDevTools();
  }
  mainWindow.webContents.send('transitionTo', url);
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


require('./serialport');
require('./sqlite3');
require('./project');
require('./project_property');
