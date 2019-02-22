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

import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import axios from 'axios';
require('dotenv').config({ path: '.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { Long, bytes, units } = require('@zilliqa-js/util');
const { getAddressFromPrivateKey, getPubKeyFromPrivateKey } = require('@zilliqa-js/crypto');
const { Transaction } = require('@zilliqa-js/account');
const { HTTPProvider, RPCMethod } = require('@zilliqa-js/core');

const TRANSFER_AMOUNT: string = '300';

const RECAPTCHA_SECRET = functions.config().faucet.recaptcha_secret;
const PRIVATE_KEY = functions.config().faucet.private_key;
const PUBLIC_KEY = getPubKeyFromPrivateKey(PRIVATE_KEY);
const ADDRESS = getAddressFromPrivateKey(PRIVATE_KEY);

const CHAIN_ID: number =
  process.env.REACT_APP_CHAIN_ID !== undefined ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : 0;
const MSG_VERSION: number =
  process.env.REACT_APP_MSG_VERSION !== undefined
    ? parseInt(process.env.REACT_APP_MSG_VERSION, 10)
    : 0;
const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
const NODE_URL: string = process.env.REACT_APP_NODE_URL || '';

const provider = new HTTPProvider(NODE_URL);
const zilliqa = new Zilliqa(NODE_URL, provider);

zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);

async function getGasPrice(): Promise<string> {
  try {
    const response = await zilliqa.blockchain.getMinimumGasPrice();
    const minGasPrice: string = response.result;
    return `${minGasPrice}`;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get minimum gas price.');
  }
}

async function getNonce(address) {
  try {
    const response = await zilliqa.blockchain.getBalance(address);
    const result = response.result || { nonce: 0 };
    const nextNonce: number = result.nonce + 1;
    console.log('Next nonce:', nextNonce);
    return nextNonce;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get nonce.');
  }
}

async function runFaucet(address) {
  try {
    const gasLimit = Long.fromNumber(1);
    const amount = units.toQa(TRANSFER_AMOUNT, units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.
    const gasPrice = units.toQa(await getGasPrice(), units.Units.Li); // Minimum gasPrice measured in Li, converting to Qa.
    const pubKey = PUBLIC_KEY;
    const toAddr = address.toLowerCase();
    const nonce: number = await getNonce(ADDRESS);

    const wallet = zilliqa.wallet;
    wallet.addByPrivateKey(PRIVATE_KEY);

    const tx = new Transaction(
      {
        version: VERSION,
        toAddr,
        amount,
        gasPrice,
        gasLimit,
        pubKey,
        nonce
      },
      provider
    );
    const signedTx = await wallet.sign(tx);
    const { txParams } = signedTx;

    // Send a transaction to the network
    const { result } = await provider.send(RPCMethod.CreateTransaction, txParams);
    const txId = result.TranID;
    console.log(`txid: ${txId}`);
    return txId;
  } catch (error) {
    console.log(error);
  }
}

function validateAddress(address) {
  const formattedAddress = (address || '').toUpperCase();
  if (!/^[a-zA-Z0-9]{40}$/.test(formattedAddress)) {
    throw new Error('Invalid Address.');
  }
}

app.post('/run', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`IP Address: ${ip}`);

  console.log(`Node URL: ${NODE_URL}`);
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`Msg Version: ${MSG_VERSION}`);

  const { address } = req.body;
  console.log('Check if request has the valid Recaptcha token');
  const { token } = req.body;
  try {
    const verificationUrl =
      'https://www.google.com/recaptcha/api/siteverify?secret=' +
      RECAPTCHA_SECRET +
      '&response=' +
      token +
      '&remoteip=' +
      req.connection.remoteAddress;

    const result: any = await axios.post(
      verificationUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
      }
    );

    const responseData = result.data;
    if (responseData && !responseData.success) {
      console.log('Invaild recaptcha token');
      const errorMessage = responseData['error-codes'].join(', ');
      res.status(400).json({ errorCode: 400, errorMessage: errorMessage });
    } else {
      console.log('Vaild recaptcha token');
    }
  } catch (error) {
    res.status(400).json({ errorCode: 400, errorMessage: error.message });
    console.log(error);
  }

  try {
    console.log(`Address: ${address}`);
    validateAddress(address);
    console.log('Vaild address');
  } catch (error) {
    console.log('Error validating address', error);
    res.status(400).json({ errorCode: 400, errorMessage: error.message });
  }

  try {
    const txId = await runFaucet(address);
    res.status(200).json({ txId });
  } catch (error) {
    res.status(500).json({ errorCode: 500, errorMessage: error.message });
  }
});

export const faucet = functions.https.onRequest(app);
