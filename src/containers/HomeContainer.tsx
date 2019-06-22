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
import Layout from '../components/layout';
import { NODE_URL, CHAIN_ID, MSG_VERSION } from '../constants';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { MdSecurity, MdBeenhere } from 'react-icons/md';
import Disclaimer from '../components/disclaimer';

const Home = ({ zilContext }) => {
  return (
    <Layout zilContext={zilContext}>
      <div className="nucleus-header-container text-center">
        <div className="nucleus-header-bg">
          <div className="nucleus-header">
            <h1>Nucleus Wallet</h1>
            <p className="pt-2">
              Nucleus Wallet is free, open-source, Zilliqa <b>Test Net</b> Wallet.
            </p>
          </div>
        </div>
      </div>
      <div className="text-secondary text-center text-fade-in">
        <small>{`Chain ID: ${CHAIN_ID}`}</small>
        {' | '}
        <small>{`Msg Ver: ${MSG_VERSION}`}</small>
        {' | '}
        <small>{`Node URL: ${NODE_URL}`}</small>
      </div>
      <div className="container">
        <Row className="pt-4">
          <Col xs={6} sm={6} md={6} lg={6} className="ml-auto mr-auto text-center">
            <Disclaimer />
          </Col>
        </Row>
        <Row className="pt-5">
          <Col xs={6} sm={6} md={6} lg={4} className="text-center ml-auto">
            <MdSecurity size={50} className="text-nucleus" />
            <div className="text-secondary text-center pt-3">
              <b>
                We do not store your private key on our servers or transmit it over the network at
                any time
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
            <MdBeenhere size={50} className="text-nucleus" />
            <div className="text-secondary text-center pt-3">
              <b>We recommend downloading and securely storing a keystore json file.</b>
              <br />
              <p className="pt-1">
                <small>
                  keystore json file contains your encrypted private key, which can only be
                  decrypted with a password you choose. If you lose your private key or the password
                  to your keystore json, it cannot be recovered by anyone.
                </small>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Home;
