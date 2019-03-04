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
import Button from '../button';
import Steps, { Step } from 'rc-steps';

// @ts-ignore
import Worker from '../../encrypt.worker';

import Spinner from '../spinner';
import { getInputValidationState, downloadObjectAsJson } from '../../utils';
import { requestStatus } from '../../constants';
import Disclaimer from '../disclaimer';

const FIRST_STEP = 0;
const SECOND_STEP = 1;
const FINAL_STEP = 2;

interface IState {
  worker: any;
  isDisclaimerChecked: boolean;
  passphrase: string;
  passphraseValid: boolean;
  passphraseInvalid: boolean;
  keystoreJSON?: string;
  currentStep: number;
  encryptStatus?: string;
  privateKey?: string;
}

const initialState: IState = {
  worker: undefined,
  isDisclaimerChecked: false,
  passphrase: '',
  passphraseValid: false,
  passphraseInvalid: false,
  encryptStatus: undefined,
  keystoreJSON: undefined,
  privateKey: undefined,
  currentStep: FIRST_STEP
};

const GenerateForm: React.FunctionComponent = (props) => {
  const [worker, setWorker] = useState(initialState.worker);
  const [encryptStatus, setEncryptStatus] = useState(initialState.encryptStatus);
  const [keystoreJSON, setKeystoreJSON] = useState(initialState.keystoreJSON);
  const [privateKey, setPrivateKey] = useState(initialState.privateKey);
  useEffect(() => {
    if (worker === undefined) {
      const myWorker = new Worker();

      myWorker.onmessage = (event) => {
        const { data } = event;
        if (data.keystoreJSON === undefined || data.privateKey === undefined) {
          return setEncryptStatus(requestStatus.FAILED);
        }
        setKeystoreJSON(data.keystoreJSON);
        setPrivateKey(data.privateKey);
      };
      setWorker(myWorker);
    }
  });

  useEffect(
    () => {
      if (privateKey && keystoreJSON) {
        downloadKeystore();
      }
    },
    [privateKey, keystoreJSON]
  );

  const [passphrase, setPassphrase] = useState(initialState.passphrase);
  const [passphraseValid, setPassphraseValid] = useState(initialState.passphraseValid);
  const [passphraseInvalid, setPassphraseInvalid] = useState(initialState.passphraseInvalid);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isDisclaimerChecked);

  const [currentStep, setCurrentStep] = useState(initialState.currentStep);

  const handleCheck = () => {
    setIsDisclaimerChecked(!isDisclaimerChecked);
  };

  const generateKeystore = () => {
    setEncryptStatus(requestStatus.PENDING);
    worker.postMessage({ passphrase });
  };

  const downloadKeystore = () => {
    if (typeof keystoreJSON !== 'string') {
      return;
    }
    const keystoreObject = JSON.parse(keystoreJSON);
    const filename = `zilliqa_keystore_${new Date().toISOString()}`;

    setCurrentStep(FINAL_STEP);
    setEncryptStatus(requestStatus.SUCCEED);
    downloadObjectAsJson(keystoreObject, filename);
  };

  const changePassphrase = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'passphrase';
    const validationResult: any = getInputValidationState(key, value, /^.{8,}$/);
    setPassphrase(value);
    setPassphraseValid(validationResult.passphraseValid);
    setPassphraseInvalid(validationResult.passphraseInvalid);
  };

  const renderPassphraseStep = () => {
    const isDisabled = !passphraseValid || !isDisclaimerChecked;

    return (
      <div>
        <div className="text-center">
          <h2 className="pt-5">
            <b>{'Set Passphrase for your Keystore File'}</b>
          </h2>
          <p className="text-secondary py-3">
            {`This is your first step in creating your Klaytn Wallet.`}
            <br />
            {`Please set the password for the keystore file for your new wallet.`}
          </p>
        </div>
        <div>
          <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Label for="passphrase">
                <small>
                  <b>{'Passphrase'}</b>
                </small>
              </Label>
              <Input
                id="passphrase"
                type="password"
                name="passphrase"
                data-test-id="passphrase"
                value={passphrase}
                onChange={changePassphrase}
                valid={passphraseValid}
                invalid={passphraseInvalid}
                placeholder="Enter the passphrase"
                // autoComplete="new-password"
                autoComplete="off"
                maxLength={32}
                minLength={8}
              />
              <FormFeedback>{'invalid passphrase'}</FormFeedback>
              <FormFeedback valid={true}>{'valid passphrase'}</FormFeedback>
            </FormGroup>
            <br />

            <div className="px-3">
              <FormGroup inline={true}>
                <Label check={isDisclaimerChecked} onChange={handleCheck}>
                  <Input type="checkbox" /> <Disclaimer />
                </Label>
              </FormGroup>
              <div className="text-center">
                <Button
                  text={'Confirm'}
                  type="primary"
                  ariaLabel={'Confirm'}
                  onClick={() => setCurrentStep(SECOND_STEP)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  const renderFinalStep = () => {
    return (
      <div>
        <div className="text-center">
          <h2 className="pt-5">
            <b>{'Please Save your Private Key'}</b>
          </h2>
          <p className="text-secondary py-3">
            {`Your new wallet has been created.`}
            <br />
            {`Make sure to COPY the private key below and SAVE it.`}
          </p>
        </div>

        <br />
        <small>
          <b>Private Key</b>
        </small>
        <p className="text-primary py-3">
          <code className="text-primary">{privateKey}</code>
        </p>
      </div>
    );
  };

  const renderKeystoreStep = () => {
    const isPending = encryptStatus === requestStatus.PENDING;
    const buttonText = isPending ? 'Generating Keystore File' : 'Generate Keystore File';
    return (
      <div>
        <div className="text-center">
          <h2 className="pt-5">
            <b>{'Generate Keystore File'}</b>
          </h2>
          <p className="text-secondary py-3">
            {`The password for your keystore file for a new wallet has been set. Please click the tab below to generate your keystore to setup your wallet and move on to the last step.`}
          </p>
        </div>
        <div className="py-4 text-center">
          <Button
            text={buttonText}
            type="primary"
            ariaLabel={buttonText}
            onClick={generateKeystore}
            before={
              isPending ? (
                <span className="pr-1">
                  <Spinner size="small" />
                </span>
              ) : null
            }
            disabled={isPending}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card>
        <div className="py-5">
          <Row>
            <Col xs={11} sm={11} md={10} lg={8} className="mr-auto ml-auto">
              <Steps size="small" current={currentStep}>
                <Step title="Passphrase" />
                <Step title="Keystore" />
                <Step title="Complete" />
              </Steps>
            </Col>
            <Col xs={10} sm={10} md={8} lg={7} className="mr-auto ml-auto">
              {currentStep === FIRST_STEP ? renderPassphraseStep() : null}
              {currentStep === SECOND_STEP ? renderKeystoreStep() : null}
              {currentStep === FINAL_STEP ? renderFinalStep() : null}
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default GenerateForm;
