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
import { Label, Input, FormGroup, Form, FormFeedback } from 'reactstrap';
import Button from '../button';
import Spinner from '../spinner';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import { requestStatus } from '../../constants';

import { getInputValidationState } from '../../utils';
import Disclaimer from '../disclaimer';

interface IProps {
  accessWallet: (privateKey: string) => void;
  authStatus?: string;
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
  privateKeyInvalid: false
};

const AccessPrivateKey: React.FunctionComponent<IProps> = (props) => {
  const { authStatus } = props;
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(initialState.isDisclaimerChecked);
  const [prevAuthStatus, setPrevAuthStatus] = useState(initialState.prevAuthStatus);
  const [isAccessing, setIsAccessing] = useState(initialState.isAccessing);
  const [privateKey, setPrivateKey] = useState(initialState.privateKey);
  const [privateKeyValid, setPrivateKeyValid] = useState(initialState.privateKeyValid);
  const [privateKeyInvalid, setPrivateKeyInvalid] = useState(initialState.privateKeyInvalid);

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

  let isSubmitButtonDisabled = false;
  if (!privateKeyValid || isAccessing || !isDisclaimerChecked) {
    isSubmitButtonDisabled = true;
  }

  let submitButtonText = 'Access';
  if (isAccessing) {
    submitButtonText = 'Accessing';
  }

  return (
    <Form className="mt-4" onSubmit={(e) => e.preventDefault()}>
      <FormGroup className="px-5 pt-5">
        <Label for="privateKey">
          <small>
            <b>{'Private Key'}</b>
          </small>
        </Label>
        <Input
          id="private-key"
          type="text"
          name="privateKey"
          data-test-id="privateKey"
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
            type="primary"
            onClick={onSubmit}
            ariaLabel="private key submit"
            IsSubmitButton={true}
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

        {authStatus === requestStatus.FAILED ? (
          <p className="text-danger text-fade-in py-3">
            <small>{'Access Failed.'}</small>
          </p>
        ) : null}
      </div>
    </Form>
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
)(AccessPrivateKey);
