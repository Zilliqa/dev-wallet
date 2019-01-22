import React from 'react';
import { Card, Label, Input, FormGroup, Form, Row, Col, FormFeedback } from 'reactstrap';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { BN, Long, bytes, units } from '@zilliqa-js/util';
import Button from '../button';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import { requestStatus } from '../../constants';
import { MdRefresh } from 'react-icons/md';
import { ADDRESS_REGEX } from '../../regex';
import { getInputValidationState } from '../../utils';
import ConfirmTxModal from '../confirm-tx-modal';

interface IProps {
  sendTx: (toAddress, amount, gasLimit, gasPrice) => void;
  clear: () => void;
  sendTxStatus?: string;
  publicKey: string;
  address: string;
  network: string;
  zilliqa: any;
  txInfo: any;
}

interface IState {
  toAddress: string;
  toAddressValid: boolean;
  toAddressInvalid: boolean;
  amount: string;
  isSendingTx: boolean;
  isSendTxComplete: boolean;
  isFaucetIncomplete: boolean;
  balance: string;
  isUpdatingBalance: boolean;
  gasPrice: string;
  gasLimit: string;
  isUpdatingGasPrice: boolean;
  isModalOpen: boolean;
}

const initialState = {
  isModalOpen: false,
  toAddress: '',
  toAddressValid: false,
  toAddressInvalid: false,
  amount: '',
  isSendingTx: false,
  isSendTxComplete: false,
  isFaucetIncomplete: false,
  balance: '0',
  isUpdatingBalance: false,
  gasPrice: '',
  gasLimit: '1',
  isUpdatingGasPrice: false
};
class SendForm extends React.Component<IProps, IState> {
  public readonly state: IState = initialState;
  public componentDidMount() {
    this.getBalance();
    this.getGasPrice();
  }

  public componentWillReceiveProps(nextProps) {
    const isAccessFailed =
      nextProps.senx === requestStatus.FAILED && this.props.sendTxStatus === requestStatus.PENDING;
    const isAccessSucceeded =
      nextProps.sendTxStatus === requestStatus.SUCCEED &&
      this.props.sendTxStatus === requestStatus.PENDING;

    if (isAccessFailed) {
      this.setState({ isSendingTx: false, isFaucetIncomplete: true, isSendTxComplete: false });
    } else if (isAccessSucceeded) {
      this.setState(
        { isSendingTx: false, isSendTxComplete: true, isFaucetIncomplete: false },
        this.getBalance
      );
    }
  }

  public render() {
    const { address, sendTxStatus, txInfo } = this.props;
    const {
      isModalOpen,
      isUpdatingBalance,
      balance,
      toAddress,
      toAddressInvalid,
      amount,
      gasPrice,
      gasLimit
    } = this.state;

    const isBalanceInsufficient = balance === '0';
    const isSendButtonDisabled = toAddressInvalid || !amount || isBalanceInsufficient;
    const sendButtonText = 'Send Transaction';
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
                    <b>{'Send ZIL'}</b>
                  </h2>
                  <Col xs={12} sm={12} md={10} lg={8} className="mr-auto ml-auto">
                    <Form className="mt-4 text-left">
                      <FormGroup>
                        <Label for="Address">
                          <small>
                            <b>{'To Address'}</b>
                          </small>
                        </Label>
                        <Input
                          id="toAddress"
                          type="text"
                          name="toAddress"
                          data-test-id="toAddress"
                          value={this.state.toAddress}
                          onChange={this.changeToAddress}
                          valid={this.state.toAddressValid}
                          invalid={this.state.toAddressInvalid}
                          placeholder="Enter the Address to Send"
                          maxLength={40}
                        />
                        <FormFeedback>{'invalid address'}</FormFeedback>
                        <FormFeedback valid={true}>{'valid address'}</FormFeedback>
                      </FormGroup>
                      <br />
                      <FormGroup>
                        <Label for="amount">
                          <small>
                            <b>{'Amount to Send'}</b>
                          </small>
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          name="amount"
                          data-test-id="amount"
                          value={this.state.amount}
                          onChange={this.changeAmount}
                          placeholder="Enter the Amount"
                        />
                      </FormGroup>
                      <br />
                      <Row>
                        <Col lg={6} md={6}>
                          <FormGroup>
                            <Label for="gasLimit">
                              <small>
                                <b>{'Gas Limit'}</b>
                              </small>
                            </Label>
                            <Input
                              id="gasLimit"
                              type="number"
                              name="gasLimit"
                              data-test-id="gasLimit"
                              value={this.state.gasLimit}
                              disabled={true}
                              placeholder="Enter the Gas Limit"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6} md={6}>
                          <FormGroup>
                            <Label for="gasPrice">
                              <small>
                                <b>{'Gas Price'}</b>
                              </small>
                            </Label>
                            <Input
                              id="gasPrice"
                              type="number"
                              name="gasPrice"
                              data-test-id="gasPrice"
                              value={gasPrice}
                              disabled={true}
                              placeholder="Enter the Gas Price"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      <div className="py-4 text-center">
                        <Button
                          text={sendButtonText}
                          type="primary"
                          ariaLabel={'sendButtonText'}
                          onClick={() => this.setState({ isModalOpen: true })}
                          disabled={isSendButtonDisabled}
                        />
                      </div>
                      {isBalanceInsufficient && !isUpdatingBalance ? (
                        <p className="text-center text-danger">
                          <small>{'Your balance is not sufficient to send transaction.'}</small>
                        </p>
                      ) : null}
                    </Form>
                  </Col>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {isModalOpen ? (
          <ConfirmTxModal
            txInfo={txInfo}
            sendTxStatus={sendTxStatus}
            toAddress={toAddress}
            amount={amount}
            gasLimit={gasLimit}
            gasPrice={gasPrice}
            isModalOpen={isModalOpen}
            sendTx={this.props.sendTx}
            closeModal={this.closeModal}
            toggleModal={() => this.setState({ isModalOpen: !this.state.isModalOpen })}
          />
        ) : null}
      </div>
    );
  }

  private closeModal = () => {
    this.setState(initialState);
  };

  private changeToAddress = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'toAddress';
    const regex = ADDRESS_REGEX;
    const validationResult = getInputValidationState(key, value, regex);
    this.setState({ ...validationResult, [key]: value });
  };

  private changeAmount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const amount = e.target.value;
    this.setState({ amount });
  };

  private getGasPrice = async () => {
    const { zilliqa } = this.props;
    this.setState({ isUpdatingGasPrice: true });
    try {
      const response = await zilliqa.blockchain.getMinimumGasPrice();
      const minGasPriceInLi: string = response.result;
      const minGasPriceInQa = units.toQa(new BN(minGasPriceInLi), units.Units.Li); // Minimum gasPrice measured in Li, converting to Qa.
      const minGasPriceInZil = units.fromQa(new BN(minGasPriceInQa), units.Units.Zil); // Minimum gasPrice measured in Qa, converting to Zil.

      this.setState({ gasPrice: `${minGasPriceInZil}`, isUpdatingGasPrice: false });
    } catch (error) {
      console.log(error);
    }
  };

  private getBalance = async () => {
    const { zilliqa, address } = this.props;
    this.setState({ isUpdatingBalance: true });
    const response = await zilliqa.blockchain.getBalance(address);

    if (response.error) {
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
  sendTxStatus: state.zil.sendTxStatus,
  txInfo: state.zil.txInfo,
  network: state.zil.network,
  address: state.zil.address,
  publicKey: state.zil.publicKey,
  zilliqa: state.zil.zilliqa
});

const mapDispatchToProps = (dispatch) => ({
  sendTx: (toAddress, amount, gasLimit, gasPrice) =>
    dispatch(zilActions.sendTx(toAddress, amount, gasLimit, gasPrice)),
  clear: () => dispatch(zilActions.clear())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendForm);
