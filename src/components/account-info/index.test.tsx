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

import { render, waitFor } from '@testing-library/react';
import AccountInfo from '.';
import { NETWORK } from '../../contexts/zil-context';

const publicKey = '0245DC2911EDC02F2774E0A40FBEB0112EA60BF513F9EC50889D59FC94C97EC18F';
const privateKey = '0245DC2911EDC02F2774E0A40FBEB0112EA60BF513F9EC50889D59FC94C97EC18F';
const address = '0x3C9Ff642E17aF5Cc0C109593C9864d4529B247A0';
const curNetwork = {
  name: NETWORK.TestNet,
  chainId: 333,
  msgVersion: 1,
  nodeUrl: 'https://dev-api.zilliqa.com',
  faucetUrl: 'https://some-api.zilliqa.com/api/v1/faucet',
  explorerUrl: 'devex.zilliqa.com',
};
test('matches the snapshot when loaded', async () => {
  const getBalance = jest.fn().mockResolvedValue('100000');
  const { container, getByTestId } = render(
    <AccountInfo
      privateKey={privateKey}
      publicKey={publicKey}
      address={address}
      getBalance={getBalance}
      curNetwork={curNetwork}
    />
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot when loaded', async () => {
  const getBalance = jest.fn().mockResolvedValue('100000');
  const { container, getByTestId } = render(
    <AccountInfo
      privateKey={privateKey}
      publicKey={publicKey}
      address={address}
      getBalance={getBalance}
      curNetwork={curNetwork}
    />
  );

  await waitFor(() => getByTestId('container-data'));
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot when failed', async () => {
  const getBalance = jest.fn().mockRejectedValue('Intended Error');
  const { container, getByTestId } = render(
    <AccountInfo
      privateKey={privateKey}
      publicKey={publicKey}
      address={address}
      getBalance={getBalance}
      curNetwork={curNetwork}
    />
  );
  await waitFor(() => getByTestId('container-error'), { timeout: 1000 });
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot when no data', async () => {
  const getBalance = jest.fn().mockResolvedValue(undefined);
  const { container, getByTestId } = render(
    <AccountInfo
      privateKey={privateKey}
      publicKey={publicKey}
      address={address}
      getBalance={getBalance}
      curNetwork={curNetwork}
    />
  );
  await waitFor(() => getByTestId('container-no-data'));
  expect(container.firstChild).toMatchSnapshot();
});
