import React, {Component, PropTypes} from 'react';
import {Select, Button, message, Input} from 'antd';
import {ipcRenderer} from 'electron';
import {connect} from 'react-redux';
const prefixCls = 'SerialPort';
const Option = Select.Option;
import * as serialPortActions from '../../redux/modules/serialport/action';
@connect(
  state => ({serialPort: state.serialPort}),
  {...serialPortActions}
)
export default class SerialPort extends Component {
  static propTypes = {
    serialPort: PropTypes.object.isRequired,
    updateSerialPortStatus: PropTypes.func.isRequired
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      selectPort: null,
      selectBaudrate: null,
      selectParity: null,
      sendValue: ''
    };
  }

  componentWillMount() {
    ipcRenderer.on('getSerialPortList', this.processGetSerialPortList.bind(this));
    ipcRenderer.send('getSerialPortList', '');
    ipcRenderer.on('serialPortError', this.processSerialPortError.bind(this));
    ipcRenderer.on('serialPortData', this.processSerialPortData.bind(this));
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('getSerialPortList', this.processGetSerialPortList.bind(this));
    ipcRenderer.removeListener('serialPortError', this.processSerialPortError.bind(this));
    ipcRenderer.removeListener('serialPortData', this.processSerialPortData.bind(this));
  }

  processGetSerialPortList(event, data) {
    if (data.err) {
      message.error(data.err);
    } else {
      this.props.updateSerialPortStatus({serialPortList: data.res});
    }
  }

  processSerialPortData(event, data) {
    message.info(data.toString('ascii'));
  }

  processSerialPortError(event, err) {
    message.error(err);
  }

  onButtonClick() {
    const {selectPort, selectBaudrate, selectParity} = this.state;
    if (!selectPort || !selectBaudrate || !selectParity) {
      message.error(`请选择串口的参数`);
      return;
    }
    const isOpen = this.props.serialPort.get('isOpen');
    if (isOpen) {
      const {err} = ipcRenderer.sendSync('closeSerialPort', {
        path: this.state.selectPort,
        options: {parity: selectParity, baudRate: parseInt(selectBaudrate, 10)}
      });
      if (err) {
        message.error(`关闭串口出错 ${err}`);
      } else {
        this.props.updateSerialPortStatus({isOpen: false});
      }
    } else {
      const {err} = ipcRenderer.sendSync('openSerialPort', {
        path: this.state.selectPort,
        options: {parity: selectParity, baudRate: parseInt(selectBaudrate, 10)}
      });
      if (err) {
        message.error(`打开串口出错 ${err}`);
      } else {
        this.props.updateSerialPortStatus({isOpen: true});
      }
    }
  }

  onSendClick() {
    const sendData = this.state.sendValue + '';
    ipcRenderer.send('writeSerialPort', sendData);
  }


  render() {
    const isOpen = this.props.serialPort.get('isOpen');
    const serialPortList = this.props.serialPort.get('serialPortList');
    const baudrateList = this.props.serialPort.get('baudrateList');
    const parityList = this.props.serialPort.get('parityList');

    return (
      <div className={prefixCls}>
        <span>串口：</span>
        <Select
          style={{width: '150px'}}
          onSelect={(value) => {
            this.setState({'selectPort': value});
          }}
        >
          {
            serialPortList.map(item => {
              return (
                <Option value={item.get('comName')} key={item.get('comName')}>
                  {item.get('comName')}
                </Option>
              );
            })
          }
        </Select>
        <span>波特率：</span>
        <Select
          style={{width: '100px'}}
          onSelect={(value) => {
            this.setState({'selectBaudrate': value});
          }}
        >
          {
            baudrateList.map(item => {
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
            parityList.map(item => {
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
          onClick={this.onButtonClick.bind(this)}
        >
          {isOpen ? '关闭串口' : '打开串口'}
        </Button>

        <div>
          <Input onChange={(value) => {
            this.setState({sendValue: value});
          }}/>
          <Button
            type="primary"
            onClick={this.onSendClick.bind(this)}
          >
            发送
          </Button>
        </div>

      </div>
    );
  }
}
