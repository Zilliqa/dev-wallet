import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as request from 'request';
import * as admin from 'firebase-admin';

const whitelist = ['https://nucleus-wallet.firebaseapp.com', 'http://localhost:3000'];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { Long, bytes, units } = require('@zilliqa-js/util');
const { getAddressFromPrivateKey, getPubKeyFromPrivateKey } = require('@zilliqa-js/crypto');

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

const zilliqa = new Zilliqa(TESTNET_URL);
zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);

admin.initializeApp(functions.config().firebase);
const db = admin.database();

function validateAddress(address) {
  const formattedAddress = (address || '').toUpperCase();
  if (!/^[a-zA-Z0-9]{40}$/.test(formattedAddress)) {
    throw new Error('Invalid Address.');
  }
}

async function validateToken(secret, token, remoteIp) {
  const verificationUrl =
    'https://www.google.com/recaptcha/api/siteverify?secret=' +
    secret +
    '&response=' +
    token +
    '&remoteip=' +
    remoteIp;

  try {
    await request(verificationUrl, function(error, response, data) {
      const body = JSON.parse(data);
      if (!body.success) {
        throw Error('Invalid captcha token.');
      }
    });
  } catch (error) {
    console.log(error);
  }
}

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
    const nonce: number = result.nonce + 1;

    const node = (await db.ref(`nodes/${network}`).once('value')).val();

    const nonces = [nonce];

    if (node !== null && address === node.address) {
      nonces.push(parseInt(node.nonce, 10));
    }
    return Math.max(...nonces);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get nonce from db.');
  }
}

async function updateNonce(network, address, nonce) {
  await db.ref().update({
    [`nodes/${network}/address`]: address,
    [`nodes/${network}/nonce`]: nonce
  });
}

async function runFaucet(toAddr) {
  try {
    const gasLimit = Long.fromNumber(1);
    const amount = units.toQa(TRANSFER_AMOUNT, units.Units.Zil); // Sending an amount measured in Zil, converting to Qa.
    const gasPrice = units.toQa(await getGasPrice(), units.Units.Li); // Minimum gasPrice measured in Li, converting to Qa.
    const pubKey = PUBLIC_KEY;

    const nonce: number = await getNonce(NETWORK, ADDRESS);
    await updateNonce(NETWORK, ADDRESS, nonce + 1);

    // Create a transaction
    const tx = zilliqa.transactions.new({
      version: VERSION,
      toAddr,
      amount,
      gasPrice: units.toQa(gasPrice, units.Units.Li),
      gasLimit,
      nonce,
      pubKey
    });

    // Send a transaction to the network
    const response = await zilliqa.blockchain.createTransaction(tx);

    return { responseCode: 0, ...response };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send a transaction.');
  }
}

app.post('/run', async (req, res) => {
  try {
    const { token, address } = req.body;
    const remoteAddress = req.connection.remoteAddress;
    validateAddress(address);
    await validateToken(RECAPTCHA_SECRET, token, remoteAddress);
    const result = await runFaucet(address);
    res.json({ ...result });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error });
  }
});

export const faucet = functions.https.onRequest(app);
