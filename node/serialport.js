const SerialPort = require('serialport');
const {ipcMain} = require('electron');
const {webContents} = require('electron');
let serialPort = null;
let recvSerialBuffer = new Buffer(0);
let recvSerialTimer = null;

function recvSerialPortTimeout() {
  if (recvSerialTimer) {
    clearTimeout(recvSerialTimer);
    recvSerialTimer = null;
  }
  webContents.getFocusedWebContents().send('serialPortData', recvSerialBuffer);
  recvSerialBuffer = new Buffer(0);
}


ipcMain.on('getSerialPortList', (event, arg) => {
  SerialPort.list((err, res) => {
    event.sender.send('getSerialPortList', {err, res});
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
        console.log('====>', JSON.stringify(err));
        webContents.getFocusedWebContents().send('serialPortError', JSON.stringify(err));
      });
      serialPort.on('data', (data) => {
        recvSerialBuffer = Buffer.concat([recvSerialBuffer, data]);
        if (recvSerialTimer) {
          clearTimeout(recvSerialTimer);
          recvSerialTimer = null;
        }
        recvSerialTimer = setTimeout(recvSerialPortTimeout, 200);
      });
    }
    event.returnValue = {err, res};
  });
});

ipcMain.on('closeSerialPort', (event) => {
  if (!serialPort) {
    event.returnValue = {err: '串口没有打开'};
    return null;
  }

  serialPort.close((err, res) => {
    event.returnValue = {err, res};
  });
});

ipcMain.on('writeSerialPort', (event, arg) => {
  let buffer = null;
  if (!serialPort) {
    event.sender.send('serialPortError', '请先打开串口');
    return null;
  }
  try {
    buffer = Buffer.from(arg);
  } catch (error) {
    event.sender.send('serialPortError', '参数转化错误');
    return null;
  }

  serialPort.write(buffer, 'buffer', err => {
    if (err) {
      event.returnValue = {err: '串口写错误'};
      webContents.getFocusedWebContents().send('serialPortError', '串口写错误');
    }
  });
});
