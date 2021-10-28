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

import { useState } from 'react';
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col } from 'reactstrap';

import './style.css';

import AccessKeystore from '../access-keystore';
import AccessPrivateKey from '../access-private-key';

const KEYSTORE_TAB = '0';
const PRIVATE_KEY_TAB = '1';

const AccessTabs = ({ accessWallet }) => {
  const [activeTab, setActiveTab] = useState(KEYSTORE_TAB);
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div>
      <Card>
        <div className="pb-5 access-tabs">
          <Row>
            <Col xs={10} sm={10} md={8} lg={7} className="mr-auto ml-auto">
              <div className="text-center">
                <h2 className="pt-5 pb-4">
                  <b>{'Access Existing Wallet'}</b>
                </h2>
              </div>
              <div>
                <Nav tabs={true}>
                  <NavItem>
                    <NavLink
                      className={`cursor-pointer ${classnames({
                        active: activeTab === KEYSTORE_TAB,
                      })}`}
                      onClick={() => toggle(KEYSTORE_TAB)}
                    >
                      {'keystore File'}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`cursor-pointer ${classnames({
                        active: activeTab === PRIVATE_KEY_TAB,
                      })}`}
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
                    <AccessKeystore accessWallet={accessWallet} />
                  </TabPane>
                  <TabPane tabId={PRIVATE_KEY_TAB}>
                    <AccessPrivateKey accessWallet={accessWallet} />
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

export default AccessTabs;
