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
import { Card } from 'reactstrap';
import SpinnerWithCheckMark from '../spinner-with-check-mark';

import FaucetPending from '../faucet-pending';
import FaucetComplete from '../faucet-complete';
import Recaptcha from '../recaptcha';
import { useAsync } from 'react-async';

const FaucetForm = ({ faucet }) => {
  const { error, isPending, isFulfilled, data, run } = useAsync({
    deferFn: faucet
  });

  return (
    <div>
      <div className="pt-4">
        <Card>
          <div className="py-5">
            <div className="px-4 text-center">
              <h2 className="pb-2">
                <b>{'ZIL Faucet'}</b>
              </h2>
              <p className="text-secondary">
                {'Please run the faucet to receive a small amount of Zil for testing.'}
              </p>
              <div className="py-4">
                {isPending ? (
                  <div>
                    <SpinnerWithCheckMark loading={true} />
                    <FaucetPending />
                  </div>
                ) : isFulfilled ? (
                  <div>
                    <SpinnerWithCheckMark loading={false} />
                    {data ? <FaucetComplete txId={data as string} /> : null}
                  </div>
                ) : (
                  <div>
                    <Recaptcha onChange={(token) => run(token)} />
                    {error ? (
                      <p className="pt-4">
                        <small className="text-danger text-fade-in">
                          {error.message}
                          <br />
                          {'Google reCAPTCHA might not work for some country.'}
                        </small>
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default FaucetForm;
