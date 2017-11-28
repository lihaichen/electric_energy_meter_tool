/**
 * Created by lhc on 17-11-27.
 */
import React, {Component, PropTypes} from 'react';
import PropertyForm from './form';
import {Modal} from 'antd';
const prefixCls = 'EditProperty';
export default class EditProperty extends Component {
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
        title="修改属性"
        visible={this.props.visible}
        footer={null}
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <PropertyForm handleSubmit={this.props.addHandler.bind(this)}/>
      </Modal>
    );
  }
}
