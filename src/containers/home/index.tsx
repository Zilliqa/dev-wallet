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

import Layout from '../../components/layout';
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
  background: #112;
`;

const Home = ({ zilContext }) => {
  const { curNetwork } = zilContext;
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
          <h1 style={{ fontSize: '5rem', padding: '1.5rem 0' }} className="neon">
            {' '}
            Dev Wallet
          </h1>
          <br />

          <div style={{ textAlign: 'center' }}>
            <small>
              Node URL: <code>{curNetwork.nodeUrl}</code>
            </small>
            <br />
            <small>
              Chain ID: <code>{curNetwork.chainId}</code>
            </small>
            {' | '}
            <small>
              Msg Ver: <code>{curNetwork.msgVersion}</code>
            </small>
          </div>
        </div>
      </Container>
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
