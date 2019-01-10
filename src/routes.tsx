// @ts-ignore
import React, { Suspense } from 'react';
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from './containers/HomeContainer';
import Login from './containers/AccessContainer';
import Spinner from './components/spinner';

export const paths = {
  signIn: '/sign-in',
  home: '/home'
};

export const RouterNode = () => (
  <Router>
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route exact={true} path={paths.home} component={Home} />
        <Route exact={true} path={paths.signIn} component={Login} />
        <Redirect from="/" to={paths.home} />
      </Switch>
    </Suspense>
  </Router>
);
