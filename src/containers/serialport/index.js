import React, {Component, PropTypes} from 'react';
import {ipcRenderer} from 'electron';
const prefixCls = 'SerialPort';
export default class SerialPort extends Component {

  componentWillMount() {
    console.log(ipcRenderer.sendSync('getSerialPortList', ''));
  }

  render() {
    return (
      <div className={prefixCls}>
        串口
      </div>
    );
  }
}
