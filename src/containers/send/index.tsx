/**
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import AccessTabs from '../../components/access-tabs';
import Layout from '../../components/layout';
import SendForm from '../../components/send-form';
import AccountInfo from '../../components/account-info';

const SendContainer = (props) => {
  const { zilContext } = props;
  const {
    isAuth,
    privateKey,
    publicKey,
    address,
    accessWallet,
    getBalance,
    getMinGasPrice,
    send,
    curNetwork,
  } = zilContext;
  return (
    <Layout zilContext={zilContext}>
      {isAuth ? (
        <>
          <AccountInfo
            address={address}
            privateKey={privateKey}
            publicKey={publicKey}
            getBalance={getBalance}
            curNetwork={curNetwork}
          />
          <SendForm
            send={send}
            getBalance={getBalance}
            getMinGasPrice={getMinGasPrice}
            curNetwork={curNetwork}
          />
        </>
      ) : (
        <>
          <AccessTabs accessWallet={accessWallet} />
        </>
      )}
    </Layout>
  );
};
export default SendContainer;
