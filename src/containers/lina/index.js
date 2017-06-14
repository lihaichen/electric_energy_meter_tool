import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
export default class Lina extends Component {
  render() {
    return (
      <div>
        <p>Pudage</p>
        <Link to="/Pudage">跳转到Pudage</Link>
        <img src="images/lina_inverse.jpeg"/>
      </div>
    );
  }
}
