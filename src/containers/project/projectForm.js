/**
 * Created by lhc on 2017/11/19.
 */

import React, {Component, PropTypes} from 'react';
import {Form, Input, Icon, Button, Row, Col} from 'antd';
const prefixCls = 'ProjectForm';
const FormItem = Form.Item;

class ProjectForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  };

  // 构造
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.handleSubmit(values);
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    return (
      <div className={`${prefixCls}`}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormItem
            {...formItemLayout}
            label="项目名"
          >
            {getFieldDecorator('name', {
              rules: [{required: true, message: '项目名'}],
              initialValue: ''
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('describe', {
              rules: [{required: true, message: '描述'}],
              initialValue: ''
            })(
              <Input/>
            )}
          </FormItem>
          <Row>
            <Col offset={10}>
              <Button type="primary" htmlType="submit"
                      className={`${prefixCls}-button`}>
                保存
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ProjectForm);
