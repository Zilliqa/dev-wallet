import React from 'react';
import { Card, Label, Input, FormGroup, Form, Row, Col } from 'reactstrap';
import { PASSPHRASE_REGEX } from '../../regex';
import FormFeedback from 'reactstrap/lib/FormFeedback';
import Button from '../button';
import './style.css';
import Spinner from '../spinner';
import * as zilActions from '../../redux/zil/actions';
import { connect } from 'react-redux';
import { requestStatus } from '../../constants';
import * as H from 'history';

// @ts-ignore
import Worker from '../../decrypt.worker';
import { paths } from '../../routes';
import { getInputValidationState } from '../../utils';

const formatFilename = (str: string) => {
  if (str.length > 35) {
    return str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
  }
  return str;
};

interface IProps {
  accessWallet: (privateKey: string) => void;
  authStatus?: string;
  history: H.History;
}

interface IState {
  decryptStatus?: string;
  isAccessing: boolean;
  passphrase: string;
  passphraseValid: boolean;
  passphraseInvalid: boolean;
  filename: string;
  keystoreV3?: any;
}

class AccessForm extends React.Component<IProps, IState> {
  public worker;
  public readonly state: IState = {
    decryptStatus: undefined,
    passphrase: '',
    passphraseValid: false,
    passphraseInvalid: false,
    filename: '',
    keystoreV3: undefined,
    isAccessing: false
  };
  public componentDidMount() {
    this.worker = new Worker();

    this.worker.onmessage = (event) => {
      const { privateKey } = event.data;
      if (privateKey === undefined) {
        return this.setState({
          decryptStatus: requestStatus.FAILED
        });
      }
      this.setState(
        {
          decryptStatus: requestStatus.SUCCEED,
          isAccessing: true
        },
        () => this.props.accessWallet(privateKey)
      );
    };
  }

  public componentWillReceiveProps(nextProps) {
    const { history } = this.props;

    const isAccessFailed =
      nextProps.authStatus === requestStatus.FAILED &&
      this.props.authStatus === requestStatus.PENDING;
    const isAccessSucceeded =
      nextProps.authStatus === requestStatus.SUCCEED &&
      this.props.authStatus === requestStatus.PENDING;

    if (isAccessFailed || isAccessSucceeded) {
      this.setState({ isAccessing: false });
      history.push(paths.home);
    }
  }

  public render() {
    const { authStatus } = this.props;
    const { keystoreV3, passphraseValid, isAccessing, decryptStatus } = this.state;

    const messageForDecryptFailure = `Decryption failed. Please check your keystore file and passphrase.`;
    const messageForaccessWalletFailure = `Access Failed.`;

    const isDecrypting = decryptStatus === requestStatus.PENDING;

    let isSubmitButtonDisabled = false;

    if (!passphraseValid || keystoreV3 === undefined || isDecrypting || isAccessing) {
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
                  <Form className="mt-4">
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
                        onChange={this.importkeystoreV3}
                      />
                      <p className="text-success">
                        {this.state.filename ? <small> {this.state.filename}</small> : null}
                      </p>
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
                        value={this.state.passphrase}
                        onChange={this.changePassphrase}
                        valid={this.state.passphraseValid}
                        invalid={this.state.passphraseInvalid}
                        placeholder="Enter the passphrase"
                        maxLength={32}
                        minLength={8}
                      />
                      <FormFeedback>{'invalid passphrase'}</FormFeedback>
                      <FormFeedback valid={true}>{'valid passphrase'}</FormFeedback>
                    </FormGroup>

                    <br />
                    <div className="text-center">
                      {
                        <Button
                          text={submitButtonText}
                          type="primary"
                          onClick={this.onSubmit}
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
                        <p className="text-danger py-2">
                          <small>{messageForDecryptFailure}</small>
                        </p>
                      ) : null}
                      {authStatus === requestStatus.FAILED ? (
                        <p className="text-danger py-2">
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
  }

  private importkeystoreV3 = (e): void => {
    e.preventDefault();
    try {
      const files = e.target.files;
      const reader = new FileReader();
      reader.onload = () => {
        const filename = formatFilename(files[0].name);
        this.setState({ keystoreV3: reader.result, filename });
      };
      reader.readAsText(files[0]);
    } catch (error) {
      console.log(error);
    }
  };

  private changePassphrase = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'passphrase';
    const regex = PASSPHRASE_REGEX;
    const validationResult = getInputValidationState(key, value, regex);
    this.setState({ ...validationResult, [key]: value });
  };

  private onSubmit = (e) => {
    e.preventDefault();
    const { passphrase } = this.state;

    const keystoreV3 = JSON.parse(this.state.keystoreV3);

    this.setState({ decryptStatus: requestStatus.PENDING }, () =>
      this.worker.postMessage({ passphrase, keystoreV3 })
    );
  };
}

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
