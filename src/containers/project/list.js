/**
 * Created by lhc on 2017/11/19.
 */
import React, {Component, PropTypes} from 'react';
import {Button, message, Input, Table, Icon, Modal} from 'antd';
import AddProject from './add';
import SelectProject from './selectProject';
import {ipcRenderer} from 'electron';
import moment from 'moment';
const prefixCls = 'ProjectList';
import {Link} from 'react-router';
import './list.less';

export default class ProjectList extends Component {
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
      // 是否显示选择项目模态
      isShowSelectModal: false,
      // 添加项目表单值
      addFormValues: {}
    };
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
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
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text) => {
          return <span>{moment.unix(text).format('YYYY-MM-DD hh:mm:ss')}</span>;
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <Link to={`/projectPropertyList/${record.id}`}>
              <Icon type="edit" style={{'fontSize': '18px'}}/>
            </Link>
            <Link onClick={this.onDeleteClick.bind(this, record)}>
              <Icon type="delete" style={{'fontSize': '18px', 'paddingLeft': '10px'}}/>
            </Link>
          </div>
        )
      },
    ];
    this.processGetProjectList = this._processGetProjectList.bind(this);
    this.processAddProject = this._processAddProject.bind(this);
    this.processDeleteProject = this._processDeleteProject.bind(this);
  }

  componentWillMount() {
    ipcRenderer.on('getProjectList', this.processGetProjectList);
    ipcRenderer.on('addProject', this.processAddProject);
    ipcRenderer.on('deleteProject', this.processDeleteProject);
    this.getProjectList();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('getProjectList', this.processGetProjectList);
    ipcRenderer.removeListener('addProject', this.processAddProject);
    ipcRenderer.removeListener('deleteProject', this.processDeleteProject);
  }

  onDeleteClick(record) {
    Modal.confirm({
      title: '警告',
      content: `确定删除项目【${record.name}】？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        ipcRenderer.send('deleteProject', {
          id: record.id
        });
      }
    });
  }

  getProjectList() {
    ipcRenderer.send('getProjectList', {
      page: this.state.page,
      pageSize: this.state.pageSize
    });
  }

  _processDeleteProject(event, {err}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.getProjectList();
  }

  _processGetProjectList(event, {err, res}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.setState({list: res.list, sum: res.sum});
  }

  _processAddProject(event, {err}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.getProjectList();
  }

  onAddHandle(values) {
    this.setState({
      isShowAddModal: false,
      isShowSelectModal: true,
      addFormValues: values
    });
  }

  onAddCancel() {
    this.setState({isShowAddModal: false});
  }

  onAddClick() {
    this.setState({isShowAddModal: true});
  }

  onProjectSelect(record) {
    this.state.addFormValues.selectId = record ? record.id : null;
    ipcRenderer.send('addProject', this.state.addFormValues);
    this.setState({isShowSelectModal: false});
  }

  onProjectSelectCancel() {
    this.setState({isShowSelectModal: false});
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}-header`}>
          <Button
            type="primary"
            onClick={this.onAddClick.bind(this)}
          >
            添加项目
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
        <AddProject
          addHandler={this.onAddHandle.bind(this)}
          onCancel={this.onAddCancel.bind(this)}
          visible={this.state.isShowAddModal}
        />
        <SelectProject
          onSelect={this.onProjectSelect.bind(this)}
          visible={this.state.isShowSelectModal}
          onCancel={this.onProjectSelectCancel.bind(this)}
        />
      </div>
    );
  }
}
