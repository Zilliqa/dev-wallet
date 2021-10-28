/**
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from './containers/home';
import Spinner from './components/spinner';

import { ZilProvider, ZilContext } from './contexts/zil-context';

export const paths = {
  faucet: '/faucet',
  send: '/send',
  generate: '/generate',
  home: '/home',
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
        if (zilContext.curNetwork === undefined) {
          return (
            <p
              style={{
                color: '#555',
                padding: 10,
              }}
            >
              {'Fetching config'}
            </p>
          );
        }
        const RouteList = [
          {
            path: paths.home,
            component: Home,
          },
          {
            path: paths.send,
            component: lazy(() => import('./containers/send')),
          },
          {
            path: paths.generate,
            component: lazy(() => import('./containers/generate')),
          },
          {
            path: paths.faucet,
            component: lazy(() => import('./containers/faucet')),
          },
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

                <Redirect from="/" to={paths.home + window.location.search} />
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
