/**
 * Created by lhc on 2017/11/30.
 */

import React, {Component, PropTypes} from 'react';
import SelectProject from '../../component/select_project/index';
import {Button, message, Table, Modal, Row, Col} from 'antd';
import {ipcRenderer} from 'electron';
const prefixCls = 'Measure';

export default class Measure extends Component {
  static propTypes = {};
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      isShowSelectModal: true
    };
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  onProjectSelect(project) {
    console.log('---->', project);
  }

  onProjectSelectCancel() {
    this.setState({isShowSelectModal: false});
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <p>test</p>
        <SelectProject
          onSelect={this.onProjectSelect.bind(this)}
          visible={this.state.isShowSelectModal}
          onCancel={this.onProjectSelectCancel.bind(this)}
        />
      </div>
    );
  }
}
