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

import { select, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getAddressFromPrivateKey, getPubKeyFromPrivateKey } from '@zilliqa-js/crypto';
import { Long, bytes, units, BN } from '@zilliqa-js/util';
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
    const { toAddress, amount } = payload;

    const zilState = yield select(getZilState);
    const { zilliqa, provider, privateKey, address, publicKey } = zilState;

    const response = yield zilliqa.blockchain.getMinimumGasPrice();
    const minGasPriceInQa: string = response.result;

    const nonceResponse = yield zilliqa.blockchain.getBalance(address);
    const nonceData = nonceResponse.result.nonce || { nonce: 0 };
    const nonce: number = nonceData.nonce + 1;

    const toAddr = toAddress.toLowerCase();
    const wallet = zilliqa.wallet;
    wallet.addByPrivateKey(privateKey);

    const tx = new Transaction(
      {
        version: VERSION,
        toAddr,
        amount: units.toQa(amount, units.Units.Zil),
        gasPrice: new BN(minGasPriceInQa),
        gasLimit: Long.fromNumber(1),
        pubKey: publicKey,
        nonce
      },
      provider
    );

    const signedTx = yield wallet.sign(tx);
    const { txParams } = signedTx;

    // Send a transaction to the network
    const data = yield provider.send(RPCMethod.CreateTransaction, txParams);

    if (data.error !== undefined) {
      throw Error(data.error.message);
    }

    const id = data.result.TranID;

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

export function* getBalance(action) {
  // debounce by 500ms
  yield delay(500);
  try {
    const zilState = yield select(getZilState);
    const { zilliqa, address } = zilState;

    const response = yield zilliqa.blockchain.getBalance(address);
    let balanceInQa = '0';
    if (response.result) {
      balanceInQa = response.result.balance;
    }

    yield put({
      type: consts.GET_BALANCE_SUCCEEDED,
      payload: { balanceInQa }
    });
  } catch (error) {
    console.log(error);
    yield put({ type: consts.GET_BALANCE_FAILED });
  }
}
export function* watchGetBalanceSaga() {
  yield takeLatest(consts.GET_BALANCE, getBalance);
}

export function* getMinGasPrice(action) {
  // debounce by 500ms
  yield delay(500);
  try {
    const zilState = yield select(getZilState);
    const { zilliqa } = zilState;

    const response = yield zilliqa.blockchain.getMinimumGasPrice();
    const minGasPriceInQa: string = response.result;
    yield put({
      type: consts.GET_MIN_GAS_PRICE_SUCCEEDED,
      payload: { minGasPriceInQa }
    });
  } catch (error) {
    console.log(error);
    yield put({ type: consts.GET_MIN_GAS_PRICE_FAILED });
  }
}
export function* watchGetMinGasPriceSaga() {
  yield takeLatest(consts.GET_MIN_GAS_PRICE, getMinGasPrice);
}
