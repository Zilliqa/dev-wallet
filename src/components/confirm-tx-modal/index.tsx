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
import Button from '../button';
import { Modal, ModalHeader, Row, Col } from 'reactstrap';
import { requestStatus, EXPLORER_URL } from '../../constants';
import SpinnerWithCheckMark from '../spinner-with-check-mark';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Disclaimer } from '../disclaimer';

interface IProps {
  sendTx: (toAddress, amount, gasPrice) => void;
  isModalOpen: boolean;
  toAddress: string;
  amount: string;
  gasPrice: string;
  sendTxStatus?: string;
  closeModal: () => void;
  txInfo: any;
}

interface IState {
  isSubmitting: boolean;
  isComplete: boolean;
  isFailed: boolean;
  isDisclaimerChecked: boolean;
  prevSendTxStatus?: string;
}

const initialState: IState = {
  isSubmitting: false,
  isComplete: false,
  isFailed: false,
  isDisclaimerChecked: false,
  prevSendTxStatus: requestStatus.PENDING
};

const SendTxModal: React.FunctionComponent<IProps> = (props) => {
  const {
    toAddress,
    amount,
    gasPrice,
    isModalOpen,
    txInfo,
    closeModal,
    sendTx,
    sendTxStatus
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(initialState.isSubmitting);
  const [isComplete, setIsComplete] = useState(initialState.isSubmitting);
  const [isFailed, setIsFailed] = useState(initialState.isSubmitting);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isSubmitting);
  const [prevSendTxStatus, setPrevSendTxStatus] = useState(initialState.prevSendTxStatus);

  useEffect(
    () => {
      if (prevSendTxStatus === requestStatus.PENDING && sendTxStatus === requestStatus.FAILED) {
        setIsSubmitting(false);
        setIsComplete(false);
        setIsFailed(true);
        setIsDisclaimerChecked(false);
      }
      if (prevSendTxStatus === requestStatus.PENDING && sendTxStatus === requestStatus.SUCCEED) {
        setIsSubmitting(false);
        setIsComplete(true);
        setIsFailed(false);
        setIsDisclaimerChecked(false);
      }
      setPrevSendTxStatus(sendTxStatus);
    },
    [sendTxStatus, prevSendTxStatus]
  );

  const handleCheck = () => {
    setIsDisclaimerChecked(!isDisclaimerChecked);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    sendTx(toAddress, amount, gasPrice);
  };

  const renderTransactionProcess = () => {
    let txId;
    if (txInfo) {
      txId = txInfo.id;
    }

    return (
      <div className="text-center pt-5">
        <SpinnerWithCheckMark loading={!isComplete} />
        {isSubmitting ? (
          <div className="text-center py-4">
            <p className="text-secondary text-fade-in">
              <b>{'Sending Transaction'}</b>
              <br />
              <small>{'Please kindly wait.'}</small>
            </p>
          </div>
        ) : null}
        {isComplete ? (
          <div>
            <p className="pt-4 text-secondary">
              <span className="text-primary">{'Transaction In Process'}</span>
              <br />
              <br />
              <small>{'the transaction is pending blockchain confirmation.'}</small>
              <br />
              <small>{'Please check after a few minutes.'}</small>
            </p>
            {txId ? (
              <u>
                <a target="_blank" href={`${EXPLORER_URL}/transactions/${txId}`} rel="noreferrer">
                  {'View Your Transaction'}
                </a>
              </u>
            ) : null}
            <br />
            <div className="py-5">
              <Button text={'Confirm'} type="primary" onClick={closeModal} ariaLabel={'Confirm'} />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderCreateForm = () => {
    const isSubmitButtonDisabled = isSubmitting || !isDisclaimerChecked;
    const submitButtonText = 'Confirm';
    const messageForTxFailure = 'Failed to send transaction. Please try again later.';
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
            <Label check={isDisclaimerChecked} onChange={handleCheck}>
              <Input type="checkbox" /> <Disclaimer />
            </Label>
          </FormGroup>
          <div className="text-center pt-2 pb-4">
            <Button
              text={submitButtonText}
              type="primary"
              onClick={onSubmit}
              ariaLabel={submitButtonText}
              IsSubmitButton={true}
              disabled={isSubmitButtonDisabled}
            />
            {isFailed ? (
              <p className="text-danger pt-4 text-fade-in">
                <small>{messageForTxFailure}</small>
              </p>
            ) : null}
          </div>
        </Form>
      </div>
    );
  };

  return (
    <Modal isOpen={isModalOpen} toggle={closeModal} size="lg" className="modal-container">
      <ModalHeader className="text-secondary" toggle={closeModal}>
        <b>{'Send Transaction'}</b>
      </ModalHeader>
      <div className="modal-body">
        <Row>
          <Col xs={11} sm={11} md={11} lg={8} className="mr-auto ml-auto">
            {isSubmitting || isComplete ? (
              renderTransactionProcess()
            ) : (
              <div>{renderCreateForm()}</div>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default SendTxModal;
