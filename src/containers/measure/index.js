/**
 * Created by lhc on 2017/11/30.
 */

import React, {Component, PropTypes} from 'react';
import SelectProject from '../../component/select_project/index';
import {Button, message, Table, Modal, Row, Col} from 'antd';
import {ipcRenderer} from 'electron';
import SerialPort from '../../component/serialport/index';
const prefixCls = 'Measure';

export default class Measure extends Component {
  static propTypes = {};
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      isShowSelectModal: true,
      selectProject: {},
      page: 1,
      pageSize: 10,
      // 项目列表
      list: [],
      // 总数量
      sum: 0,
    };
    this.columns = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '属性类型',
        dataIndex: 'valueType',
        key: 'valueType',
      },
      {
        title: '数据标示',
        dataIndex: 'dateIndicate',
        key: 'dateIndicate',
      },
      {
        title: '属性值',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '测量值'
      }
    ];
    this.processGetProjectPropertyList = this._processGetProjectPropertyList.bind(this);
  }

  componentWillMount() {
    ipcRenderer.on('getProjectPropertyList', this.processGetProjectPropertyList);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('getProjectPropertyList', this.processGetProjectPropertyList);
  }

  onProjectSelect(project) {
    this.setState({isShowSelectModal: false, selectProject: project});
    // 获取属性列表
    setTimeout(this.getProjectPropertyList.bind(this), 10);
  }

  _processGetProjectPropertyList(event, {err, res}) {
    if (err) {
      message.error(err);
      return null;
    }
    console.log('--->', err, res);
    this.setState({list: res.list, sum: res.sum});
  }

  getProjectPropertyList() {
    const id = this.state.selectProject.id;
    if (id) {
      ipcRenderer.send('getProjectPropertyList', {
        page: this.state.page,
        pageSize: this.state.pageSize,
        projectId: id
      });
    }
  }

  onProjectSelectCancel() {
    message.info('请选择项目');
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}-serial`}>
          <SerialPort/>
        </div>
        <SelectProject
          isShowEnterButton={false}
          onSelect={this.onProjectSelect.bind(this)}
          visible={this.state.isShowSelectModal}
          onCancel={this.onProjectSelectCancel.bind(this)}
        />
        <div className={`${prefixCls}-table`}>
          <Table
            columns={this.columns}
            dataSource={this.state.list}
            pagination={{
              defaultPageSize: this.state.pageSize,
              total: this.state.sum,
              current: this.state.page
            }}
          />
        </div>
      </div>
    );
  }
}
