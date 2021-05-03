import loadable from '@loadable/component';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Home = loadable(() => import('@pages/Home'));
const Admin = loadable(() => import('@pages/Admin'));

const App = () => (
  <>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/admin" component={Admin} />
    </Switch>
  </>
);

export default App;
