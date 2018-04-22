import React from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import EncryptPage from 'pages/EncryptPage.js';
import DecryptPage from 'pages/DecryptPage.js';
import AboutPage from 'pages/AboutPage.js';
import 'antd/dist/antd.css';

import './App.css';

const App = () => (
  <div className="App">
    <div className="App_container">
      <Switch>
        <Route exact path="/" component={EncryptPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route path="/d/:slug" component={DecryptPage} />
        <Route path="*" component={() => <h2>404: Not Found</h2>} />
      </Switch>
      <Link to="/about">About SafeSend - Why it's important</Link>
    </div>
  </div>
);

export default App;
