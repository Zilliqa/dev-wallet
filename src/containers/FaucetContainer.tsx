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
import AccessTabs from '../components/access-tabs';
import Layout from '../components/layout';
import FaucetForm from '../components/faucet-form';
import AccountInfo from '../components/account-info';

const FaucetContainer = ({ zilContext }) => {
  const { isAuth, address, accessWallet, getBalance, faucet } = zilContext;
  return (
    <>
      <Layout zilContext={zilContext}>
        <div className="p-4">
          {isAuth ? (
            <>
              <AccountInfo address={address} getBalance={getBalance} />
              <FaucetForm faucet={faucet} />
            </>
          ) : (
            <>
              <span className="pl-1 text-secondary">ZIL Faucet</span>
              <AccessTabs accessWallet={accessWallet} />
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default FaucetContainer;
