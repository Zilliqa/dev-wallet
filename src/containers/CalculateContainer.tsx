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
import { BN, units } from '@zilliqa-js/util';
import { Card, FormGroup, Label, Input, Row, Col, Form } from 'reactstrap';
import { useAsync } from 'react-async';
import Layout from '../components/layout';
import Switch from 'react-switch';
import { setValIfWholeNum } from '../utils';

const TxCalculatorContainer = ({ zilContext }) => {
  const { getMinGasPrice } = zilContext;
  const minGasProps = useAsync({ promiseFn: getMinGasPrice });
  const isUpdatingMinGasPrice = minGasProps.isLoading;
  const minGasPriceInQa = minGasProps.data as string;

  const minGasPriceInLi: string = units.fromQa(new BN(minGasPriceInQa), units.Units.Li);

  const [consumed, setConsumed] = useState('');

  const formatConsumed = () => setConsumed(Number(consumed).toString());
  const [gasPriceInput, setGasPriceInput] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const handleSwitch = (checked) => {
    setIsEditable(checked);
    setGasPriceInput(minGasPriceInLi);
  };

  const formatGasPriceInput = () => {
    if (Number(gasPriceInput) < Number(minGasPriceInLi)) {
      setGasPriceInput(Number(minGasPriceInLi).toString());
    }
  };

  const gasPriceInLi: string = isEditable ? gasPriceInput : minGasPriceInLi;
  const gasPriceInQa = units.toQa(new BN(gasPriceInLi), units.Units.Li);
  const gasPriceInZil = units.fromQa(new BN(gasPriceInQa), units.Units.Zil);

  const consumedNum = Number(consumed);
  const gasPriceInZilNum = Number(gasPriceInZil);

  const calculateTxPrice = (gasConsumed: number) => (gasPrice: number) => gasConsumed * gasPrice;

  const txPriceInQa = calculateTxPrice(consumedNum)(Number(gasPriceInQa));
  const txPriceInZil = units.fromQa(new BN(txPriceInQa), units.Units.Zil);

  return (
    <Layout zilContext={zilContext}>
      <div className="p-4">
        <Card>
          <div className="py-5">
            <div className="px-4 text-center">
              <h2 className="pb-2">
                <b>{'Transaction Price Calculator'}</b>
              </h2>
              <Row>
                <Col xs={12} sm={12} md={12} lg={8} className="mr-auto ml-auto">
                  <Form className="mt-4 text-left" onSubmit={(e) => e.preventDefault()}>
                    <FormGroup>
                      <Label for="consumed">
                        <small>
                          <b>{'Gas Consumed'}</b>
                        </small>
                      </Label>
                      <Input
                        id="consumed"
                        type="tel"
                        name="consumed"
                        maxLength={5}
                        data-testid="consumed"
                        value={consumed}
                        onChange={setValIfWholeNum(setConsumed)}
                        onBlur={formatConsumed}
                        placeholder="Enter Gas Consumed"
                        disabled={isUpdatingMinGasPrice}
                      />
                    </FormGroup>
                    <FormGroup>
                      <div data-testid={`container-switch-${isEditable}`}>
                        <div className="py-2">
                          <small>
                            <b>Switch to enter custom gas price</b>
                          </small>
                        </div>
                        <Switch
                          name="isEditable"
                          onChange={handleSwitch}
                          checked={isEditable}
                          disabled={isUpdatingMinGasPrice}
                          width={50}
                          height={20}
                        />
                      </div>
                      {isEditable ? (
                        <>
                          <Label for="gas-price-input">
                            <small>
                              <b>{'Gas Price (Li)'}</b>
                            </small>
                          </Label>
                          <Input
                            id="gas-price-input"
                            type="tel"
                            name="gas-price-input"
                            maxLength={4}
                            data-testid="gas-price-input"
                            value={gasPriceInput}
                            onChange={setValIfWholeNum(setGasPriceInput)}
                            onBlur={formatGasPriceInput}
                            placeholder="Enter Gas Price"
                            disabled={isUpdatingMinGasPrice || !isEditable}
                          />
                          <br />
                        </>
                      ) : null}
                    </FormGroup>

                    <div>
                      <hr />
                      <small>
                        <b>Gas Consumed: {consumedNum}</b>
                      </small>
                      <br />
                      <small>
                        <b>
                          Gas Price:{' '}
                          {isUpdatingMinGasPrice ? (
                            'loading...'
                          ) : (
                            <span>
                              {gasPriceInLi} Li <small>({gasPriceInZilNum} Zil)</small>
                            </span>
                          )}
                        </b>
                      </small>
                      <hr />
                      <div>
                        <b>
                          Transaction Price (Zil) : {txPriceInZil}{' '}
                          <small>
                            ({consumedNum} x {gasPriceInZilNum})
                          </small>
                        </b>
                        <hr />
                      </div>
                    </div>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TxCalculatorContainer;
