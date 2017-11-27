/**
 * Created by lhc on 17-11-21.
 */


import React, {Component, PropTypes} from 'react';
import {Form, Input, Select, Button, Row, Col} from 'antd';
const prefixCls = 'ProjectPropertyForm';
const FormItem = Form.Item;
const Option = Select.Option;
class ProjectPropertyForm extends Component {
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
            label="属性名"
          >
            {getFieldDecorator('name', {
              rules: [{required: true, message: '属性名'}],
              initialValue: ''
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="值类型"
          >
            {getFieldDecorator('valueType', {
              rules: [{required: true, message: '值类型'}],
              initialValue: ''
            })(
              <Select>
                <Option value="整型" key="整型">整型</Option>
                <Option value="浮点" key="浮点">浮点</Option>
                <Option value="HEX" key="HEX">HEX</Option>
                <Option value="ASCII" key="ASCII" disabled>ASCII</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="值"
          >
            {getFieldDecorator('value', {
              rules: [{required: true, message: '值'}],
              initialValue: ''
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="数据标识"
          >
            {getFieldDecorator('dateIndicate', {
              rules: [{required: true, message: '数据标识'}],
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
export default Form.create()(ProjectPropertyForm);

