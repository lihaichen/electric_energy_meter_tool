/**
 * Created by lhc on 17-11-21.
 */
import React, {Component, PropTypes} from 'react';
import Header from '../header/index';
import './index.less';
const prefixCls = 'App';
export default class App extends Component {
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

  render() {
    return (
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}-header`}>
          <Header/>
        </div>
        <div className={`${prefixCls}-body`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
