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

import React, { useState } from 'react';
import SpinnerWithCheckMark from '../spinner-with-check-mark';
import Button from '../button';
import FaucetPending from '../faucet-pending';
import FaucetComplete from '../faucet-complete';

import { CAPTCHA_SITE_KEY } from '../../constants';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAsyncFn } from 'react-fetcha';

const FaucetRequest = ({ faucet, toAddress, reset }) => {
  const { error, isPending, isFulfilled, data, run } = useAsyncFn({
    deferFn: faucet
  });
  const [token, setToken] = useState();

  return (
    <div className="py-4">
      {isPending ? (
        <div data-testid="pending">
          <SpinnerWithCheckMark loading={true} />
          <FaucetPending />
        </div>
      ) : error ? (
        <div data-testid="error">
          <p className="pt-4">
            <small className="text-danger text-fade-in">
              {error.message}
              <br />
              {'Google reCAPTCHA might not work for some country.'}
            </small>
          </p>
          <br />
          <Button text="Try Again" onClick={reset} level="primary" />
        </div>
      ) : isFulfilled ? (
        <div data-testid="fulfilled">
          <SpinnerWithCheckMark loading={false} />
          <FaucetComplete txId={data as string} />
          <br />
          <Button text="Ok" onClick={reset} level="secondary" />
        </div>
      ) : (
        <div data-testid="recaptcha">
          <div className="recaptcha">
            <ReCAPTCHA
              sitekey={CAPTCHA_SITE_KEY}
              onChange={(recaptchaToken) => setToken(recaptchaToken)}
              badge="inline"
            />
          </div>
          <br />
          <Button
            text="Run Faucet"
            onClick={() => run({ token, toAddress })}
            level="primary"
            disabled={token === undefined}
          />
        </div>
      )}
    </div>
  );
};

export default FaucetRequest;
