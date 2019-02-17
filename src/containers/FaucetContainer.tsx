/**
 * This file is part of nucleus-wallet.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * nucleus-wallet is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * nucleus-wallet is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * nucleus-wallet.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import * as H from 'history';
import { connect } from 'react-redux';
import { requestStatus } from '../constants';
import AccessTabs from '../components/access-tabs';
import Layout from '../components/layout';
import FaucetForm from '../components/faucet-form';

interface IProps {
  history: H.History;
  location: H.Location;
  authStatus?: string;
}

const FaucetContainer: React.FunctionComponent<IProps> = (props) => {
  const { authStatus } = props;
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
              <AccessTabs />
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authStatus: state.zil.authStatus
});

export default connect(mapStateToProps)(FaucetContainer);
