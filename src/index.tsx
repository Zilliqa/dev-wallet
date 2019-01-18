import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-steps/assets/index.css';
import './index.css';

import { RouterNode } from './routes';
import * as serviceWorker from './serviceWorker';
import { store } from './redux/store';
import './firebase';

ReactDOM.render(
  <Provider store={store}>
    <RouterNode />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
