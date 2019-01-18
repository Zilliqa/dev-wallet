import { Zilliqa } from '@zilliqa-js/zilliqa';
import * as consts from './actions';
import { requestStatus, ZIL_API, NETWORK } from '../../constants';

const initialState: any = { zilliqa: new Zilliqa(ZIL_API), network: NETWORK };

export default function zil(state = initialState, action) {
  switch (action.type) {
    case consts.ACCESS_WALLET:
      return {
        ...state,
        publicKey: undefined,
        address: undefined,
        authStatus: requestStatus.PENDING
      };
    case consts.ACCESS_WALLET_SUCCEEDED:
      return {
        ...state,
        publicKey: action.payload.publicKey,
        address: action.payload.address,
        authStatus: requestStatus.SUCCEED
      };
    case consts.ACCESS_WALLET_FAILED:
      return {
        ...state,
        publicKey: undefined,
        address: undefined,
        authStatus: requestStatus.FAILED
      };
    case consts.RUN_FAUCET:
      return {
        ...state,
        faucetStatus: requestStatus.PENDING
      };
    case consts.RUN_FAUCET_SUCCEEDED:
      return {
        ...state,
        faucetStatus: requestStatus.SUCCEED
      };
    case consts.RUN_FAUCET_FAILED:
      return {
        ...state,
        faucetStatus: requestStatus.FAILED
      };
    case consts.CLEAR:
      return {
        zilliqa: new Zilliqa('https://api.zilliqa.com'),
        publicKey: undefined,
        address: undefined,
        authStatus: undefined
      };
    default:
      return state;
  }
}
