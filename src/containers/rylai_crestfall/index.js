import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
export default class RylaiCrestfall extends Component {
  render() {
    return (
      <div>
        <p>Pudage</p>
        <Link to="/Lina">跳转到lina</Link>
        <img src="images/rylai_crestfall.jpeg"/>
      </div>
    );
  }
}
