import React from 'react';
import { Card, Label, Input, FormGroup, Form, Row, Col, FormFeedback } from 'reactstrap';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import Button from '../button';
import Spinner from '../spinner';
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
  zilliqa: any;
}

interface IState {
  isRunningFaucet: boolean;
  isUpdatingBalance: boolean;
  balance: number;
}

class FaucetForm extends React.Component<IProps, IState> {
  public readonly state: IState = {
    isRunningFaucet: false,
    isUpdatingBalance: false,
    balance: 0
  };
  public componentDidMount() {
    this.getBalance();
  }
  public componentWillUnmount() {
    this.props.clear();
  }

  public componentWillReceiveProps(nextProps) {
    const isAccessFailed =
      nextProps.faucetStatus === requestStatus.FAILED &&
      this.props.faucetStatus === requestStatus.PENDING;
    const isAccessSucceeded =
      nextProps.faucetStatus === requestStatus.SUCCEED &&
      this.props.faucetStatus === requestStatus.PENDING;

    if (isAccessFailed || isAccessSucceeded) {
      this.setState({ isRunningFaucet: false });
    }
  }

  public render() {
    const { address, faucetStatus } = this.props;
    const { isUpdatingBalance, balance, isRunningFaucet } = this.state;

    return (
      <div>
        <div className="px-4">
          <h5>
            <b>{'Account Info'}</b>
          </h5>
          <div className="d-flex">
            <div className="py-2">
              <Jazzicon diameter={100} seed={jsNumberForAddress(address)} />
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
                <p>{`${balance} Zil`}</p>
              </small>
            </div>
          </div>
        </div>
        <Row className="pt-3">
          <Col xs={12} sm={12} md={10} lg={9} className="mr-auto">
            <Card>
              <div className="py-4">
                <div className="px-4 text-center">
                  <h2 className="pb-2">
                    <b>{'ZIL Faucet'}</b>
                  </h2>
                  <p className="text-secondary">
                    {'This Zil Faucet runs on Test Network.'}
                    <br />
                    {'Please run the Faucet to receive a small amount of Zil for testing.'}
                  </p>
                  <div className="py-4">
                    {isRunningFaucet || faucetStatus === requestStatus.SUCCEED ? (
                      <div>
                        <SpinnerWithCheckMark loading={isRunningFaucet} />
                      </div>
                    ) : (
                      <div className="recaptcha">
                        <ReCAPTCHA
                          sitekey={CAPTCHA_SITE_KEY}
                          onChange={this.handleCaptcha}
                          badge="inline"
                        />
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
        const { balance } = response.result;
        this.setState({ balance, isUpdatingBalance: false });
      }
    }
  };
}

const mapStateToProps = (state) => ({
  faucetStatus: state.zil.faucetStatus,
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
