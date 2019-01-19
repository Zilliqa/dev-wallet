import { select, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getAddressFromPrivateKey, getPubKeyFromPrivateKey } from '@zilliqa-js/crypto';
import axios from 'axios';

import * as consts from './actions';
import { HOST } from '../../api';

const getZilliqa = (state) => state.zil.zilliqa;

export function* accessWalletSaga(action) {
  // debounce by 500ms
  yield delay(500);
  try {
    const { payload } = action;
    const privateKey: string = payload.privateKey;
    const address = getAddressFromPrivateKey(privateKey);
    const publicKey = getPubKeyFromPrivateKey(privateKey);

    const zilliqa = yield select(getZilliqa);
    zilliqa.wallet.addByPrivateKey(privateKey);

    yield put({
      type: consts.ACCESS_WALLET_SUCCEEDED,
      payload: {
        address,
        publicKey
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

    yield axios({
      method: 'post',
      url,
      headers,
      data
    });

    yield put({ type: consts.RUN_FAUCET_SUCCEEDED });
  } catch (error) {
    console.log(error);
    yield put({ type: consts.RUN_FAUCET_FAILED });
  }
}
export function* watchRunFaucetSaga() {
  yield takeLatest(consts.RUN_FAUCET, runFaucet);
}
