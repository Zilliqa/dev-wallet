import React from 'react';
import Layout from '../components/layout';
import { NODE_URL, CHAIN_ID, MSG_VERSION } from '../constants';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { MdSecurity, MdBeenhere } from 'react-icons/md';

class Home extends React.Component {
  public render() {
    return (
      <div>
        <Layout>
          <div className="nucleus-header-container text-center">
            <div className="nucleus-header-bg">
              <div className="nucleus-header">
                <h1>Nucleus Wallet</h1>
                <p className="pt-2">
                  This is Zilliqa <b>Test Net</b> wallet.
                  <br />
                  <small>
                    WARNNING: Please do not send any interim ERC-20 ZIL tokens to this wallet.
                  </small>
                  <br />
                </p>
              </div>
            </div>
          </div>
          <div className="node-info text-center text-fade-in">
            <small>{`Chain ID: ${CHAIN_ID}`}</small>
            {' | '}
            <small>{`Msg Ver: ${MSG_VERSION}`}</small>
            {' | '}
            <small>{`Node URL: ${NODE_URL}`}</small>
          </div>
          <div className="container pt-5">
            <Row>
              <Col xs={6} sm={6} md={6} lg={4} className="text-center ml-auto">
                <MdSecurity size={50} />
                <div className="text-secondary text-center pt-3">
                  <b>
                    We do not store your private key on our servers or transmit it over the network
                    at any time
                  </b>
                  <br />
                  <p className="pt-1">
                    <small>
                      The Nucleus Wallet is free, open-source and runs entirely on your computer.
                      Private key generation and keystore encryption/decryption are handled on your
                      computer only.
                    </small>
                  </p>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={4} className="text-center mr-auto">
                <MdBeenhere size={50} />
                <div className="text-secondary text-center pt-3">
                  <b>We recommend downloading and securely storing a keystore json file.</b>
                  <br />
                  <p className="pt-1">
                    <small>
                      keystore json file contains your encrypted private key, which can only be
                      decrypted with a password you choose. You are solely responsible for your
                      account funds. If you lose your private key or the password to your keystore
                      json, it cannot be recovered by anyone.
                    </small>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Layout>
      </div>
    );
  }
}

export default Home;
