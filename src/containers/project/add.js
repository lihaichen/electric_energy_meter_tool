/**
 * Created by lhc on 2017/11/19.
 */
import React, {Component, PropTypes} from 'react';
import ProjectForm from './projectForm';
import {Modal} from 'antd';
const prefixCls = 'AddProject';

export default class AddProject extends Component {
  static propTypes = {
    addHandler: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  // 构造
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        className={`${prefixCls}`}
        title="添加"
        visible={this.props.visible}
        footer={null}
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <ProjectForm handleSubmit={this.props.addHandler.bind(this)}/>
      </Modal>
    );
  }
}
