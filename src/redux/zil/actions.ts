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

export const ACCESS_WALLET = 'ACCESS_WALLET';
export const ACCESS_WALLET_SUCCEEDED = 'ACCESS_WALLET_SUCCEEDED';
export const ACCESS_WALLET_FAILED = 'ACCESS_WALLET_FAILED';
export const accessWallet = (privateKey) => ({
  type: ACCESS_WALLET,
  payload: { privateKey }
});

export const CLEAR = 'CLEAR';
export const clear = () => ({
  type: CLEAR
});

export const RUN_FAUCET = 'RUN_FAUCET';
export const RUN_FAUCET_SUCCEEDED = 'RUN_FAUCET_SUCCEEDED';
export const RUN_FAUCET_FAILED = 'RUN_FAUCET_FAILED';
export const runFaucet = (address, token) => ({
  type: RUN_FAUCET,
  payload: { address, token }
});

export const SEND_TX = 'SEND_TX';
export const SEND_TX_SUCCEEDED = 'SEND_TX_SUCCEEDED';
export const SEND_TX_FAILED = 'SEND_TX_FAILED';
export const sendTx = (toAddress, amount) => ({
  type: SEND_TX,
  payload: { toAddress, amount }
});

export const GET_BALANCE = 'GET_BALANCE';
export const GET_BALANCE_SUCCEEDED = 'GET_BALANCE_SUCCEEDED';
export const GET_BALANCE_FAILED = 'GET_BALANCE_FAILED';
export const getBalance = () => ({ type: GET_BALANCE });

export const GET_MIN_GAS_PRICE = 'GET_MIN_GAS_PRICE';
export const GET_MIN_GAS_PRICE_SUCCEEDED = 'GET_MIN_GAS_PRICE_SUCCEEDED';
export const GET_MIN_GAS_PRICE_FAILED = 'GET_MIN_GAS_PRICE_FAILED';
export const getMinGasPrice = () => ({ type: GET_MIN_GAS_PRICE });
