import React from 'react';
import Layout from '../components/layout';
import { NODE_URL, CHAIN_ID, MSG_VERSION } from '../constants';

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
                  Nucleus Wallet is <b>testnet-based</b> wallet.
                  <br />
                  Kindly use this wallet for <b>testing purpose only</b>.
                  <br />
                </p>
              </div>
            </div>
          </div>
          <br />
          <div className="blockchain-detail">
            <small>Chain ID: {CHAIN_ID}</small>
            {' | '}
            <small>Msg Ver: {MSG_VERSION}</small>
            {' | '}
            <small>Node URL: {NODE_URL}</small>
          </div>
        </Layout>
      </div>
    );
  }
}

export default Home;
