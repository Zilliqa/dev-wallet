import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'reactstrap';
import { BN, units } from '@zilliqa-js/util';
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
  zilliqa: any;
}

interface IState {
  isRunningFaucet: boolean;
  isUpdatingBalance: boolean;
  isFaucetComplete: boolean;
  isFaucetIncomplete: boolean;
  balance: string;
  prevFaucetStatus?: string;
}

const initialState: IState = {
  isRunningFaucet: false,
  isFaucetComplete: false,
  isFaucetIncomplete: false,
  isUpdatingBalance: false,
  balance: '0',
  prevFaucetStatus: requestStatus.PENDING
};

const FaucetForm: React.FunctionComponent<IProps> = (props) => {
  const { zilliqa, address, network, faucetTxId, faucetStatus } = props;

  const [isUpdatingBalance, setIsUpdatingBalance] = useState(initialState.isUpdatingBalance);
  const [balance, setBalance] = useState(initialState.balance);
  useEffect(
    () => {
      if (!isUpdatingBalance) {
        getBalance();
      }
    },
    [balance]
  );

  const getBalance = async () => {
    setIsUpdatingBalance(true);
    try {
      const response = await zilliqa.blockchain.getBalance(address);

      if (response.error) {
        console.log(response);
        setIsUpdatingBalance(false);
      } else {
        if (response.result) {
          const balanceInQa = response.result.balance;
          const balanceInZil = units.fromQa(new BN(balanceInQa), units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.
          setBalance(balanceInZil);
          setIsUpdatingBalance(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsUpdatingBalance(false);
    }
  };

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
        balance={balance}
        getBalance={getBalance}
        isUpdatingBalance={isUpdatingBalance}
      />
      <Row className="pt-4">
        <Col xs={12} sm={12} md={10} lg={9} className="mr-auto">
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
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  faucetTxId: state.zil.faucetTxId,
  faucetStatus: state.zil.faucetStatus,
  network: state.zil.network,
  address: state.zil.address,
  publicKey: state.zil.publicKey,
  zilliqa: state.zil.zilliqa
});

const mapDispatchToProps = (dispatch) => ({
  runFaucet: (address, token) => dispatch(zilActions.runFaucet(address, token)),
  clear: () => dispatch(zilActions.clear())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FaucetForm);
