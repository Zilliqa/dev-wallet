import React from 'react';
import Button from '../button';
import { Modal, ModalHeader, Row, Col } from 'reactstrap';
import { requestStatus, EXPLORER_URL } from '../../constants';
import SpinnerWithCheckMark from '../spinner-with-check-mark';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Disclaimer } from '../disclaimer';

interface IProps {
  sendTx: (toAddress, amount, gasLimit, gasPrice) => void;
  isModalOpen: boolean;
  toAddress: string;
  amount: string;
  gasLimit: string;
  gasPrice: string;
  sendTxStatus?: string;
  closeModal: () => void;
  toggleModal: () => void;
  txInfo: any;
}

interface IState {
  isSubmitting: boolean;
  isComplete: boolean;
  isFailed: boolean;
  isDisclaimerChecked: boolean;
}

const initialState = {
  isSubmitting: false,
  isComplete: false,
  isFailed: false,
  isDisclaimerChecked: false
};

class SendTxModal extends React.Component<IProps, IState> {
  public readonly state = initialState;

  public componentWillReceiveProps(nextProps) {
    if (
      this.props.sendTxStatus === requestStatus.PENDING &&
      nextProps.sendTxStatus === requestStatus.FAILED
    ) {
      this.setState({
        isSubmitting: false,
        isFailed: true,
        isComplete: false,
        isDisclaimerChecked: false
      });
    }
    if (
      this.props.sendTxStatus === requestStatus.PENDING &&
      nextProps.sendTxStatus === requestStatus.SUCCEED
    ) {
      this.setState({ isSubmitting: false, isComplete: true, isFailed: false });
    }
  }

  public render() {
    const { isModalOpen } = this.props;
    const { isSubmitting, isComplete } = this.state;

    return (
      <Modal isOpen={isModalOpen} toggle={this.handleToggle} size="lg" className="modal-container">
        <ModalHeader className="text-secondary" toggle={this.handleToggle}>
          <b>{'Send Transaction'}</b>
        </ModalHeader>
        <div className="modal-body">
          <Row>
            <Col xs={11} sm={11} md={11} lg={8} className="mr-auto ml-auto">
              {isSubmitting || isComplete ? (
                this.renderTransactionProcess()
              ) : (
                <div>{this.renderCreateForm()}</div>
              )}
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

  private renderTransactionProcess = () => {
    const { txInfo } = this.props;
    const { isSubmitting, isComplete } = this.state;
    let txId;
    if (txInfo) {
      txId = txInfo.id;
    }

    return (
      <div className="text-center pt-5">
        <SpinnerWithCheckMark loading={!isComplete} />
        {isSubmitting ? (
          <div className="text-center py-4">
            <p className="text-secondary text-fade-in">
              <b>{'Sending Transaction'}</b>
              <br />
              <small>{'Please kindly wait.'}</small>
            </p>
          </div>
        ) : null}
        {isComplete ? (
          <div>
            <p className="pt-4 text-secondary">
              <span className="text-primary">{'Transaction In Process'}</span>
              <br />
              <br />
              <small>{'the transaction is pending blockchain confirmation.'}</small>
              <br />
              <small>{'Please check after a few minutes.'}</small>
            </p>
            {txId ? (
              <u>
                <a target="_blank" href={`${EXPLORER_URL}/transactions/${txId}`} rel="noreferrer">
                  {'View Your Transaction'}
                </a>
              </u>
            ) : null}
            <br />
            <div className="py-5">
              <Button
                text={'Confirm'}
                type="primary"
                onClick={this.handleClose}
                ariaLabel={'Confirm'}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  private renderCreateForm = () => {
    const { toAddress, amount, gasLimit, gasPrice } = this.props;
    const { isSubmitting, isFailed, isDisclaimerChecked } = this.state;
    const isSubmitButtonDisabled = isSubmitting || !isDisclaimerChecked;
    const submitButtonText = 'Confirm';
    const messageForTxFailure = 'Failed to send transaction. Please try again later.';
    return (
      <div>
        <small className="text-secondary">
          <b>Transaction Info:</b>
        </small>
        <div className="card p-2 mt-3">
          <Row>
            <Col xs={3} sm={3} md={3} lg={3}>
              <small>
                <b className="text-secondary">{'To Address'}</b>
              </small>
            </Col>
            <Col xs={9} sm={9} md={9} lg={9} className="text-right">
              <small>{toAddress}</small>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={6} sm={6} md={6} lg={6}>
              <small>
                <b className="text-secondary">{'Amount to Send'}</b>
              </small>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} className="text-right">
              <small>{amount} ZIL</small>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={6} sm={6} md={6} lg={6}>
              <small>
                <b className="text-secondary ">{'Gas Limit'}</b>
              </small>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} className="text-right">
              <small>{gasLimit}</small>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={6} sm={6} md={6} lg={6}>
              <small>
                <b className="text-secondary ">{'Gas Price'}</b>
              </small>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} className="text-right">
              <small>{gasPrice}</small>
            </Col>
          </Row>
        </div>
        <br />
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup inline={true} className="px-5 text-center">
            <Label check={this.state.isDisclaimerChecked} onChange={this.handleCheck}>
              <Input type="checkbox" /> <Disclaimer />
            </Label>
          </FormGroup>
          <div className="text-center pt-2 pb-4">
            <Button
              text={submitButtonText}
              type="primary"
              onClick={this.onSubmit}
              ariaLabel={submitButtonText}
              IsSubmitButton={true}
              disabled={isSubmitButtonDisabled}
            />
            {isFailed ? (
              <p className="text-danger pt-4 text-fade-in">
                <small>{messageForTxFailure}</small>
              </p>
            ) : null}
          </div>
        </Form>
      </div>
    );
  };

  private handleCheck = () => {
    this.setState({ isDisclaimerChecked: !this.state.isDisclaimerChecked });
  };

  private handleToggle = () => {
    this.props.toggleModal();
  };

  private handleClose = () => {
    this.props.closeModal();
  };

  private onSubmit = (e) => {
    e.preventDefault();
    const { toAddress, amount, gasLimit, gasPrice } = this.props;
    this.setState({ isSubmitting: true }, () =>
      this.props.sendTx(toAddress, amount, gasLimit, gasPrice)
    );
  };
}

export default SendTxModal;
