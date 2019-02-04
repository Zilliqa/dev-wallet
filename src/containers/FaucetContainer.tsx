import React from 'react';
import * as H from 'history';
import { connect } from 'react-redux';
import { requestStatus } from '../constants';
import AccessForm from '../components/access-form';
import Layout from '../components/layout';
import FaucetForm from '../components/faucet-form';

interface IProps {
  history: H.History;
  location: H.Location;
  authStatus?: string;
}

class FaucetContainer extends React.Component<IProps, {}> {
  public render() {
    const { authStatus } = this.props;
    const isAuth = authStatus === requestStatus.SUCCEED;
    return (
      <div>
        <Layout>
          <div className="p-4">
            {isAuth ? (
              <FaucetForm />
            ) : (
              <div>
                <span className="pl-1 text-secondary">ZIL Faucet</span>
                <AccessForm />
              </div>
            )}
          </div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authStatus: state.zil.authStatus
});

export default connect(mapStateToProps)(FaucetContainer);
