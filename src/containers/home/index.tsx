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
import Layout from '../../components/layout';
import { NODE_URL, CHAIN_ID, MSG_VERSION } from '../../constants';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Disclaimer from '../../components/disclaimer';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 30rem;
  display: flex;
  flexdirection: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: linear-gradient(-45deg, #000, #2d23a7, #000);
  background-size: 400% 400%;
  animation: Gradient 15s ease infinite;

  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Home = ({ zilContext }) => {
  return (
    <Layout zilContext={zilContext}>
      <Container>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '4rem' }}>Nucleus Wallet</h1>
          <p>
            Nucleus Wallet is free, open-source, Zilliqa <b>Test Net</b> Wallet.
          </p>
        </div>
      </Container>
      <br />

      <div style={{ textAlign: 'center' }}>
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
      </div>
    </Layout>
  );
};

export default Home;
