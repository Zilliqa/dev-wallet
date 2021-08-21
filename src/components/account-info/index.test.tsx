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
import { render, wait } from '@testing-library/react';
import AccountInfo from '.';
import { NETWORK } from '../../contexts/zil-context';
const curNetwork = {
  name: NETWORK.TestNet,
  chainId: 333,
  msgVersion: 1,
  nodeUrl: 'https://dev-api.zilliqa.com',
  faucetUrl: 'https://nucleus-server.zilliqa.com/api/v1/run',
  explorerUrl: 'devex.zilliqa.com',
};
test('matches the snapshot when loaded', async () => {
  const getBalance = jest.fn().mockResolvedValue('100000');
  const address = '0x3C9Ff642E17aF5Cc0C109593C9864d4529B247A0';
  const { container, getByTestId } = render(
    <AccountInfo address={address} getBalance={getBalance} curNetwork={curNetwork} />
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot when loaded', async () => {
  const getBalance = jest.fn().mockResolvedValue('100000');
  const address = '0x3C9Ff642E17aF5Cc0C109593C9864d4529B247A0';
  const { container, getByTestId } = render(
    <AccountInfo address={address} getBalance={getBalance} curNetwork={curNetwork} />
  );

  await wait(() => getByTestId('container-data'));
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot when failed', async () => {
  const getBalance = jest.fn().mockRejectedValue('Intended Error');
  const address = '0x3C9Ff642E17aF5Cc0C109593C9864d4529B247A0';
  const { container, getByTestId } = render(
    <AccountInfo address={address} getBalance={getBalance} curNetwork={curNetwork} />
  );
  await wait(() => getByTestId('container-error'));
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot when no data', async () => {
  const getBalance = jest.fn().mockResolvedValue(undefined);
  const address = '0x3C9Ff642E17aF5Cc0C109593C9864d4529B247A0';
  const { container, getByTestId } = render(
    <AccountInfo address={address} getBalance={getBalance} curNetwork={curNetwork} />
  );
  await wait(() => getByTestId('container-no-data'));
  expect(container.firstChild).toMatchSnapshot();
});
