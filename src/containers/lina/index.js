import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
export default class Lina extends Component {
  render() {
    return (
      <div>
        <p>Pudage</p>
        <Link to="">跳转到lina</Link>
        <img src="images/lina_inverse.jpeg"/>
      </div>
    );
  }
}
