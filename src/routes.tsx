/**
 * This file is part of nucleus-wallet.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * nucleus-wallet is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * nucleus-wallet is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * nucleus-wallet.  If not, see <http://www.gnu.org/licenses/>.
 */

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
