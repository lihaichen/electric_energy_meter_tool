import React, {Component, PropTypes} from 'react';
import {Select, Button, message} from 'antd';
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
      serialPortList: [],
      baudrateList: ['1200', '2400', '4800', '9600', '115200'],
      selectPort: null,
      selectBaudrate: null,
      selectParity: null,
      isOpen: false
    };
  }

  componentWillMount() {
    const {err, res} = ipcRenderer.sendSync('getSerialPortList', '');
    if (err) {
      message.error(`获取串口列表出错 ${err}`);
    } else {
      this.setState({serialPortList: res});
    }
  }

  onButtonClick() {
    const {selectPort, selectBaudrate, selectParity} = this.state;
    if (!selectPort || !selectBaudrate || !selectParity) {
      message.error(`请选择串口的参数`);
      return;
    }
    if (this.state.isOpen) {
      const {err} = ipcRenderer.sendSync('closeSerialPort', {
        path: this.state.selectPort,
        options: {parity: selectParity, baudRate: parseInt(selectBaudrate, 10)}
      });
      if (err) {
        message.error(`关闭串口出错 ${err}`);
      } else {
        this.props.updateSerialPortStatus({isOpen: false});
        this.setState({isOpen: false});
      }
    } else {
      const {err} = ipcRenderer.sendSync('openSerialPort', {
        path: this.state.selectPort,
        options: {parity: selectParity, baudRate: parseInt(selectBaudrate, 10)}
      });
      if (err) {
        message.error(`打开串口出错 ${err}`);
      } else {
        this.setState({isOpen: true});
        this.props.updateSerialPortStatus({isOpen: true});
      }
    }
  }

  render() {
    console.log('---->', this.props.serialPort.toJS());
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
            this.state.serialPortList.map(item => {
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
            this.setState({'selectBaudrate': value});
          }}
        >
          {
            this.state.baudrateList.map(item => {
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
          <Option value="none">
            无校验
          </Option>
          <Option value="even">
            偶校验
          </Option>
          <Option value="odd">
            奇校验
          </Option>
        </Select>
        <Button
          type="primary"
          onClick={this.onButtonClick.bind(this)}
        >
          {this.state.isOpen ? '打开串口' : '关闭串口'}
        </Button>
      </div>
    );
  }
}
