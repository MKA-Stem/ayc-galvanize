import React from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import EncryptPage from 'pages/EncryptPage.js';
import DecryptPage from 'pages/DecryptPage.js';
import AboutPage from 'pages/AboutPage.js';
import 'antd/dist/antd.css';

import logoUrl from 'media/logo.svg';

import './App.css';

const App = () => (
  <div className="App">
    <div>
      <div className="App_container">
        <Link to="/">
          <h1 className="App_brand">
            <img alt="SafeSend" src={logoUrl} width={'40px'} height={'40px'} />
            <span>SafeSend</span>
          </h1>
        </Link>
        <Switch>
          <Route exact path="/" component={EncryptPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route path="/d/:slug" component={DecryptPage} />
          <Route path="*" component={() => <h2>404: Not Found</h2>} />
        </Switch>
      </div>
      <Link className="App_important" to="/about">
        About SafeSend - Why it's important
      </Link>
    </div>
  </div>
);

export default App;
