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

import React from 'react';
import {
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  fromBech32Address
} from '@zilliqa-js/crypto';
import { Long, bytes, units, BN } from '@zilliqa-js/util';
import { Transaction } from '@zilliqa-js/account';

import { Zilliqa } from '@zilliqa-js/zilliqa';
import { HTTPProvider, RPCMethod } from '@zilliqa-js/core';
import { NODE_URL, CHAIN_ID, MSG_VERSION } from '../../constants';

const provider = new HTTPProvider(NODE_URL);
const zilliqa = new Zilliqa(NODE_URL, provider);
const version = bytes.pack(CHAIN_ID, MSG_VERSION);

const getHost = (host: string) => {
  switch (host) {
    default:
      return 'https://us-central1-nucleus-wallet.cloudfunctions.net';
  }
};

const isOk = (code) => code < 400;

const initialState: any = {
  wallet: zilliqa.wallet,
  isAuth: undefined,
  address: undefined,
  publicKey: undefined,
  privateKey: undefined
};

export const ZilContext = React.createContext(initialState);

export class ZilProvider extends React.Component {
  public readonly state = initialState;

  public accessWallet = (privateKey: string) => {
    try {
      const address = getAddressFromPrivateKey(privateKey);
      const publicKey = getPubKeyFromPrivateKey(privateKey);
      const { wallet } = this.state;
      wallet.addByPrivateKey(privateKey);

      this.setState({
        isAuth: true,
        privateKey,
        address,
        publicKey,
        wallet
      });
    } catch (error) {
      this.setState({ isAuth: false });
    }
  };

  private getParams = async (toAddr, amountInZil) => {
    const { publicKey } = this.state;
    const response = await zilliqa.blockchain.getMinimumGasPrice();
    const gasPrice: string = response.result || '';

    const amountInQa = units.toQa(amountInZil, units.Units.Zil);
    return {
      toAddr,
      version,
      amount: amountInQa,
      gasPrice: new BN(gasPrice.toString()),
      gasLimit: Long.fromNumber(1),
      publicKey
    };
  };

  public send = async (args): Promise<any> => {
    const toAddress = args[0];
    const amount = args[1];
    const { wallet } = this.state;
    const tx = new Transaction(await this.getParams(toAddress, amount), provider);
    const signedTx = await wallet.sign(tx);
    const { txParams } = signedTx;
    // Send a transaction to the network
    const res = await provider.send(RPCMethod.CreateTransaction, txParams);
    if (res.error !== undefined) throw new Error(res.error.message);
    return res.result ? res.result.TranID : undefined;
  };

  public getBalance = async (): Promise<string> => {
    const { address } = this.state;
    const res = await zilliqa.blockchain.getBalance(address);
    // if (res.error !== undefined) throw new Error(res.error.message);
    if (res.error !== undefined) return '0';
    return res.result ? res.result.balance : '0';
  };

  public getMinGasPrice = async (): Promise<string> => {
    const res = await zilliqa.blockchain.getMinimumGasPrice();
    if (res.error !== undefined) throw new Error(res.error.message);
    return res.result ? res.result : '0';
  };

  public faucet = async (args): Promise<string | void> => {
    const token = args[0];
    const toAddress = args[1];
    const address = fromBech32Address(toAddress);
    const body = JSON.stringify({ address, token });
    const res = await fetch(`${getHost(window.location.hostname)}/faucet/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data ? data.txId : undefined;
  };

  public clearAuth = () => {
    this.setState({ ...initialState });
  };

  public render() {
    return (
      <ZilContext.Provider
        value={{
          ...this.state,
          clearAuth: this.clearAuth,
          accessWallet: this.accessWallet,
          getBalance: this.getBalance,
          getMinGasPrice: this.getMinGasPrice,
          send: this.send,
          faucet: this.faucet
        }}
      >
        {this.props.children}
      </ZilContext.Provider>
    );
  }
}
