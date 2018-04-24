import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'components/App';
import registerServiceWorker from 'lib/registerServiceWorker';

import {BrowserRouter as Router} from 'react-router-dom';

import request from 'lib/http.js';

window.request = request;

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
