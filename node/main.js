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

// In main process.
const {ipcMain} = require('electron');
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('主线程asynchronous-message', arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event, arg) => {
  console.log('synchronous-message', arg);  // prints "ping"
  event.returnValue = 'pong';
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});
  if (process.env.NODE_ENV === 'dev') {
    mainWindow.loadURL('http://localhost:8989/index.html');
  } else {
    const urlPath = path.join(__dirname, '../static');
    mainWindow.loadURL(`file://${urlPath}/index.html`);
  }
  // and load the index.html of the app.
  // mainWindow.loadURL(`file:///Users/lhc/work/electron/webpack2Demo/static/index.html`);
  // mainWindow.loadURL('http://localhost:8989/index.html');
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.