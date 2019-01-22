// @ts-ignore
import React, { Suspense } from 'react';
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from './containers/HomeContainer';
import FaucetContainer from './containers/FaucetContainer';
import SendContainer from './containers/SendContainer';
import GenerateContainer from './containers/GenerateContainer';
import Spinner from './components/spinner';

export const paths = {
  faucet: '/faucet',
  send: '/send',
  generate: '/generate',
  home: '/home'
};

export const RouterNode = () => (
  <Router>
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route exact={true} path={paths.home} component={Home} />
        <Route exact={true} path={paths.faucet} component={FaucetContainer} />
        <Route exact={true} path={paths.send} component={SendContainer} />
        <Route exact={true} path={paths.generate} component={GenerateContainer} />
        <Redirect from="/" to={paths.home} />
      </Switch>
    </Suspense>
  </Router>
);
