import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'components/App';
import registerServiceWorker from 'lib/registerServiceWorker';

import {BrowserRouter as Router} from 'react-router-dom';

import EncryptPage from './pages/EncryptPage.js';
import DecryptPage from './pages/DecryptPage.js';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
