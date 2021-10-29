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

import React, { useState, useEffect } from 'react';
import { Label, Input, FormGroup, Form, FormFeedback } from 'reactstrap';
import Spinner from '../spinner';
import Button from '../button';
import { requestStatus } from '../../constants';

import { getInputValidationState } from '../../utils';
import Disclaimer from '../disclaimer';

const formatFilename = (str: string) => {
  if (str.length > 35) {
    return str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
  }
  return str;
};

interface IProps {
  accessWallet: (privateKey: string) => void;
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
  isAccessing: false,
};

const AccessKeystore: React.FunctionComponent<IProps> = (props) => {
  const [worker, setWorker] = useState(initialState.worker);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isDisclaimerChecked);
  const [decryptStatus, setDecryptStatus] = useState(initialState.decryptStatus);

  const [passphrase, setPassphrase] = useState(initialState.passphrase);
  const [passphraseValid, setPassphraseValid] = useState(initialState.passphraseValid);
  const [passphraseInvalid, setPassphraseInvalid] = useState(initialState.passphraseInvalid);
  const [filename, setFilename] = useState(initialState.filename);
  const [keystoreV3, setKeystoreV3] = useState(initialState.keystoreV3);

  useEffect(() => {
    if (worker === undefined) {
      const myWorker = new Worker('./decrypt.worker', { type: 'module' });

      myWorker.onmessage = (event) => {
        const { data } = event;
        if (data.privateKey === undefined) {
          return setDecryptStatus(requestStatus.FAILED);
        }

        setDecryptStatus(requestStatus.SUCCEEDED);

        props.accessWallet(data.privateKey);
      };
      setWorker(myWorker);
    }
  });

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
    const validationResult: any = getInputValidationState(key, value, /^.{8,}$/);
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

  const isDecrypting = decryptStatus === requestStatus.PENDING;

  const isSubmitButtonDisabled =
    !passphraseValid || keystoreV3 === undefined || isDecrypting || !isDisclaimerChecked;

  const submitButtonText = isDecrypting ? 'Accessing' : 'Access';

  const description = 'You can access your wallet with your keystore file and passphrase.';

  return (
    <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
      <FormGroup className="px-5">
        <p className="text-secondary">{description}</p>
        <div className="py-3">
          <small>
            <b>{'Keystore File'}</b>
          </small>
        </div>
        <Label for="keystoreFile" className="btn btn-secondary cursor-pointer">
          <small>
            <b>{'Import Keystore File (.json)'}</b>
          </small>
        </Label>
        <Input
          type="file"
          name="keystoreFile"
          id="keystoreFile"
          accept="application/json"
          onChange={importkeystoreV3}
        />
        <p className="text-success">{filename ? <small> {filename}</small> : null}</p>
        <br />
        <Label for="passphrase">
          <small>
            <b>{'Passphrase'}</b>
          </small>
        </Label>
        <Input
          id="passphrase"
          type="password"
          name="passphrase"
          data-testid="passphrase"
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
            level="primary"
            onClick={onSubmit}
            before={
              isDecrypting ? (
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
      </div>
    </Form>
  );
};
export default AccessKeystore;
