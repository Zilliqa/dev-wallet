import React from 'react';
import { Card, Row, Col } from 'reactstrap';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { BN, Long, bytes, units } from '@zilliqa-js/util';
import Button from '../button';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { CAPTCHA_SITE_KEY, requestStatus } from '../../constants';
import { MdRefresh } from 'react-icons/md';
import SpinnerWithCheckMark from '../spinner-with-check-mark';

interface IProps {
  runFaucet: (address: string, token: string) => void;
  clear: () => void;
  faucetStatus?: string;
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
}

const initialState = {
  isRunningFaucet: false,
  isUpdatingBalance: false,
  isFaucetComplete: false,
  isFaucetIncomplete: false,
  balance: '0'
};
class FaucetForm extends React.Component<IProps, IState> {
  public readonly state: IState = initialState;
  public componentDidMount() {
    this.getBalance();
  }

  public componentWillReceiveProps(nextProps) {
    const isAccessFailed =
      nextProps.faucetStatus === requestStatus.FAILED &&
      this.props.faucetStatus === requestStatus.PENDING;
    const isAccessSucceeded =
      nextProps.faucetStatus === requestStatus.SUCCEED &&
      this.props.faucetStatus === requestStatus.PENDING;

    if (isAccessFailed) {
      this.setState({ isRunningFaucet: false, isFaucetIncomplete: true, isFaucetComplete: false });
    } else if (isAccessSucceeded) {
      this.setState(
        { isRunningFaucet: false, isFaucetComplete: true, isFaucetIncomplete: false },
        this.getBalance
      );
    }
  }

  public render() {
    const { address, network } = this.props;
    const {
      isUpdatingBalance,
      balance,
      isRunningFaucet,
      isFaucetComplete,
      isFaucetIncomplete
    } = this.state;

    return (
      <div>
        <div className="px-4">
          <h5>
            <b>{'Account Info'}</b>
          </h5>
          <div className="d-flex">
            <div className="py-2">
              {address ? <Jazzicon diameter={100} seed={jsNumberForAddress(address)} /> : null}
            </div>
            <div className="px-4 text-left text-secondary">
              <small>
                <b>Address </b>
                <p className="pt-1">{address}</p>
                <b>
                  Balance
                  <Button
                    type="tertiary"
                    text={''}
                    before={<MdRefresh />}
                    onClick={this.getBalance}
                    disabled={isUpdatingBalance}
                    ariaLabel={'Update Balance'}
                    className="mb-1 py-0 px-1"
                  />
                </b>
                <p>{isUpdatingBalance ? 'loading...' : `${balance} ZIL`}</p>
              </small>
            </div>
          </div>
        </div>
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
                    {'Please run the Faucet to receive a small amount of Zil for testing.'}
                  </p>
                  <div className="py-4">
                    {isRunningFaucet || isFaucetComplete ? (
                      <div>
                        <SpinnerWithCheckMark loading={isRunningFaucet} />
                        {isFaucetComplete ? (
                          <p className="pt-4 text-success">
                            <b>{'Succeeded to run faucet.'}</b>
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="recaptcha">
                        <ReCAPTCHA
                          sitekey={CAPTCHA_SITE_KEY}
                          onChange={this.handleCaptcha}
                          badge="inline"
                        />
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
  }

  private handleCaptcha = (token) => {
    const { address } = this.props;
    const callback = () => this.props.runFaucet(address, token);
    this.setState({ isRunningFaucet: true }, callback);
  };

  private getBalance = async () => {
    const { zilliqa, address } = this.props;
    this.setState({ isUpdatingBalance: true });
    const response = await zilliqa.blockchain.getBalance(address);

    if (response.error) {
      console.log(response);
      this.setState({ isUpdatingBalance: false });
    } else {
      if (response.result) {
        const balanceInQa = response.result.balance;
        const balanceInZil = units.fromQa(new BN(balanceInQa), units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.

        this.setState({ balance: balanceInZil, isUpdatingBalance: false });
      }
    }
  };
}

const mapStateToProps = (state) => ({
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
