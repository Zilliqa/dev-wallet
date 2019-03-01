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

import { Zilliqa } from '@zilliqa-js/zilliqa';
import { HTTPProvider } from '@zilliqa-js/core';

import * as consts from './actions';
import { requestStatus, NODE_URL, NETWORK } from '../../constants';

const provider = new HTTPProvider(NODE_URL);
const zilliqa = new Zilliqa(NODE_URL, provider);

const initialState: any = {
  zilliqa,
  provider,
  network: NETWORK,
  address: undefined,
  publicKey: undefined,
  privateKey: undefined,
  faucetTxId: undefined,
  sendTxId: undefined,
  authStatus: undefined,
  faucetStatus: undefined,
  sendTxStatus: undefined,
  balanceInQa: undefined,
  getBalanceStatus: undefined,
  minGasPriceInQa: undefined,
  getMinGasPriceStatus: undefined
};

export default function zil(state = initialState, action) {
  switch (action.type) {
    case consts.ACCESS_WALLET:
      return {
        ...state,
        address: undefined,
        publicKey: undefined,
        privateKey: undefined,
        authStatus: requestStatus.PENDING
      };
    case consts.ACCESS_WALLET_SUCCEEDED:
      return {
        ...state,
        address: action.payload.address,
        publicKey: action.payload.publicKey,
        privateKey: action.payload.privateKey,
        authStatus: requestStatus.SUCCEED
      };
    case consts.ACCESS_WALLET_FAILED:
      return {
        ...state,
        address: undefined,
        publicKey: undefined,
        privateKey: undefined,
        authStatus: requestStatus.FAILED
      };
    case consts.RUN_FAUCET:
      return {
        ...state,
        faucetStatus: requestStatus.PENDING,
        faucetTxId: undefined
      };
    case consts.RUN_FAUCET_SUCCEEDED:
      return {
        ...state,
        faucetStatus: requestStatus.SUCCEED,
        faucetTxId: action.payload.faucetTxId
      };
    case consts.RUN_FAUCET_FAILED:
      return {
        ...state,
        faucetStatus: requestStatus.FAILED,
        faucetTxId: undefined
      };
    case consts.SEND_TX:
      return {
        ...state,
        sendTxStatus: requestStatus.PENDING,
        sendTxId: undefined
      };
    case consts.SEND_TX_SUCCEEDED:
      return {
        ...state,
        sendTxStatus: requestStatus.SUCCEED,
        sendTxId: action.payload.sendTxId
      };
    case consts.SEND_TX_FAILED:
      return {
        ...state,
        sendTxStatus: requestStatus.FAILED,
        sendTxId: undefined
      };
    case consts.GET_BALANCE:
      return {
        ...state,
        getBalanceStatus: requestStatus.PENDING,
        balanceInQa: undefined
      };
    case consts.GET_BALANCE_SUCCEEDED:
      return {
        ...state,
        getBalanceStatus: requestStatus.SUCCEED,
        balanceInQa: action.payload.balanceInQa
      };
    case consts.GET_BALANCE_FAILED:
      return {
        ...state,
        getBalanceStatus: requestStatus.FAILED,
        balanceInQa: undefined
      };
    case consts.GET_MIN_GAS_PRICE:
      return {
        ...state,
        getMinGasPriceStatus: requestStatus.PENDING,
        minGasPriceInQa: undefined
      };
    case consts.GET_MIN_GAS_PRICE_SUCCEEDED:
      return {
        ...state,
        getMinGasPriceStatus: requestStatus.SUCCEED,
        minGasPriceInQa: action.payload.minGasPriceInQa
      };
    case consts.GET_MIN_GAS_PRICE_FAILED:
      return {
        ...state,
        getMinGasPriceStatus: requestStatus.FAILED,
        minGasPriceInQa: undefined
      };
    case consts.CLEAR:
      return initialState;
    default:
      return state;
  }
}
