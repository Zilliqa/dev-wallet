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
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import axios from 'axios';
require('dotenv').config({ path: '.env' });

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { Long, bytes, units, BN } = require('@zilliqa-js/util');
const {
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  isValidChecksumAddress
} = require('@zilliqa-js/crypto');
const { Transaction } = require('@zilliqa-js/account');
const { HTTPProvider, RPCMethod } = require('@zilliqa-js/core');

const DEFAULT_TRANSFER_AMOUNT: number = 300;
const PENALTY_TRANSFER_AMOUNT: number = 10;
const PENALTY_TIME: number = 1000 * 60 * 60 * 2;

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

app.post('/run', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`IP address: ${ip}`);
  console.log(`${NODE_URL}, ${CHAIN_ID}, ${MSG_VERSION}`);

  const { token, address } = req.body;
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
      console.log('Invaild recaptcha token!');
      const errorMessage = responseData['error-codes'].join(', ');
      throw new Error(errorMessage);
    }
    console.log('Vaild recaptcha token ✓');

    console.log(`Address: ${address}`);
    if (!isValidChecksumAddress(address)) {
      throw new Error('Invalid Checksum Address!');
    }
    console.log('Vaild address ✓');
  } catch (error) {
    console.error(error);
    res.status(400).json({ errorCode: 400, errorMessage: error.message });
    return;
  }

  try {
    let claimInterval;
    const userRef = firestore
      .collection(`versions`)
      .doc(`${VERSION}`)
      .collection(`users`)
      .doc(`${address}`);

    const doc = await userRef.get();
    if (doc.exists) {
      console.log('Existing address');
      const claimedAt = doc.data().claimed_at;
      console.log(`The latest claimed at: ${claimedAt}`);
      claimInterval = Date.now() - claimedAt;
      console.log(`Interval: ${claimInterval}`);
    } else {
      console.log('New address');
    }

    let faucetAmount: number = DEFAULT_TRANSFER_AMOUNT;

    if (claimInterval !== undefined && claimInterval < PENALTY_TIME) {
      faucetAmount = PENALTY_TRANSFER_AMOUNT;
    }
    console.log(`Faucet amount: ${faucetAmount}`);

    const gasLimit = Long.fromNumber(1);
    const amount = units.toQa(faucetAmount.toString(), units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.

    const gasResponse = await zilliqa.blockchain.getMinimumGasPrice();
    const minGasPrice: string = gasResponse.result;
    console.log('Min gas price:', minGasPrice);

    const gasPrice = new BN(minGasPrice);
    const pubKey = PUBLIC_KEY;
    const toAddr = address;

    const response = await zilliqa.blockchain.getBalance(ADDRESS);
    const nonceResult = response.result || { nonce: 0 };
    const nonce: number = nonceResult.nonce + 1;
    console.log('Nonce:', nonce);

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
    const tsRes = await provider.send(RPCMethod.CreateTransaction, txParams);
    const { result } = tsRes;
    const txId = result && result.TranID;

    if (txId === undefined) {
      console.log('Response', tsRes);
      throw Error('No TxID!');
    }

    console.log(`TxID: ${txId}`);

    const now = Date.now();
    const userData = {
      claimed_at: now
    };
    await userRef.set(userData);
    console.log(`Claimed at: ${now}`);

    res.status(200).json({ txId });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errorCode: 500, errorMessage: error.message });
    return;
  }
});

export const faucet = functions.https.onRequest(app);
