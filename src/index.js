import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import reducer from './redux/reducer';
import createMiddleware from './redux/middleware/clientMiddleware';
import ApiClient from './utils/api_client';
import config from '../config.json';

const client = new ApiClient();
let enhancer;
if (config.isProduction) {
  enhancer = applyMiddleware(createMiddleware(client));
} else {
  enhancer = compose(
    applyMiddleware(createMiddleware(client)),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : func => func
  );
}
const store = createStore(reducer, enhancer);
ReactDOM.render(
  (<Provider store={store}>
    {routes(store)}
  </Provider>), document.getElementById('root'));
