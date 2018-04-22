import React from 'react';
import {Route, Switch} from 'react-router-dom';
import EncryptPage from 'pages/EncryptPage.js';
import DecryptPage from 'pages/DecryptPage.js';
import 'antd/dist/antd.css';

import './App.css';

const App = () => (
  <div className="App">
    <div className="App_container">
      <Switch>
        <Route exact path="/" component={EncryptPage} />
        <Route path="/d/:slug" component={DecryptPage} />
        <Route path="*" component={() => <h2>404: Not Found</h2>} />
      </Switch>
    </div>
  </div>
);

export default App;
