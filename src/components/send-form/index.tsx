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

import React, { useState } from 'react';
import { Card, Label, Input, FormGroup, Form, Row, Col, FormFeedback } from 'reactstrap';
import { BN, units } from '@zilliqa-js/util';
import Button from '../button';
import { getInputValidationState, formatSendAmountInZil, setValIfWholeNum } from '../../utils';
import SpinnerWithCheckMark from '../spinner-with-check-mark';
import Disclaimer from '../disclaimer';

import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { useAsyncFn } from '../../use-async-fn';

const SendForm = ({ send, getBalance, getMinGasPrice, curNetwork }) => {
  const [hasRun, setHasRun] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [toAddress, setToAddress] = useState('');
  const [toAddressValid, setToAddressValid] = useState(false);
  const [toAddressInvalid, setToAddressInvalid] = useState(false);
  const [amount, setAmount] = useState('');

  const minGasProps = useAsyncFn({ fn: getMinGasPrice });
  const minGasPriceInQa = minGasProps.data as string;
  const isUpdatingMinGasPrice = minGasProps.isPending;

  const minGasPriceInZil: string = units.fromQa(new BN(minGasPriceInQa), units.Units.Zil);

  const balanceProps = useAsyncFn({ fn: getBalance });
  const balanceInQa = balanceProps.data as string;
  const isUpdatingBalance = balanceProps.isPending;

  const balanceInZil: string = units.fromQa(new BN(balanceInQa), units.Units.Zil);

  const mutationProps = useAsyncFn({
    fn: send,
    deferred: true,
  });

  const confirm = () => {
    setIsDraft(true);
    setHasRun(false);
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

  const formatAmount = async (): Promise<void> => {
    await balanceProps.run();
    if (amount !== '') {
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

              {isDraft ? (
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
                          onChange={setValIfWholeNum(setAmount)}
                          placeholder="Enter the Amount"
                          onBlur={formatAmount}
                          disabled={isUpdatingBalance || isUpdatingMinGasPrice}
                        />
                      </FormGroup>
                      <small className="text-secondary">
                        Gas Price:{' '}
                        {isUpdatingMinGasPrice ? 'loading...' : `${minGasPriceInZil} ZIL`}
                      </small>
                      <br />
                      <div className="py-5 text-center">
                        <Button
                          text={'Send'}
                          level="primary"
                          onClick={() => setIsDraft(false)}
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
              ) : (
                <Row>
                  <Col xs={11} sm={11} md={11} lg={8} className="mr-auto ml-auto">
                    {hasRun ? (
                      <TransactionProcess
                        confirm={confirm}
                        mutationProps={mutationProps}
                        curNetwork={curNetwork}
                      />
                    ) : (
                      <div>
                        <CreateForm
                          setIsDraft={setIsDraft}
                          setHasRun={setHasRun}
                          toAddress={toAddress}
                          amount={amount}
                          gasPrice={minGasPriceInZil}
                          mutationProps={mutationProps}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const TransactionProcess = ({ confirm, mutationProps, curNetwork }) => {
  const { isFulfilled, isPending, error, data } = mutationProps;
  const getTxExplorerURL = (txId) => {
    return `${curNetwork.explorerUrl}/tx/${txId}?network=${encodeURIComponent(curNetwork.nodeUrl)}`;
  };
  return (
    <div className="text-center pt-5">
      {isPending ? (
        <div className="text-center">
          <div className="py-3">
            <SpinnerWithCheckMark loading={true} />
          </div>
          <p className="pt-4 text-secondary text-fade-in">
            <b>{'Sending Transaction'}</b>
            <br />
            <small>{'Please kindly wait.'}</small>
          </p>
        </div>
      ) : error ? (
        <div data-testid="container-error">{error.message}</div>
      ) : isFulfilled ? (
        <>
          <div className="py-3">
            <SpinnerWithCheckMark loading={false} />
          </div>
          <p className="pt-4 text-secondary">
            <span className="text-primary">{'Transaction In Process'}</span>
            <br />
            <br />
            <small>{'the transaction is pending blockchain confirmation.'}</small>
            <br />
            <small>{'Please check after a few minutes.'}</small>
          </p>
          {data ? (
            <u>
              <a target="_blank" href={getTxExplorerURL(data)} rel="noopener noreferrer">
                {'View Your Transaction'}
              </a>
            </u>
          ) : null}
          <br />
          <div className="py-5">
            <Button text={'Confirm'} level="primary" onClick={confirm} />
          </div>
        </>
      ) : null}
    </div>
  );
};

const CreateForm = ({ setIsDraft, toAddress, amount, gasPrice, setHasRun, mutationProps }) => {
  const { isPending, run, error } = mutationProps;
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);

  const onSubmit = () => {
    setHasRun(true);
    run({ toAddress, amount });
  };

  const isSubmitButtonDisabled = isPending || !isDisclaimerChecked;
  const submitButtonText = 'Confirm';
  return (
    <div>
      <small className="text-secondary">
        <b>Transaction Info:</b>
      </small>
      <div className="card p-3 mt-3">
        <small className="my-1 text-secondary">
          <b>{'To Address'}</b>
        </small>
        <span className="font-monospace">{toAddress}</span>
        <hr className="my-2" />
        <small className="my-1 text-secondary">
          <b>{'Amount to Send'}</b>
        </small>
        {amount} ZIL
        <hr className="my-2" />
        <small className="my-1 text-secondary">
          <b>{'Gas Price'}</b>
        </small>
        {gasPrice} ZIL
      </div>
      <br />
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup inline={true} className="px-5 text-center">
          <Label
            check={isDisclaimerChecked}
            onChange={() => setIsDisclaimerChecked(!isDisclaimerChecked)}
          >
            <Input type="checkbox" /> <Disclaimer />
          </Label>
        </FormGroup>
        <div className="text-center pt-2 pb-4">
          <Button text={'Back'} level="secondary" onClick={() => setIsDraft(true)} />{' '}
          <Button
            text={submitButtonText}
            level="primary"
            onClick={onSubmit}
            disabled={isSubmitButtonDisabled}
          />
          {error ? (
            <p className="text-danger pt-4 text-fade-in">
              <small>{error.message}</small>
            </p>
          ) : null}
        </div>
      </Form>
    </div>
  );
};

export default SendForm;
