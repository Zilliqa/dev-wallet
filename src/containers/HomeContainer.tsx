import React from 'react';
import Layout from '../components/layout';

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
        </Layout>
      </div>
    );
  }
}

export default Home;
