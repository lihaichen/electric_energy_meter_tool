const SerialPort = require('serialport');
const {ipcMain} = require('electron');

ipcMain.on('getSerialPortList', (event, arg) => {
  SerialPort.list(function(err, ports) {
    event.returnValue = ports;
  });
});

