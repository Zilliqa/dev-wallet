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

interface IProps {
  sendTx: (toAddress, amount, gasPrice) => void;
  clear: () => void;
  sendTxStatus?: string;
  publicKey: string;
  address: string;
  network: string;
  zilliqa: any;
  txInfo: any;
}

interface IState {
  toAddress: string;
  toAddressValid: boolean;
  toAddressInvalid: boolean;
  amount: string;
  isSendingTx: boolean;
  balance: string;
  balanceInQa: string;
  isUpdatingBalance: boolean;
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
  balance: '0',
  balanceInQa: '0',
  isUpdatingBalance: false,
  gasPrice: '0',
  gasPriceInQa: '0',
  isUpdatingGasPrice: false
};

const SendForm: React.FunctionComponent<IProps> = (props) => {
  const { zilliqa, address, sendTxStatus, txInfo } = props;

  const [isModalOpen, setIsModalOpen] = useState(initialState.isModalOpen);
  const [toAddress, setToAddress] = useState(initialState.toAddress);
  const [toAddressValid, setToAddressValid] = useState(initialState.toAddressValid);
  const [toAddressInvalid, setToAddressInvalid] = useState(initialState.toAddressInvalid);
  const [amount, setAmount] = useState(initialState.amount);

  const [balance, setBalance] = useState(initialState.balance);
  const [balanceInQa, setBalanceInQa] = useState(initialState.balanceInQa);
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(initialState.isUpdatingBalance);
  useEffect(
    () => {
      if (!isUpdatingBalance) {
        getBalance();
      }
    },
    [balance]
  );

  const [gasPrice, setGasPrice] = useState(initialState.gasPrice);
  const [gasPriceInQa, setGasPriceInQa] = useState(initialState.gasPrice);
  const [isUpdatingGasPrice, setIsUpdatingGasPrice] = useState(initialState.isUpdatingGasPrice);
  useEffect(
    () => {
      if (!isUpdatingGasPrice) {
        getGasPrice();
      }
    },
    [gasPrice]
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

  const getGasPrice = async () => {
    setIsUpdatingGasPrice(true);
    try {
      const response = await zilliqa.blockchain.getMinimumGasPrice();
      const minGasPriceInQa: string = response.result;
      const minGasPriceInZil = units.fromQa(new BN(minGasPriceInQa), units.Units.Zil); // Minimum gasPrice measured in Qa, converting to Zil.

      setGasPriceInQa(`${minGasPriceInQa}`);
      setGasPrice(`${minGasPriceInZil}`);
      setIsUpdatingGasPrice(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    setIsUpdatingBalance(true);
    try {
      const response = await zilliqa.blockchain.getBalance(address);

      if (response.error) {
        setIsUpdatingBalance(false);
      } else {
        if (response.result) {
          const myBalanceInQa = response.result.balance;
          setBalanceInQa(myBalanceInQa);
          const balanceInZil = units.fromQa(new BN(myBalanceInQa), units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.
          setBalance(balanceInZil);
          setIsUpdatingBalance(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsUpdatingBalance(false);
    }
  };

  const isBalanceInsufficient = new BN(balanceInQa).lte(new BN(gasPriceInQa));
  const isSendButtonDisabled =
    toAddressInvalid ||
    toAddress === initialState.toAddress ||
    amount === initialState.amount ||
    isBalanceInsufficient;
  const sendButtonText = 'Send';

  return (
    <div>
      <AccountInfo
        address={address}
        balance={balance}
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
                        value={gasPrice}
                        disabled={isUpdatingGasPrice || true}
                        placeholder={'Loading gas price'}
                      />
                      {isUpdatingGasPrice ? (
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
                          {`Minimum Gas Price: ${gasPrice} ZIL`}
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
          txInfo={txInfo}
          sendTxStatus={sendTxStatus}
          toAddress={toAddress}
          amount={amount}
          gasPrice={gasPrice}
          isModalOpen={isModalOpen}
          sendTx={props.sendTx}
          closeModal={closeModal}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  sendTxStatus: state.zil.sendTxStatus,
  txInfo: state.zil.txInfo,
  network: state.zil.network,
  address: state.zil.address,
  publicKey: state.zil.publicKey,
  zilliqa: state.zil.zilliqa
});

const mapDispatchToProps = (dispatch) => ({
  sendTx: (toAddress, amount, gasPrice) => dispatch(zilActions.sendTx(toAddress, amount, gasPrice)),
  clear: () => dispatch(zilActions.clear())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendForm);
