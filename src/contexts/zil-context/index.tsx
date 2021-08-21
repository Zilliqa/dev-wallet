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
  fromBech32Address,
} from '@zilliqa-js/crypto';
import { Long, units, BN } from '@zilliqa-js/util';
import { Transaction } from '@zilliqa-js/account';

import { bytes, Zilliqa } from '@zilliqa-js/zilliqa';
import { HTTPProvider, RPCMethod } from '@zilliqa-js/core';

export enum NETWORK {
  IsolatedServer = 'Isolated Server',
  TestNet = 'Testnet',
}

const initState = (networkKey: string) => {
  const isolatedServer = {
    name: NETWORK.IsolatedServer,
    chainId: 222,
    msgVersion: 1,
    nodeUrl: 'https://zilliqa-isolated-server.zilliqa.com',
    faucetUrl: 'https://zilliqa-isolated-faucet.zilliqa.com/request-funds',
    explorerUrl: 'https://devex.zilliqa.com',
  };

  const testnet = {
    name: NETWORK.TestNet,
    chainId: 333,
    msgVersion: 1,
    nodeUrl: 'https://dev-api.zilliqa.com',
    faucetUrl: 'https://nucleus-server.zilliqa.com/api/v1/run',
    explorerUrl: 'https://devex.zilliqa.com',
  };

  const curNetwork = networkKey === NETWORK.TestNet ? testnet : isolatedServer;

  const provider = new HTTPProvider(curNetwork.nodeUrl);
  const zilliqa = new Zilliqa(curNetwork.nodeUrl, provider);
  const version = bytes.pack(curNetwork.chainId, curNetwork.msgVersion);

  const newState = {
    curNetwork: curNetwork,
    zilliqa: zilliqa,
    version: version,
    provider: provider,
    isAuth: undefined as boolean | undefined,
    address: undefined as string | undefined,
    publicKey: undefined as string | undefined,
    privateKey: undefined as string | undefined,
  };
  return newState;
};

export const ZilContext = React.createContext(initState(NETWORK.TestNet));

export class ZilProvider extends React.Component {
  public readonly state = initState(NETWORK.TestNet);

  public accessWallet = (privateKey: string) => {
    try {
      const address = getAddressFromPrivateKey(privateKey);
      const publicKey = getPubKeyFromPrivateKey(privateKey);
      const { zilliqa } = this.state;
      zilliqa.wallet.addByPrivateKey(privateKey);

      this.setState({
        isAuth: true,
        privateKey,
        address,
        publicKey,
        zilliqa,
      });
    } catch (error) {
      this.setState({ isAuth: false });
    }
  };

  private getParams = async (toAddr, amountInZil) => {
    const { zilliqa, version } = this.state;
    const response = await zilliqa.blockchain.getMinimumGasPrice();
    const gasPrice: string = response.result || '';

    const amountInQa = units.toQa(amountInZil, units.Units.Zil);
    return {
      toAddr,
      version: version,
      amount: amountInQa,
      gasPrice: new BN(gasPrice.toString()),
      gasLimit: Long.fromNumber(50),
    };
  };

  public send = async ({ args }): Promise<any> => {
    const { amount, toAddress } = args;
    const { zilliqa, provider } = this.state;
    const tx = new Transaction(await this.getParams(toAddress, amount), provider);
    const signedTx = await zilliqa.wallet.sign(tx);
    const { txParams } = signedTx;
    // Send a transaction to the network
    const res = await provider.send(RPCMethod.CreateTransaction, txParams);
    if (res.error !== undefined) throw new Error(res.error.message);
    return res.result ? res.result.TranID : undefined;
  };

  public getBalance = async (): Promise<string> => {
    const { address, zilliqa } = this.state;
    if (typeof address !== 'string') {
      return '0';
    }
    const res = await zilliqa.blockchain.getBalance(address);
    if (res.error !== undefined) return '0';
    return res.result ? res.result.balance : '0';
  };

  public getMinGasPrice = async (): Promise<string> => {
    const { zilliqa } = this.state;
    const res = await zilliqa.blockchain.getMinimumGasPrice();
    if (res.error !== undefined) throw new Error(res.error.message);
    return res.result ? res.result : '0';
  };

  public faucet = async ({ args, signal }): Promise<string | void> => {
    const { token, toAddress } = args;
    const { curNetwork } = this.state;
    const address = fromBech32Address(toAddress);

    const body = JSON.stringify({
      address,
      token: curNetwork.name === NETWORK.IsolatedServer ? 'SAVANT-IDE-CALL' : token,
    });
    const res = await fetch(curNetwork.faucetUrl, {
      signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok) {
      throw new Error('Failed to run faucet, you may have reached maximum request limit.');
    }
    const data = await res.json();
    return data ? data.txId : undefined;
  };

  public clearAuth = () => {
    const { curNetwork } = this.state;
    this.setState(initState(curNetwork.name));
  };

  public switchNetwork = (key) => {
    this.setState(initState(key));
  };

  public render() {
    return (
      <ZilContext.Provider
        value={
          {
            ...this.state,
            accessWallet: this.accessWallet,
            getBalance: this.getBalance,
            getMinGasPrice: this.getMinGasPrice,
            send: this.send,
            faucet: this.faucet,
            clearAuth: this.clearAuth,
            switchNetwork: this.switchNetwork,
          } as any
        }
      >
        {this.props.children}
      </ZilContext.Provider>
    );
  }
}
