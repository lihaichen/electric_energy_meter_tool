/**
 * Created by lhc on 17-11-21.
 */

import React, {Component, PropTypes} from 'react';
import {Button, message, Table, Icon, Modal} from 'antd';
import {ipcRenderer} from 'electron';
import {Link} from 'react-router';
import './list.less';
import moment from 'moment';
import AddProperty from './add';
import EditProperty from './edit';
const prefixCls = 'ProjectPropertyList';

export default class ProjectPropertyList extends Component {
  static propTypes = {};

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      page: 1,
      pageSize: 10,
      // 项目列表
      list: [],
      // 总数量
      sum: 0,
      // 是否显示添加模态
      isShowAddModal: false,
      isShowEditModal: false,
      editProperty: {}
    };
    this.columns = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '属性描述',
        dataIndex: 'describe',
        key: 'describe',
      },
      {
        title: '属性类型',
        dataIndex: 'valueType',
        key: 'valueType',
      },
      {
        title: '属性值',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '数据标示',
        dataIndex: 'dateIndicate',
        key: 'dateIndicate',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => {
          return <span>{moment.unix(text).format('YYYY-MM-DD hh:mm:ss')}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <Link onClick={this.onEditClick.bind(this, record)}>
              <Icon type="edit" style={{'fontSize': '18px'}}/>
            </Link>
            <Link onClick={this.onDeleteClick.bind(this, record)}>
              <Icon type="delete" style={{'fontSize': '18px', 'paddingLeft': '10px'}}/>
            </Link>
          </div>
        )
      },
    ];
    this.processAddProjectProperty = this._processAddProjectProperty.bind(this);
    this.processGetProjectPropertyList = this._processGetProjectPropertyList.bind(this);
    this.processDeleteProjectProperty = this._processDeleteProjectProperty.bind(this);
    // 修改事件注册
    this.processPutProjectProperty = this._processPutProjectProperty.bind(this);
  }

  componentWillMount() {
    ipcRenderer.on('getProjectPropertyList', this.processGetProjectPropertyList);
    ipcRenderer.on('addProjectProperty', this.processAddProjectProperty);
    ipcRenderer.on('deleteProjectProperty', this.processDeleteProjectProperty);
    ipcRenderer.on('putProjectProperty', this.processPutProjectProperty);
    this.getProjectPropertyList();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('getSerialPortList', this.processGetProjectPropertyList);
    ipcRenderer.removeListener('addProjectProperty', this.processAddProjectProperty);
    ipcRenderer.removeListener('deleteProjectProperty', this.processDeleteProjectProperty);
    ipcRenderer.removeListener('putProjectProperty', this.processPutProjectProperty);
  }

  onEditClick(record) {
    this.setState({isShowEditModal: true, editProperty: record});
  }

  getProjectPropertyList() {
    ipcRenderer.send('getProjectPropertyList', {
      page: this.state.page,
      pageSize: this.state.pageSize,
      projectId: this.props.params.projectId
    });
  }

  _processPutProjectProperty(event, {err}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.onEditCancel();
    this.getProjectPropertyList();
  }

  _processDeleteProjectProperty(event, {err}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.getProjectPropertyList();
  }

  _processGetProjectPropertyList(event, {err, res}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.setState({list: res.list, sum: res.sum});
  }

  _processAddProjectProperty(event, {err}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.getProjectPropertyList();
    this.setState({
      isShowAddModal: false
    });
  }

  onAddHandle(values) {
    values.projectId = this.props.params.projectId;
    ipcRenderer.send('addProjectProperty', values);
  }

  onAddCancel() {
    this.setState({isShowAddModal: false});
  }

  onAddClick() {
    this.setState({isShowAddModal: true});
  }

  onEditCancel() {
    this.setState({isShowEditModal: false});
  }

  onEditHandle(values) {
    values.projectId = this.props.params.projectId;
    if (!this.state.editProperty.id) {
      message.error('内部错误，id为空');
    }
    values.id = this.state.editProperty.id;
    ipcRenderer.send('putProjectProperty', values);
  }

  onDeleteClick(record) {
    Modal.confirm({
      title: '警告',
      content: `确定删除属性【${record.name}】？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        ipcRenderer.send('deleteProjectProperty', {
          id: record.id
        });
      }
    });
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}-header`}>
          <Button
            type="primary"
            onClick={this.onAddClick.bind(this)}
          >
            添加属性
          </Button>
        </div>
        <div className={`${prefixCls}-body`}>
          <Table columns={this.columns}
                 dataSource={this.state.list}
                 pagination={{
                   defaultPageSize: this.state.pageSize,
                   total: this.state.sum,
                   current: this.state.page
                 }}
          />
        </div>
        <AddProperty
          visible={this.state.isShowAddModal}
          onCancel={this.onAddCancel.bind(this)}
          addHandler={this.onAddHandle.bind(this)}
        />
        <EditProperty
          key={this.state.editProperty.id || 'EditProperty'}
          propertyInfo={this.state.editProperty}
          editHandle={this.onEditHandle.bind(this)}
          visible={this.state.isShowEditModal}
          onCancel={this.onEditCancel.bind(this)}/>
      </div>
    );
  }
}
