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

import React from 'react';
import { render } from '@testing-library/react';
import Layout from '.';
import { MemoryRouter } from 'react-router';
import { NETWORK } from '../../contexts/zil-context';

test('matches the snapshot', () => {
  const clearAuth = jest.fn();
  const switchNetwork = jest.fn();
  const isAuth = false;
  const curNetwork = {
    name: NETWORK.TestNet,
    chainId: 333,
    msgVersion: 1,
    nodeUrl: 'https://dev-api.zilliqa.com',
    faucetUrl: 'https://nucleus-server.zilliqa.com/api/v1/run',
    explorerUrl: 'devex.zilliqa.com',
  };
  const zilContext = { curNetwork, isAuth, clearAuth, switchNetwork };

  const { container } = render(
    <MemoryRouter>
      <Layout zilContext={zilContext}>
        <div data-testid="children" />
      </Layout>
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});
