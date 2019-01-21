import React from 'react';
import Layout from '../components/layout';
import { FaAddressCard } from 'react-icons/fa';
class Home extends React.Component {
  public render() {
    return (
      <div>
        <Layout>
          <div className="nucleus-header-container text-center">
            <div className="nucleus-header">
              <h1 className="nucleus-header-title">Nucleus Wallet</h1>
            </div>
          </div>
          <p className="nucleus-description">
            Nucleus Wallet is <b>testnet-based</b> wallet.
            <br />
            Kindly use this wallet for <b>testing purpose only</b>.
          </p>
        </Layout>
      </div>
    );
  }
}

export default Home;
