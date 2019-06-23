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
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from './containers/home';

import { Spinner } from 'accessible-ui';
import { ZilProvider, ZilContext } from './contexts/zil-context';

export const paths = {
  faucet: '/faucet',
  send: '/send',
  generate: '/generate',
  calculate: '/calculate',
  home: '/home'
};

const Fallback = () => (
  <div className="d-flex align-items-center justify-content-center my-5 py-5">
    <Spinner />
  </div>
);

export const RouterNode = () => (
  <ZilProvider>
    <ZilContext.Consumer>
      {(zilContext) => {
        const RouteList: ReadonlyArray<any> = [
          {
            path: paths.home,
            component: Home
          },
          {
            path: paths.faucet,
            component: lazy(() => import('./containers/faucet'))
          },
          {
            path: paths.send,
            component: lazy(() => import('./containers/send'))
          },
          {
            path: paths.generate,
            component: lazy(() => import('./containers/generate'))
          },
          {
            path: paths.calculate,
            component: lazy(() => import('./containers/calculate'))
          }
        ];

        return (
          <Router>
            <Suspense fallback={<Fallback />}>
              <Switch>
                {RouteList.map((curr) => (
                  <PublicRoute
                    key={curr.path}
                    path={curr.path}
                    zilContext={zilContext}
                    component={curr.component}
                    exact={true}
                  />
                ))}

                <Redirect from="/" to={paths.home} />
              </Switch>
            </Suspense>
          </Router>
        );
      }}
    </ZilContext.Consumer>
  </ZilProvider>
);

const PublicRoute = ({ component: Component, zilContext, ...rest }) => {
  return <Route {...rest} render={(props) => <Component {...props} zilContext={zilContext} />} />;
};
