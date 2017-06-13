import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Test from './containers/test/test';
import {syncHistoryWithStore} from 'react-router-redux';
import Pudage from './containers/pudage/index';
import RylaiCrestfall from './containers/rylai_crestfall/index';
import Lina from './containers/lina/index';

export default function(store) {
  const history = syncHistoryWithStore(hashHistory, store);
  return (
    <Router history={history}>
      <Route path="/">
        <IndexRoute component={Test}/>
        <Route path="test" component={Test}/>
        <Route path="Pudage" component={Pudage}/>
        <Route path="RylaiCrestfall" component={RylaiCrestfall}/>
        <Route path="Lina" component={Lina}/>
      </Route>
    </Router>
  );
}
