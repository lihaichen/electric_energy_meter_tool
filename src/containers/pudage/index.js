import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
export default class Pudage extends Component {
  render() {
    return (
      <div>
        <p>Pudage</p>
        <Link to="/RylaiCrestfall">跳转到冰女</Link>
        <img src="images/pudge.jpeg"/>
      </div>
    );
  }
}
