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
import { useAsync } from 'react-async';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Button from '../button';
import { MdRefresh } from 'react-icons/md';
import { toBech32Address } from '@zilliqa-js/crypto';
import { units, BN } from '@zilliqa-js/util';

const AccountInfo = ({ address, getBalance }) => {
  const bech32Address = toBech32Address(address);
  const { data, error, isLoading, reload } = useAsync({ promiseFn: getBalance });

  return (
    <div>
      <div className="px-4">
        <h5>
          <b>{'Account Info'}</b>
        </h5>
        <div className="d-flex">
          <div className="py-2">
            {bech32Address ? (
              <Jazzicon diameter={100} seed={jsNumberForAddress(bech32Address)} />
            ) : null}
          </div>
          <div className="px-4 text-left text-secondary">
            <small>
              <b>{'Address'}</b>
              <p className="pt-1 font-monospace">{`${bech32Address}`}</p>
              <b>
                {'Balance'}
                <Button
                  type="tertiary"
                  text={''}
                  before={<MdRefresh />}
                  onClick={reload}
                  disabled={isLoading}
                  ariaLabel={'Update Balance'}
                  className="mb-1 py-0 px-1"
                />
              </b>
            </small>
            {isLoading ? (
              <div data-testid="container-loading">
                <small>Loading...</small>
              </div>
            ) : error ? (
              <div data-testid="container-error">{`Something went wrong: ${error.message}`}</div>
            ) : data ? (
              <div>
                <small>{`${units.fromQa(new BN(data as string), units.Units.Zil)} ZIL`}</small>
              </div>
            ) : (
              <div data-testid="container-no-data">No data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
