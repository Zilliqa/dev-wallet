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

import React from 'react';
import { render } from '@testing-library/react';
import Header from '.';
import { MemoryRouter } from 'react-router';
import { NETWORK } from '../../contexts/zil-context';

test('matches the snapshot', () => {
  const clearAuth = jest.fn();
  const switchNetwork = jest.fn();
  const isAuth = false;
  const { container } = render(
    <MemoryRouter>
      <Header
        isAuth={isAuth}
        clearAuth={clearAuth}
        curNetwork={{
          name: NETWORK.TestNet,
          chainId: 333,
          msgVersion: 1,
          nodeUrl: 'https://dev-api.zilliqa.com',
          faucetUrl: 'https://some-api.zilliqa.com/api/v1/faucet',
          explorerUrl: 'devex.zilliqa.com',
        }}
        switchNetwork={switchNetwork}
      />
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});

test('matches the snapshot', () => {
  const clearAuth = jest.fn();
  const switchNetwork = jest.fn();
  const isAuth = true;
  const { container } = render(
    <MemoryRouter>
      <Header
        isAuth={isAuth}
        clearAuth={clearAuth}
        curNetwork={{
          name: NETWORK.TestNet,
          chainId: 333,
          msgVersion: 1,
          nodeUrl: 'https://dev-api.zilliqa.com',
          faucetUrl: 'https://some-api.zilliqa.com/api/v1/faucet',
          explorerUrl: 'devex.zilliqa.com',
        }}
        switchNetwork={switchNetwork}
      />
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});
