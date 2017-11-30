/**
 * Created by lhc on 17-11-21.
 */

import React, {Component, PropTypes} from 'react';
import {Menu} from 'antd';
import './index.less';
const prefixCls = 'Header';

export default class Header extends Component {
  static propTypes = {};
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  componentWillMount() {

  }

  onMenuClick(event) {
    switch (event.key) {
      case '项目管理':
        this.context.router.push('/homepage');
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className={`${prefixCls}`}>
        <Menu
          mode="horizontal"
          onClick={this.onMenuClick.bind(this)}
        >
          <Menu.Item key="测量">
            测量
          </Menu.Item>
          <Menu.Item key="测量结果">
            测量结果
          </Menu.Item>
          <Menu.Item key="项目管理">
            项目管理
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
