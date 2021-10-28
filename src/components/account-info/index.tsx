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

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Button from '../button';
import CopyToClipboard from '../copy-to-clipboard';
import { MdRefresh } from 'react-icons/md';
import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto';
import { units, BN } from '@zilliqa-js/util';
import { useAsyncFn } from '../../use-async-fn';

const AccountInfo = ({ privateKey, publicKey, address, getBalance, curNetwork }) => {
  const bech32Address = toBech32Address(address);
  const { data, error, isPending, run } = useAsyncFn({ fn: getBalance });
  const getAddressExplorerURL = (bechAddress) => {
    return `${curNetwork.explorerUrl}/address/${bechAddress}?network=${encodeURIComponent(
      curNetwork.nodeUrl
    )}`;
  };

  return (
    <div>
      <div className="px-4">
        <h5>
          <b>{'Account Info'}</b>
        </h5>
        <div className="d-flex">
          <div className="py-2">
            {bech32Address ? (
              <Jazzicon
                diameter={100}
                seed={jsNumberForAddress(fromBech32Address(bech32Address))}
              />
            ) : null}
          </div>
          <div className="px-4 text-left text-secondary">
            <b>{'Address'}</b>
            <p className="pt-1 font-monospace">
              <a
                target="_blank"
                href={getAddressExplorerURL(bech32Address)}
                rel="noopener noreferrer"
              >{`${bech32Address}`}</a>{' '}
              <CopyToClipboard data={bech32Address} />
              <br />
              <small>{`(ByStr20: ${address})`}</small>
            </p>
            <b>{'Public Key'}</b>
            <p>
              <code>{publicKey.slice(0, 16)}...</code> <CopyToClipboard data={publicKey} />
            </p>
            <b>{'Private Key'}</b>
            <p>
              <code>{privateKey.slice(0, 16)}...</code> <CopyToClipboard data={privateKey} />
            </p>
            <b>
              {'Balance'}
              <Button
                level="tertiary"
                text={''}
                before={<MdRefresh />}
                onClick={run}
                disabled={isPending}
                className="mb-1 py-0 px-1"
              />
            </b>
            {isPending ? (
              <div data-testid="container-loading">
                <small>Loading...</small>
              </div>
            ) : error ? (
              <div data-testid="container-error">{`Something went wrong: ${error.message}`}</div>
            ) : data ? (
              <div data-testid="container-data">
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
