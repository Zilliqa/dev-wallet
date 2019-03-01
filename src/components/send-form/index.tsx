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

import React, { useState, useEffect } from 'react';
import { Card, Label, Input, FormGroup, Form, Row, Col, FormFeedback } from 'reactstrap';
import { BN, units } from '@zilliqa-js/util';
import Button from '../button';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import { getInputValidationState } from '../../utils';
import ConfirmTxModal from '../confirm-tx-modal';
import { AccountInfo } from '../account-info';
import { requestStatus } from '../../constants';

interface IProps {
  sendTx: (toAddress, amount, gasPrice) => void;
  clear: () => void;
  getMinGasPrice: () => void;
  minGasPriceInQa: string;
  getMinGasPriceStatus?: string;
  getBalance: () => void;
  balanceInQa: string;
  getBalanceStatus?: string;
  sendTxStatus?: string;
  publicKey: string;
  address: string;
  network: string;
  sendTxId?: string;
}

interface IState {
  toAddress: string;
  toAddressValid: boolean;
  toAddressInvalid: boolean;
  amount: string;
  isSendingTx: boolean;
  gasPrice: string;
  gasPriceInQa: string;
  isUpdatingGasPrice: boolean;
  isModalOpen: boolean;
}

const initialState: IState = {
  isModalOpen: false,
  toAddress: '',
  toAddressValid: false,
  toAddressInvalid: false,
  amount: '',
  isSendingTx: false,
  gasPrice: '0',
  gasPriceInQa: '0',
  isUpdatingGasPrice: false
};

const SendForm: React.FunctionComponent<IProps> = (props) => {
  const {
    address,
    sendTxStatus,
    sendTxId,
    getBalance,
    balanceInQa,
    getBalanceStatus,
    minGasPriceInQa,
    getMinGasPriceStatus,
    getMinGasPrice
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(initialState.isModalOpen);
  const [toAddress, setToAddress] = useState(initialState.toAddress);
  const [toAddressValid, setToAddressValid] = useState(initialState.toAddressValid);
  const [toAddressInvalid, setToAddressInvalid] = useState(initialState.toAddressInvalid);
  const [amount, setAmount] = useState(initialState.amount);

  const isUpdatingBalance = getBalanceStatus === requestStatus.PENDING;
  useEffect(
    () => {
      if (getBalanceStatus === undefined) {
        getBalance();
      }
    },
    [balanceInQa]
  );

  const isUpdatingMinGasPrice = getMinGasPriceStatus === requestStatus.PENDING;
  useEffect(
    () => {
      if (getMinGasPriceStatus === undefined) {
        getMinGasPrice();
      }
    },
    [minGasPriceInQa]
  );

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
    const validationResult: any = getInputValidationState(key, value, /^[a-zA-Z0-9]{40}$/);
    setToAddress(value);
    setToAddressValid(validationResult.toAddressValid);
    setToAddressInvalid(validationResult.toAddressInvalid);
  };

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    setAmount(e.target.value);
  };

  const isBalanceInsufficient = new BN(balanceInQa).lte(new BN(minGasPriceInQa));
  const isSendButtonDisabled =
    toAddressInvalid ||
    toAddress === initialState.toAddress ||
    amount === initialState.amount ||
    isBalanceInsufficient;
  const sendButtonText = 'Send';

  const minGasPriceInZil = units.fromQa(new BN(minGasPriceInQa), units.Units.Zil);

  return (
    <div>
      <AccountInfo
        address={address}
        balanceInQa={balanceInQa}
        getBalance={getBalance}
        isUpdatingBalance={isUpdatingBalance}
      />
      <Row className="pt-4">
        <Col xs={12} sm={12} md={10} lg={10} className="mr-auto">
          <Card>
            <div className="py-5">
              <div className="px-4 text-center">
                <h2 className="pb-2">
                  <b>{'Send'}</b>
                </h2>
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
                        data-test-id="toAddress"
                        value={toAddress}
                        onChange={changeToAddress}
                        valid={toAddressValid}
                        invalid={toAddressInvalid}
                        placeholder="Enter the Address to Send"
                        maxLength={40}
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
                        type="number"
                        name="amount"
                        data-test-id="amount"
                        value={amount}
                        onChange={changeAmount}
                        placeholder="Enter the Amount"
                      />
                    </FormGroup>
                    <br />
                    <FormGroup>
                      <Label for="gasPrice">
                        <small>
                          <b>{'Gas Price (ZILs)'}</b>
                        </small>
                      </Label>
                      <Input
                        id="gasPrice"
                        type="number"
                        name="gasPrice"
                        data-test-id="gasPrice"
                        value={minGasPriceInZil}
                        disabled={isUpdatingMinGasPrice || true}
                        placeholder={'Loading gas price'}
                      />
                      {isUpdatingMinGasPrice ? (
                        <small className="text-secondary">loading</small>
                      ) : null}
                    </FormGroup>
                    <div className="py-4 text-center">
                      <Button
                        text={sendButtonText}
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
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      {isModalOpen ? (
        <ConfirmTxModal
          sendTxId={sendTxId}
          sendTxStatus={sendTxStatus}
          toAddress={toAddress}
          amount={amount}
          gasPrice={minGasPriceInZil}
          isModalOpen={isModalOpen}
          sendTx={props.sendTx}
          closeModal={closeModal}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  balanceInQa: state.zil.balanceInQa,
  getBalanceStatus: state.zil.getBalanceStatus,
  minGasPriceInQa: state.zil.minGasPriceInQa,
  getMinGasPriceStatus: state.zil.getMinGasPriceStatus,
  sendTxStatus: state.zil.sendTxStatus,
  sendTxId: state.zil.sendTxId,
  network: state.zil.network,
  address: state.zil.address,
  publicKey: state.zil.publicKey,
  zilliqa: state.zil.zilliqa
});

const mapDispatchToProps = (dispatch) => ({
  sendTx: (toAddress, amount) => dispatch(zilActions.sendTx(toAddress, amount)),
  clear: () => dispatch(zilActions.clear()),
  getBalance: () => dispatch(zilActions.getBalance()),
  getMinGasPrice: () => dispatch(zilActions.getMinGasPrice())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendForm);
