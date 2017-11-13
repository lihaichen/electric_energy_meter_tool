/**
 * Created by lhc on 2017/11/11.
 */

import React, {Component, PropTypes} from 'react';
import {Button, message, Input} from 'antd';
import {ipcRenderer} from 'electron';
import SerialPort from '../../component/serialport/index';

const prefixCls = 'HomePage';
import './index.less';

export default class HomePage extends Component {
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <SerialPort/>
      </div>
    );
  }
}

