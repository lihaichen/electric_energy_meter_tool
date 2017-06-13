import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Test from './containers/test/test';
import {syncHistoryWithStore} from 'react-router-redux';

export default function(store) {
  const history = syncHistoryWithStore(hashHistory, store);
  return (
    <Router history={history}>
      <Route path="/">
        <IndexRoute component={Test}/>
        <Route path="test" component={Test}/>
      </Route>
    </Router>
  );
}
