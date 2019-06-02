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
import { Card } from 'reactstrap';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import { requestStatus } from '../../constants';
import SpinnerWithCheckMark from '../spinner-with-check-mark';
import { AccountInfo } from '../account-info';
import FaucetPending from '../faucet-pending';
import FaucetComplete from '../faucet-complete';
import Recaptcha from '../recaptcha';

interface IProps {
  runFaucet: (address: string, token: string) => void;
  clear: () => void;
  faucetStatus?: string;
  faucetTxId?: string;
  publicKey: string;
  address: string;
  network: string;
  getBalance: () => void;
  balanceInQa: string;
  getBalanceStatus?: string;
}

interface IState {
  isRunningFaucet: boolean;
  isFaucetComplete: boolean;
  isFaucetIncomplete: boolean;
  prevFaucetStatus?: string;
}

const initialState: IState = {
  isRunningFaucet: false,
  isFaucetComplete: false,
  isFaucetIncomplete: false,
  prevFaucetStatus: requestStatus.PENDING
};

const FaucetForm: React.FunctionComponent<IProps> = (props) => {
  const {
    address,
    network,
    faucetTxId,
    faucetStatus,
    getBalance,
    balanceInQa,
    getBalanceStatus
  } = props;

  const isUpdatingBalance = getBalanceStatus === requestStatus.PENDING;
  useEffect(
    () => {
      if (getBalanceStatus === undefined) {
        getBalance();
      }
    },
    [balanceInQa]
  );

  const [isFaucetComplete, setIsFaucetComplete] = useState(initialState.isFaucetComplete);
  const [isFaucetIncomplete, setIsFaucetIncomplete] = useState(initialState.isFaucetIncomplete);
  const [isRunningFaucet, setIsRunningFaucet] = useState(initialState.isRunningFaucet);
  const [prevFaucetStatus, setPrevFaucetStatus] = useState(initialState.prevFaucetStatus);
  useEffect(
    () => {
      const isFailed =
        faucetStatus === requestStatus.FAILED && prevFaucetStatus === requestStatus.PENDING;

      const isSucceeded =
        faucetStatus === requestStatus.SUCCEED && prevFaucetStatus === requestStatus.PENDING;

      if (isFailed) {
        setIsRunningFaucet(false);
        setIsFaucetComplete(false);
        setIsFaucetIncomplete(true);
      }
      if (isSucceeded) {
        setIsRunningFaucet(false);
        setIsFaucetComplete(true);
        setIsFaucetIncomplete(false);
      }

      setPrevFaucetStatus(faucetStatus);
    },
    [faucetStatus, prevFaucetStatus]
  );

  const handleCaptcha = (token) => {
    setIsRunningFaucet(true);
    props.runFaucet(address, token);
  };

  return (
    <div>
      <AccountInfo
        address={address}
        balanceInQa={balanceInQa}
        getBalance={getBalance}
        isUpdatingBalance={isUpdatingBalance}
      />
      <div className="pt-4">
        <Card>
          <div className="py-5">
            <div className="px-4 text-center">
              <h2 className="pb-2">
                <b>{'ZIL Faucet'}</b>
              </h2>
              <p className="text-secondary">
                {`This Zil faucet is running on The ${network} Network.`}
                <br />
                {'Please run the faucet to receive a small amount of Zil for testing.'}
              </p>
              <div className="py-4">
                {isRunningFaucet ? (
                  <div>
                    <SpinnerWithCheckMark loading={true} />
                    <FaucetPending />
                  </div>
                ) : null}
                {isFaucetComplete ? (
                  <div>
                    <SpinnerWithCheckMark loading={false} />
                    {faucetTxId ? <FaucetComplete txId={faucetTxId} /> : null}
                  </div>
                ) : null}

                {isRunningFaucet || isFaucetComplete ? null : (
                  <div>
                    <Recaptcha onChange={handleCaptcha} />
                    {isFaucetIncomplete ? (
                      <p className="pt-4">
                        <small className="text-danger text-fade-in">
                          {'Failed to run faucet. Please try again later.'}
                        </small>
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  balanceInQa: state.zil.balanceInQa,
  getBalanceStatus: state.zil.getBalanceStatus,
  faucetTxId: state.zil.faucetTxId,
  faucetStatus: state.zil.faucetStatus,
  network: state.zil.network,
  address: state.zil.address,
  publicKey: state.zil.publicKey
});

const mapDispatchToProps = (dispatch) => ({
  runFaucet: (address, token) => dispatch(zilActions.runFaucet(address, token)),
  clear: () => dispatch(zilActions.clear()),
  getBalance: () => dispatch(zilActions.getBalance())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FaucetForm);
