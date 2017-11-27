import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Test from './containers/test/test';
import {syncHistoryWithStore} from 'react-router-redux';
import HomePage from './containers/homepage/index';
import App from './component/app/index';
import ProjectPropertyList from './containers/project_property/list';

export default function(store) {
  const history = syncHistoryWithStore(hashHistory, store);
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={HomePage}/>
        <Route path="/homepage" component={HomePage}/>
        <Route path="/projectPropertyList/:projectId" component={ProjectPropertyList}/>
        <Route path="/test" component={Test}/>
      </Route>
    </Router>
  );
}
