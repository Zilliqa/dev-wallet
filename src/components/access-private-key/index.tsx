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
import { Label, Input, FormGroup, Form, FormFeedback } from 'reactstrap';
import Spinner from '../spinner';
import Button from '../button';

import { getInputValidationState } from '../../utils';
import Disclaimer from '../disclaimer';

interface IProps {
  accessWallet: (privateKey: string) => void;
}

interface IState {
  worker: any;
  prevAuthStatus?: string;
  isAccessing: boolean;
  privateKey: string;
  privateKeyValid: boolean;
  privateKeyInvalid: boolean;
  isDisclaimerChecked: boolean;
}

const initialState: IState = {
  worker: undefined,
  isDisclaimerChecked: false,
  prevAuthStatus: undefined,
  isAccessing: false,
  privateKey: '',
  privateKeyValid: false,
  privateKeyInvalid: false,
};

const AccessPrivateKey: React.FunctionComponent<IProps> = (props) => {
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isDisclaimerChecked);
  const [isAccessing, setIsAccessing] = useState(initialState.isAccessing);
  const [privateKey, setPrivateKey] = useState(initialState.privateKey);
  const [privateKeyValid, setPrivateKeyValid] = useState(initialState.privateKeyValid);
  const [privateKeyInvalid, setPrivateKeyInvalid] = useState(initialState.privateKeyInvalid);

  const handleCheck = () => {
    setIsDisclaimerChecked(!isDisclaimerChecked);
  };

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'privateKey';
    const validationResult: any = getInputValidationState(key, value, /^[a-fA-F0-9]{64}$/g);
    setPrivateKeyValid(validationResult.privateKeyValid);
    setPrivateKeyInvalid(validationResult.privateKeyInvalid);
    setPrivateKey(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsAccessing(true);
    return props.accessWallet(privateKey);
  };

  const isSubmitButtonDisabled = !privateKeyValid || isAccessing || !isDisclaimerChecked;
  const submitButtonText = isAccessing ? 'Accessing' : 'Access';
  const description = 'You can access your wallet with private key.';

  return (
    <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
      <FormGroup className="px-5">
        <p className="text-secondary pb-3">{description}</p>
        <Label for="privateKey">
          <small>
            <b>{'Private Key'}</b>
          </small>
        </Label>
        <Input
          id="private-key"
          type="text"
          name="privateKey"
          data-testid="privateKey"
          value={privateKey}
          onChange={changePrivateKey}
          valid={privateKeyValid}
          invalid={privateKeyInvalid}
          // autoComplete="new-password"
          autoComplete="off"
          placeholder="Enter the private key"
          maxLength={64}
        />
        <FormFeedback>{'invalid private key'}</FormFeedback>
        <FormFeedback valid={true}>{'valid private key'}</FormFeedback>
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
              isAccessing ? (
                <span className="pr-1">
                  <Spinner size="small" />
                </span>
              ) : null
            }
            disabled={isSubmitButtonDisabled}
          />
        }
      </div>
    </Form>
  );
};

export default AccessPrivateKey;
