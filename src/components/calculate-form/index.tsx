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
import { FormGroup, Label, Input, Form, CustomInput } from 'reactstrap';
import { setValIfWholeNum } from '../../utils';

const consumedOptions = [
  { key: 's-Z-T', label: 'Normal Transfer of Zils', val: '1' },
  { key: 's-FT-D', label: 'Fungible Token Deployment', val: '5441' },
  { key: 's-FT-T', label: 'Fungible Token Transfer', val: '491' },
  { key: 's-NFT-D', label: 'Non-fungible Token Deployment', val: '12746' },
  { key: 's-NFT-T', label: 'Non-fungible Token Transfer', val: '484' }
];

const CalculateForm = ({ minGasPriceInQa }) => {
  const minGasPriceInLi: string = units.fromQa(new BN(minGasPriceInQa), units.Units.Li);

  const [consumed, setConsumed] = useState(consumedOptions[0].val);
  const [isConsumedEditable, setIsConsumeEditable] = useState(false);
  const [gasPriceInput, setGasPriceInput] = useState('');
  const [isGasPriceEditable, setIsGasPriceEditable] = useState(false);

  const gasPriceInLi: string = isGasPriceEditable ? gasPriceInput : minGasPriceInLi;
  const gasPriceInQa = units.toQa(new BN(gasPriceInLi), units.Units.Li);
  const gasPriceInZil = units.fromQa(new BN(gasPriceInQa), units.Units.Zil);

  const formatConsumed = () => setConsumed(Number(consumed).toString());
  const handleRadio = (val) => () => {
    if (isConsumedEditable) {
      setIsConsumeEditable(false);
    }
    setConsumed(val);
  };

  const handleConsumedSwitch = () => {
    if (isConsumedEditable) {
      setConsumed(consumedOptions[0].val);
    } else {
      setConsumed('0');
    }
    setIsConsumeEditable(!isConsumedEditable);
  };

  const formatGasPriceInput = () => {
    if (Number(gasPriceInput) < Number(minGasPriceInLi)) {
      setGasPriceInput(Number(minGasPriceInLi).toString());
    }
  };

  const handleGasPriceSwitch = () => {
    setIsGasPriceEditable(!isGasPriceEditable);
    setGasPriceInput(minGasPriceInLi);
  };

  const calculateTxPrice = (gasConsumed: number) => (gasPrice: number) => gasConsumed * gasPrice;

  const consumedNum = Number(consumed);
  const gasPriceInZilNum = Number(gasPriceInZil);

  const txFeeInQa = calculateTxPrice(consumedNum)(Number(gasPriceInQa));
  const txFeeInZil = units.fromQa(new BN(txFeeInQa), units.Units.Zil);

  return (
    <Form className="text-left" onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <div className="py-2">
          {consumedOptions.map(({ key, label, val }) => (
            <div key={key}>
              <CustomInput
                className="py-1"
                type="radio"
                id={val}
                checked={consumed === val}
                name="consumed-radio"
                label={<small>{label}</small>}
                onChange={handleRadio(val)}
              />
            </div>
          ))}
        </div>
        <CustomInput
          type="switch"
          id="is-consumed-editable"
          name="is-consumed-editable"
          label={<small>Switch to enter custom gas consumed</small>}
          onChange={handleConsumedSwitch}
          checked={isConsumedEditable}
        />
        {isConsumedEditable ? (
          <div className="py-3">
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
            />
          </div>
        ) : null}
      </FormGroup>
      <hr />
      <FormGroup>
        <CustomInput
          type="switch"
          id="is-gas-price-editable"
          name="is-gas-price-editable"
          label={<small>Switch to enter custom gas price</small>}
          onChange={handleGasPriceSwitch}
          checked={isGasPriceEditable}
        />

        {isGasPriceEditable ? (
          <div className="py-3">
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
              disabled={!isGasPriceEditable}
            />
          </div>
        ) : null}
      </FormGroup>
      <div>
        <hr />
        <small>
          <b>
            Gas Consumed <span className="text-danger">*</span> : {consumedNum}
          </b>
        </small>
        <br />
        <small>
          <b>
            Gas Price :{' '}
            <span>
              {gasPriceInLi} Li <small>({gasPriceInZilNum} Zil)</small>
            </span>
          </b>
        </small>
        <hr />
        <div>
          <b>
            Transaction Fee (Zil) : {txFeeInZil}{' '}
            <small>
              ({consumedNum} x {gasPriceInZilNum})
            </small>
          </b>
        </div>
        <hr />
        <p>
          <small>
            <b>
              <span className="text-danger">*</span>
            </b>{' '}
            {`Disclaimer: The “Gas Consumed” is an approximate value based on the current gas required for Zil transfer and implementation of fungible-token and non-fungible-token contracts `}
            <a
              href="https://github.com/Zilliqa/scilla/tree/master/tests/contracts"
              target="_blank"
              rel="noopener noreferrer"
            >
              here.
            </a>
            {
              ' The figures are accurate as of 22-06-2019. Actual numbers might vary based on factors such the size of the contract state.'
            }
          </small>
        </p>
      </div>
    </Form>
  );
};

export default CalculateForm;
