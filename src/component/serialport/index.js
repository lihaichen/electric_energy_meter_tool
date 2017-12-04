/**
 * Created by lhc on 2017/11/11.
 */

import React, {Component, PropTypes} from 'react';
import {Select, Button, message, Input} from 'antd';
import {ipcRenderer} from 'electron';
const prefixCls = 'SerialPort';
const Option = Select.Option;

export default class SerialPort extends Component {
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      portList: [],
      baudRateList: ['1200', '2400', '4800', '9600', '115200'],
      parityList: [{key: 'none', name: '无校验'}, {key: 'even', name: '偶校验'}, {key: 'odd', name: '奇校验'}],
      selectPort: null,
      selectBaudRate: null,
      selectParity: null,
      isOpen: false,
      isLoading: false
    };
    this.processGetSerialPortList = this._processGetSerialPortList.bind(this);
    this.processSerialPortError = this._processSerialPortError.bind(this);
    this.processSerialPortData = this._processSerialPortData.bind(this);
  }

  componentWillMount() {
    ipcRenderer.on('getSerialPortList', this.processGetSerialPortList);
    ipcRenderer.send('getSerialPortList', '');
    ipcRenderer.on('serialPortError', this.processSerialPortError);
    ipcRenderer.on('serialPortData', this.processSerialPortData);
  }

  componentWillUnmount() {
    ipcRenderer.sendSync('closeSerialPort', {});
    ipcRenderer.removeListener('getSerialPortList', this.processGetSerialPortList);
    ipcRenderer.removeListener('serialPortError', this.processSerialPortError);
    ipcRenderer.removeListener('serialPortData', this.processSerialPortData);
  }


  _processGetSerialPortList(event, {err, res}) {
    if (err) {
      message.error(err);
      return;
    }
    this.setState({portList: res});
  }

  _processSerialPortData(event, data) {
    message.info(data.toString('hex'));
  }

  _processSerialPortError(event, err) {
    message.error(err);
  }


  onButtonClick() {
    const {selectPort, selectBaudRate, selectParity} = this.state;
    if (!selectPort || !selectBaudRate || !selectParity) {
      message.error(`请选择串口的参数`);
      return;
    }
    const isOpen = this.state.isOpen;
    if (isOpen) {
      this.setState({isLoading: true});
      const {err} = ipcRenderer.sendSync('closeSerialPort', {});
      if (err) {
        message.error(`关闭串口出错 ${err}`);
      } else {
        this.setState({isOpen: false, isLoading: false});
      }
    } else {
      this.setState({isLoading: true});
      const {err} = ipcRenderer.sendSync('openSerialPort', {
        path: this.state.selectPort,
        options: {parity: selectParity, baudRate: parseInt(selectBaudRate, 10)}
      });
      if (err) {
        message.error(`打开串口出错 ${err}`);
      } else {
        this.setState({isOpen: true, isLoading: false});
      }
    }
  }

  onTestClick() {
    ipcRenderer.send('writeSerialPort', [1, 2, 3, 4]);
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <span>串口：</span>
        <Select
          style={{width: '150px'}}
          onSelect={(value) => {
            this.setState({'selectPort': value});
          }}
        >
          {
            this.state.portList.map(item => {
              return (
                <Option value={item.comName} key={item.comName}>
                  {item.comName}
                </Option>
              );
            })
          }
        </Select>

        <span>波特率：</span>
        <Select
          style={{width: '100px'}}
          onSelect={(value) => {
            this.setState({selectBaudRate: value});
          }}
        >
          {
            this.state.baudRateList.map(item => {
              return (
                <Option value={item} key={item}>
                  {item}
                </Option>
              );
            })
          }
        </Select>
        <span>校验：</span>
        <Select
          style={{width: '80px'}}
          onSelect={(value) => {
            this.setState({'selectParity': value});
          }}
        >
          {
            this.state.parityList.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.name}
                </Option>
              );
            })
          }
        </Select>
        <Button
          type="primary"
          loading={this.state.isLoading}
          onClick={this.onButtonClick.bind(this)}
        >
          {this.state.isOpen ? '关闭串口' : '打开串口'}
        </Button>
        <Button onClick={this.onTestClick.bind(this)}>测试发送</Button>
      </div>
    );
  }
}
