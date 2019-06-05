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
import { Card, Label, Input, FormGroup, Form, Row, Col, FormFeedback } from 'reactstrap';
import { BN, units } from '@zilliqa-js/util';
import Button from '../button';
import { getInputValidationState, formatSendAmountInZil } from '../../utils';
import ConfirmTxModal from '../confirm-tx-modal';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { useAsync } from 'react-async';

const SendForm = ({ send, getBalance, getMinGasPrice }) => {
  const minGasProps = useAsync({ promiseFn: getMinGasPrice });
  const minGasPriceInQa = minGasProps.data as string;
  const isUpdatingMinGasPrice = minGasProps.isLoading;

  const minGasPriceInZil: string = units.fromQa(new BN(minGasPriceInQa), units.Units.Zil);

  const balanceProps = useAsync({ promiseFn: getBalance });
  const balanceInQa = balanceProps.data as string;
  const isUpdatingBalance = balanceProps.isLoading;

  const balanceInZil: string = units.fromQa(new BN(balanceInQa), units.Units.Zil);

  const mutationProps = useAsync({
    deferFn: send
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [toAddressValid, setToAddressValid] = useState(false);
  const [toAddressInvalid, setToAddressInvalid] = useState(false);
  const [amount, setAmount] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
    setToAddress('');
    setToAddressValid(false);
    setToAddressInvalid(false);
    setAmount('');
  };

  const changeToAddress = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'toAddress';
    const validationResult: any = getInputValidationState(key, value, isBech32(value));
    setToAddress(value);
    setToAddressValid(validationResult.toAddressValid);
    setToAddressInvalid(validationResult.toAddressInvalid);
  };

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  const formatAmount = (): void => {
    if (amount !== 'initialState.amount') {
      const amountInZil: string = parseFloat(amount).toFixed(3);

      const amountFormattedInZil = formatSendAmountInZil(
        amountInZil,
        balanceInZil,
        minGasPriceInZil
      );
      setAmount(amountFormattedInZil);
    }
  };

  const isBalanceInsufficient = new BN(balanceInQa).lte(new BN(minGasPriceInQa));
  const isSendButtonDisabled =
    toAddressInvalid || toAddress === '' || amount === '' || isBalanceInsufficient;

  return (
    <div>
      <div className="pt-4">
        <Card>
          <div className="py-5">
            <div className="px-4 text-center">
              <h2 className="pb-2">
                <b>{'Send'}</b>
              </h2>
              <Row>
                <Col xs={12} sm={12} md={12} lg={8} className="mr-auto ml-auto">
                  <Form className="mt-4 text-left" onSubmit={(e) => e.preventDefault()}>
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
                        placeholder="Enter the Address to Send"
                        maxLength={42}
                      />
                      <FormFeedback>{'invalid address'}</FormFeedback>
                      <FormFeedback valid={true}>{'valid address'}</FormFeedback>
                    </FormGroup>
                    <br />
                    <FormGroup>
                      <Label for="amount">
                        <small>
                          <b>{'Amount to Send (ZILs)'}</b>
                        </small>
                      </Label>
                      <Input
                        id="amount"
                        type="tel"
                        name="amount"
                        maxLength={10}
                        data-testid="amount"
                        value={amount}
                        onChange={changeAmount}
                        placeholder="Enter the Amount"
                        onBlur={formatAmount}
                        disabled={isUpdatingBalance || isUpdatingMinGasPrice}
                      />
                    </FormGroup>
                    <small className="text-secondary">
                      Gas Price: {isUpdatingMinGasPrice ? 'loading...' : `${minGasPriceInZil} ZIL`}
                    </small>
                    <br />
                    <div className="py-5 text-center">
                      <Button
                        text={'Send'}
                        type="primary"
                        ariaLabel={'sendButtonText'}
                        onClick={() => setIsModalOpen(true)}
                        disabled={isSendButtonDisabled}
                      />
                    </div>
                    {isBalanceInsufficient && !isUpdatingBalance ? (
                      <p className="text-center text-danger">
                        <small>
                          {'Your balance is not sufficient to send transaction.'}
                          <br />
                          {`Minimum Gas Price: ${minGasPriceInZil} ZIL`}
                        </small>
                      </p>
                    ) : null}
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </div>
      {isModalOpen ? (
        <ConfirmTxModal
          mutationProps={mutationProps}
          toAddress={toAddress}
          amount={amount}
          gasPrice={minGasPriceInZil}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
        />
      ) : null}
    </div>
  );
};

export default SendForm;
