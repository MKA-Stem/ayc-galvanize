import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Create from 'pages/Create.js';

const App = () => (
  <Switch>
    <Route exact path="/" component={Create} />
    <Route path="*" component={() => <h2>404: Not Found</h2>} />
  </Switch>
);

export default App;
