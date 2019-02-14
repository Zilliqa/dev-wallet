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
import { PASSPHRASE_REGEX } from '../../regex';
import Button from '../button';
import Spinner from '../spinner';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import { requestStatus } from '../../constants';

// @ts-ignore
import Worker from '../../decrypt.worker';
import { getInputValidationState } from '../../utils';
import { Disclaimer } from '../disclaimer';

const formatFilename = (str: string) => {
  if (str.length > 35) {
    return str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
  }
  return str;
};

interface IProps {
  accessWallet: (privateKey: string) => void;
  authStatus?: string;
}

interface IState {
  worker: any;
  decryptStatus?: string;
  isAccessing: boolean;
  passphrase: string;
  passphraseValid: boolean;
  passphraseInvalid: boolean;
  filename: string;
  keystoreV3?: any;
  isDisclaimerChecked: boolean;
}

const initialState: IState = {
  worker: undefined,
  isDisclaimerChecked: false,
  decryptStatus: undefined,
  passphrase: '',
  passphraseValid: false,
  passphraseInvalid: false,
  filename: '',
  keystoreV3: undefined,
  isAccessing: false
};

const AccessForm: React.FunctionComponent<IProps> = (props) => {
  const { authStatus } = props;
  const [worker, setWorker] = useState(initialState.worker);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isDisclaimerChecked);
  const [decryptStatus, setDecryptStatus] = useState(initialState.decryptStatus);
  const [prevAuthStatus, setPrevAuthStatus] = useState(initialState.decryptStatus);
  const [passphrase, setPassphrase] = useState(initialState.passphrase);
  const [passphraseValid, setPassphraseValid] = useState(initialState.passphraseValid);
  const [passphraseInvalid, setPassphraseInvalid] = useState(initialState.passphraseInvalid);
  const [filename, setFilename] = useState(initialState.filename);
  const [keystoreV3, setKeystoreV3] = useState(initialState.keystoreV3);
  const [isAccessing, setIsAccessing] = useState(initialState.isAccessing);

  useEffect(() => {
    if (worker === undefined) {
      const myWorker = new Worker();

      myWorker.onmessage = (event) => {
        const { data } = event;
        if (data.privateKey === undefined) {
          return setDecryptStatus(requestStatus.FAILED);
        }

        setDecryptStatus(requestStatus.SUCCEED);
        setIsAccessing(true);

        props.accessWallet(data.privateKey);
      };
      setWorker(myWorker);
    }
  });

  useEffect(
    () => {
      const isFailed =
        authStatus === requestStatus.FAILED && prevAuthStatus === requestStatus.PENDING;
      const isSucceeded =
        authStatus === requestStatus.SUCCEED && prevAuthStatus === requestStatus.PENDING;

      if (isFailed || isSucceeded) {
        setIsAccessing(false);
      }
      setPrevAuthStatus(prevAuthStatus);
    },
    [authStatus, prevAuthStatus]
  );

  const handleCheck = () => {
    setIsDisclaimerChecked(!isDisclaimerChecked);
  };

  const importkeystoreV3 = (e): void => {
    e.preventDefault();
    try {
      const files = e.target.files;
      const reader = new FileReader();
      reader.onload = () => {
        const myFilename = formatFilename(files[0].name);
        setFilename(myFilename);
        setKeystoreV3(reader.result);
      };
      reader.readAsText(files[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const changePassphrase = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'passphrase';
    const regex = PASSPHRASE_REGEX;
    const validationResult: any = getInputValidationState(key, value, regex);
    setPassphraseValid(validationResult.passphraseValid);
    setPassphraseInvalid(validationResult.passphraseInvalid);
    setPassphrase(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setDecryptStatus(requestStatus.PENDING);
    const keystoreV3Json = JSON.parse(keystoreV3);
    worker.postMessage({ passphrase, keystoreV3: keystoreV3Json });
  };

  const messageForDecryptFailure = `Decryption failed. Please check your keystore file and passphrase.`;
  const messageForaccessWalletFailure = `Access Failed.`;

  const isDecrypting = decryptStatus === requestStatus.PENDING;

  let isSubmitButtonDisabled = false;

  if (
    !passphraseValid ||
    keystoreV3 === undefined ||
    isDecrypting ||
    isAccessing ||
    !isDisclaimerChecked
  ) {
    isSubmitButtonDisabled = true;
  }

  let submitButtonText = isDecrypting ? 'Decrypting' : 'Access';

  if (isAccessing) {
    submitButtonText = 'Accessing';
  }

  return (
    <div>
      <Card>
        <div className="pb-5 sign-in-form-container">
          <Row>
            <Col xs={10} sm={10} md={8} lg={7} className="mr-auto ml-auto">
              <div className="text-center">
                <h2 className="pt-5">
                  <b>{'Access Existing Wallet'}</b>
                </h2>
                <p className="text-secondary py-3">
                  {'You can access your wallet with your keystore file and passphrase.'}
                </p>
              </div>
              <div>
                <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                  <FormGroup className="px-5">
                    <div className="py-3">
                      <small>
                        <b>{'Keystore File'}</b>
                      </small>
                    </div>
                    <Label for="keystoreFile" className="btn type-secondary btn-file">
                      <small>
                        <b>{'Import Keystore File (.json)'}</b>
                      </small>
                    </Label>
                    <Input
                      type="file"
                      name="file"
                      id="keystoreFile"
                      accept="application/json"
                      onChange={importkeystoreV3}
                    />
                    <p className="text-success">{filename ? <small> {filename}</small> : null}</p>
                    <br />
                    <Label for="Passphrase">
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
                  <FormGroup className="mx-4 px-5" inline={true}>
                    <Label check={isDisclaimerChecked} onChange={handleCheck}>
                      <Input type="checkbox" /> <Disclaimer />
                    </Label>
                  </FormGroup>
                  <div className="text-center">
                    {
                      <Button
                        text={submitButtonText}
                        type="primary"
                        onClick={onSubmit}
                        ariaLabel="private key submit"
                        IsSubmitButton={true}
                        before={
                          isDecrypting || isAccessing ? (
                            <span className="pr-1">
                              <Spinner size="small" />
                            </span>
                          ) : null
                        }
                        disabled={isSubmitButtonDisabled}
                      />
                    }
                    {decryptStatus === requestStatus.FAILED ? (
                      <p className="text-danger text-fade-in py-3">
                        <small>{messageForDecryptFailure}</small>
                      </p>
                    ) : null}
                    {authStatus === requestStatus.FAILED ? (
                      <p className="text-danger text-fade-in py-3">
                        <small>{messageForaccessWalletFailure}</small>
                      </p>
                    ) : null}
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authStatus: state.zil.authStatus
});

const mapDispatchToProps = (dispatch) => ({
  accessWallet: (privateKey: string) => dispatch(zilActions.accessWallet(privateKey))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccessForm);
