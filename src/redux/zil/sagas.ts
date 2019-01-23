import { select, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getAddressFromPrivateKey, getPubKeyFromPrivateKey } from '@zilliqa-js/crypto';
import { Long, bytes, units } from '@zilliqa-js/util';
import { RPCMethod } from '@zilliqa-js/core';
import { Transaction } from '@zilliqa-js/account';

import axios from 'axios';

import * as consts from './actions';
import { HOST } from '../../api';
import { CHAIN_ID, MSG_VERSION } from '../../constants';

const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);

const getZilState = (state) => state.zil;

export function* accessWalletSaga(action) {
  // debounce by 500ms
  yield delay(500);
  try {
    const { payload } = action;
    const privateKey: string = payload.privateKey;
    const address = getAddressFromPrivateKey(privateKey);
    const publicKey = getPubKeyFromPrivateKey(privateKey);

    const { zilliqa } = yield select(getZilState);
    zilliqa.wallet.addByPrivateKey(privateKey);

    yield put({
      type: consts.ACCESS_WALLET_SUCCEEDED,
      payload: {
        address,
        publicKey,
        privateKey
      }
    });
  } catch (error) {
    console.log(error);
    yield put({ type: consts.ACCESS_WALLET_FAILED });
  }
}
export function* watchAccessWalletSaga() {
  yield takeLatest(consts.ACCESS_WALLET, accessWalletSaga);
}

export function* sendTxSaga(action) {
  // debounce by 500ms
  yield delay(500);
  try {
    const { payload } = action;
    const { toAddress, amount, gasLimit, gasPrice } = payload;

    const zilState = yield select(getZilState);
    const { zilliqa, provider, privateKey, address, publicKey } = zilState;

    const nonceResponse = yield zilliqa.blockchain.getBalance(address);
    const nonceData = nonceResponse.result.nonce || { nonce: 1 };
    const nonce: number = nonceData.nonce + 1;

    const wallet = zilliqa.wallet;
    wallet.addByPrivateKey(privateKey);

    const tx = yield wallet.sign(
      new Transaction(
        {
          version: VERSION,
          toAddr: toAddress,
          amount: units.toQa(amount, units.Units.Zil),
          gasPrice: units.toQa(gasPrice, units.Units.Zil),
          gasLimit: Long.fromNumber(parseInt(gasLimit, 10)),
          pubKey: publicKey,
          nonce
        },
        provider
      )
    );

    // Send a transaction to the network
    const { result } = yield provider.send(RPCMethod.CreateTransaction, tx.txParams);
    const id = result.TranID;

    yield put({
      type: consts.SEND_TX_SUCCEEDED,
      payload: { txInfo: { id } }
    });
  } catch (error) {
    console.log(error);
    yield put({ type: consts.SEND_TX_FAILED });
  }
}
export function* watchSendTxSaga() {
  yield takeLatest(consts.SEND_TX, sendTxSaga);
}

export function* runFaucet(action) {
  // debounce by 500ms
  yield delay(500);
  try {
    const { payload } = action;
    const { address, token } = payload;

    const url = `${HOST}/faucet/run`;
    const headers = {
      'Content-Type': 'application/json'
    };
    const data = JSON.stringify({ address, token });

    const res = yield axios({
      method: 'post',
      url,
      headers,
      data
    });

    const faucetTxId = res.data.txId;
    yield put({
      type: consts.RUN_FAUCET_SUCCEEDED,
      payload: { faucetTxId }
    });
  } catch (error) {
    console.log(error);
    yield put({ type: consts.RUN_FAUCET_FAILED });
  }
}
export function* watchRunFaucetSaga() {
  yield takeLatest(consts.RUN_FAUCET, runFaucet);
}
