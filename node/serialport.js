const SerialPort = require('serialport');
const {ipcMain} = require('electron');
const {webContents} = require('electron');
let serialPort = null;

ipcMain.on('getSerialPortList', (event, arg) => {
  SerialPort.list((err, res) => {
    event.returnValue = {err, res};
  });
});

ipcMain.on('openSerialPort', (event, arg) => {
  const {path, options} = arg;
  if (!path && !options) {
    event.returnValue = {err: '参数为空'};
  }
  serialPort = new SerialPort(path, options, (err, res) => {
    if (serialPort) {
      serialPort.on('error', (err) => {
        webContents.send('serialPortError', JSON.stringify(err));
      });
    }
    event.returnValue = {err, res};
  });
  webContents.getFocusedWebContents().send('serialPortError', 'open');
});

ipcMain.on('closeSerialPort', (event, arg) => {
  if (!serialPort) {
    event.returnValue = {err: '串口没有打开'};
  }
  webContents.getFocusedWebContents().send('serialPortError', 'close');
  serialPort.close((err, res) => {
    event.returnValue = {err, res};
  });
});
