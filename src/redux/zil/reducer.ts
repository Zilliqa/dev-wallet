import { Zilliqa } from '@zilliqa-js/zilliqa';
import { HTTPProvider } from '@zilliqa-js/core';

import * as consts from './actions';
import { requestStatus, NODE_URL, NETWORK } from '../../constants';

const provider = new HTTPProvider(NODE_URL);
const zilliqa = new Zilliqa(NODE_URL, provider);

const initialState: any = { zilliqa, provider, network: NETWORK };

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
        txInfo: undefined
      };
    case consts.SEND_TX_SUCCEEDED:
      return {
        ...state,
        sendTxStatus: requestStatus.SUCCEED,
        txInfo: action.payload.txInfo
      };
    case consts.SEND_TX_FAILED:
      return {
        ...state,
        sendTxStatus: requestStatus.FAILED,
        txInfo: undefined
      };
    case consts.CLEAR:
      return initialState;
    default:
      return state;
  }
}
