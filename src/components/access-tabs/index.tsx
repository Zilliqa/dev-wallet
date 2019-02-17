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

import React, { useState } from 'react';
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Form, Row, Col } from 'reactstrap';

import './style.css';

import AccessKeystore from '../access-keystore';
import AccessPrivateKey from '../access-private-key';

interface IState {
  worker: any;
  decryptStatus?: string;
  activeTab: string;
}

const KEYSTORE_TAB = '0';
const PRIVATE_KEY_TAB = '1';

const AccessForm: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState(KEYSTORE_TAB);
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const keystoreDescription = 'You can access your wallet with your keystore file and passphrase.';
  const privateKeyDescription = 'You can access your wallet with private key.';
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
                  {activeTab === KEYSTORE_TAB ? keystoreDescription : privateKeyDescription}
                </p>
              </div>
              <div>
                <Nav tabs={true}>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === KEYSTORE_TAB
                      })}
                      onClick={() => toggle(KEYSTORE_TAB)}
                    >
                      {'keystore File'}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === PRIVATE_KEY_TAB
                      })}
                      onClick={() => {
                        toggle(PRIVATE_KEY_TAB);
                      }}
                    >
                      {'Private Key'}
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId={KEYSTORE_TAB}>
                    <AccessKeystore />
                  </TabPane>
                  <TabPane tabId={PRIVATE_KEY_TAB}>
                    <AccessPrivateKey />
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default AccessForm;
