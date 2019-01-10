import { Zilliqa } from '@zilliqa-js/zilliqa';
import * as consts from './actions';
import { requestStatus } from '../../constants';

const initialState = { zilliqa: new Zilliqa('https://api.zilliqa.com') };

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
