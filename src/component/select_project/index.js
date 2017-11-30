/**
 * Created by lhc on 2017/11/19.
 */
import React, {Component, PropTypes} from 'react';
import {Button, message, Table, Modal, Row, Col} from 'antd';
import {ipcRenderer} from 'electron';
const prefixCls = 'SelectProject';

export default class SelectProject extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      page: 1,
      pageSize: 5,
      // 项目列表
      list: [],
      // 总数量
      sum: 0,
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
      }
    ];
    this.processGetProjectList = this._processGetProjectList.bind(this);
  }

  componentWillMount() {
    ipcRenderer.on('getProjectList', this.processGetProjectList);
    ipcRenderer.send('getProjectList', {
      page: this.state.page,
      pageSize: this.state.pageSize
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('getProjectList', this.processGetProjectList);
  }

  _processGetProjectList(event, {err, res}) {
    if (err) {
      message.error(err);
      return null;
    }
    this.setState({list: res.list, sum: res.sum});
  }

  render() {
    return (
      <Modal
        className={`${prefixCls}`}
        title="选择项目模板"
        visible={this.props.visible}
        footer={null}
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <Table
          columns={this.columns}
          onRowClick={(record) => this.props.onSelect(record)}
          dataSource={this.state.list}
          pagination={{
            defaultPageSize: this.state.pageSize,
            total: this.state.sum,
            current: this.state.page
          }}
        />
        <Row>
          <Col offset={10}>
            <Button
              onClick={() => this.props.onSelect()}
              className={`${prefixCls}-button`}>
              保存
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}
