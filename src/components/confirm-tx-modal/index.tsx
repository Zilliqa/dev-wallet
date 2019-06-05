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
import Button from '../button';
import { Modal, ModalHeader, Row, Col } from 'reactstrap';
import SpinnerWithCheckMark from '../spinner-with-check-mark';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Disclaimer from '../disclaimer';
import { getExplorerURL } from '../../utils';

const initialState = {
  isSubmitting: false,
  isComplete: false,
  isFailed: false,
  isDisclaimerChecked: false,
  prevSendTxStatus: undefined
};

const SendTxModal = (props) => {
  const { toAddress, amount, gasPrice, isModalOpen, closeModal, mutationProps } = props;
  const { error, isPending, isFulfilled, data, run } = mutationProps;

  return (
    <Modal isOpen={isModalOpen} toggle={closeModal} size="lg" className="modal-container">
      <ModalHeader className="text-secondary" toggle={closeModal}>
        <b>{'Send Transaction'}</b>
      </ModalHeader>
      <div className="modal-body">
        <Row>
          <Col xs={11} sm={11} md={11} lg={8} className="mr-auto ml-auto">
            {isPending || isFulfilled ? (
              <TransactionProcess closeModal={closeModal} mutationProps={mutationProps} />
            ) : (
              <div>
                <CreateForm
                  toAddress={toAddress}
                  amount={amount}
                  gasPrice={gasPrice}
                  mutationProps={mutationProps}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

const TransactionProcess = ({ closeModal, mutationProps }) => {
  const { isFulfilled, isPending, data } = mutationProps;

  return (
    <div className="text-center pt-5">
      <SpinnerWithCheckMark loading={!isFulfilled} />
      {isPending ? (
        <div className="text-center py-4">
          <p className="text-secondary text-fade-in">
            <b>{'Sending Transaction'}</b>
            <br />
            <small>{'Please kindly wait.'}</small>
          </p>
        </div>
      ) : null}
      {isFulfilled ? (
        <div>
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
              <a target="_blank" href={getExplorerURL(data)} rel="noopener noreferrer">
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

const CreateForm = ({ toAddress, amount, gasPrice, mutationProps }) => {
  const { isPending, run, error } = mutationProps;
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isDisclaimerChecked);

  const onSubmit = () => {
    run(toAddress, amount);
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
          <Button
            text={submitButtonText}
            type="primary"
            onClick={onSubmit}
            ariaLabel={submitButtonText}
            IsSubmitButton={true}
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

export default SendTxModal;
