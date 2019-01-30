import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import axios from 'axios';
// import * as admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { Long, bytes, units } = require('@zilliqa-js/util');
const { getAddressFromPrivateKey, getPubKeyFromPrivateKey } = require('@zilliqa-js/crypto');
const { Transaction } = require('@zilliqa-js/account');
const { HTTPProvider, RPCMethod } = require('@zilliqa-js/core');

const PRIVATE_KEY = functions.config().faucet.private_key;
const PUBLIC_KEY = getPubKeyFromPrivateKey(PRIVATE_KEY);
const RECAPTCHA_SECRET = functions.config().faucet.recaptcha_secret;
const TRANSFER_AMOUNT = functions.config().faucet.transfer_amount;
const TESTNET_URL = functions.config().faucet.testnet_url;
const NETWORK = functions.config().faucet.network;
const CHAIN_ID = parseInt(functions.config().faucet.chain_id, 10);
const MSG_VERSION = parseInt(functions.config().faucet.msg_version, 10);
const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
const ADDRESS = getAddressFromPrivateKey(PRIVATE_KEY);

const provider = new HTTPProvider(TESTNET_URL);
const zilliqa = new Zilliqa(TESTNET_URL, provider);

zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);

// admin.initializeApp(functions.config().firebase);
// const db = admin.database();

const validateRecaptchaToken = async (req, res, next) => {
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
};

app.use(validateRecaptchaToken);

async function getGasPrice(): Promise<string> {
  try {
    const response = await zilliqa.blockchain.getMinimumGasPrice();
    const minGasPrice: string = response.result;
    return `${minGasPrice}00`;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get minimum gas price.');
  }
}

async function getNonce(network, address) {
  try {
    const response = await zilliqa.blockchain.getBalance(address);
    const result = response.result || { nonce: 1 };
    const nextNonce: number = result.nonce + 1;
    console.log('next nonce:', nextNonce);
    return nextNonce;

    // const nonces = [nonce];
    // const node = (await db.ref(`nodes/${network}`).once('value')).val();
    // if (node !== null && address === node.address) {
    //   nonces.push(parseInt(node.nonce, 10));
    // }
    // return Math.max(...nonces);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get nonce.');
  }
}

// async function updateNonce(network, address, nonce) {
//   await db.ref().update({
//     [`nodes/${network}/address`]: address,
//     [`nodes/${network}/nonce`]: nonce
//   });
// }

async function runFaucet(address) {
  try {
    const gasLimit = Long.fromNumber(1);
    const amount = units.toQa(TRANSFER_AMOUNT, units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.
    const gasPrice = units.toQa(await getGasPrice(), units.Units.Li); // Minimum gasPrice measured in Li, converting to Qa.
    const pubKey = PUBLIC_KEY;
    const toAddr = address.toLowerCase();
    const nonce: number = await getNonce(NETWORK, ADDRESS);
    // await updateNonce(NETWORK, ADDRESS, nonce + 1);

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
  const { address } = req.body;
  try {
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
