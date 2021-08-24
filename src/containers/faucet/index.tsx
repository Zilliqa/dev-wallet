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
import { Card, FormGroup, Label, Input, FormFeedback, Row, Col, Form } from 'reactstrap';
import Layout from '../../components/layout';
import FaucetRequest from '../../components/faucet-request';

import { getInputValidationState } from '../../utils';
import { isBech32 } from '@zilliqa-js/util/dist/validation';

const FaucetContainer = ({ zilContext }) => {
  const { faucet, curNetwork } = zilContext;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const initialAddress = params['address'];

  let isInitialAddressValid = false;
  if (initialAddress !== undefined) {
    isInitialAddressValid = isBech32(initialAddress);
  }

  const [toAddress, setToAddress] = useState(initialAddress);
  const [toAddressValid, setToAddressValid] = useState(isInitialAddressValid);
  const [toAddressInvalid, setToAddressInvalid] = useState(
    initialAddress !== undefined && !isInitialAddressValid
  );

  const changeToAddress = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'toAddress';
    const validationResult: any = getInputValidationState(key, value, isBech32(value));
    setToAddress(value);
    setToAddressValid(validationResult.toAddressValid);
    setToAddressInvalid(validationResult.toAddressInvalid);
  };

  const reset = () => {
    setToAddress('');
    setToAddressValid(false);
    setToAddressInvalid(false);
  };

  return (
    <Layout zilContext={zilContext}>
      <div className="p-4">
        <Card>
          <div className="py-5">
            <div className="px-4 text-center">
              <h2 className="pb-2">
                <b>{'ZIL Faucet'}</b>
              </h2>
              <p className="text-secondary">
                {'Please run the faucet to receive a small amount of Zil for testing.'}
              </p>
              <Row>
                <Col xs={12} sm={12} md={12} lg={8} className="mr-auto ml-auto">
                  <Form className="mt-4 text-left">
                    <FormGroup>
                      <Label for="Address">
                        <small>
                          <b>{'To Address'}</b>
                        </small>
                      </Label>
                      <Input
                        id="toAddress"
                        type="text"
                        name="toAddress"
                        data-testid="to-address"
                        value={toAddress}
                        onChange={changeToAddress}
                        valid={toAddressValid}
                        invalid={toAddressInvalid}
                        placeholder="Enter Your Test Net Account Address"
                        maxLength={42}
                      />
                      <FormFeedback>{'invalid address'}</FormFeedback>
                      <FormFeedback valid={true}>{'valid address'}</FormFeedback>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              {toAddressValid ? (
                <FaucetRequest
                  faucet={faucet}
                  toAddress={toAddress}
                  reset={reset}
                  curNetwork={curNetwork}
                />
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default FaucetContainer;
