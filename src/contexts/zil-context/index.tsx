/**
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import {
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  fromBech32Address,
} from '@zilliqa-js/crypto';
import { Long, units, BN, validation } from '@zilliqa-js/util';
import { Transaction } from '@zilliqa-js/account';

import { bytes, Zilliqa } from '@zilliqa-js/zilliqa';
import { HTTPProvider, RPCMethod } from '@zilliqa-js/core';

export enum NETWORK {
  IsolatedServer = 'isolated_server',
  TestNet = 'testnet',
}

const initialState = {
  config: undefined as any,

  curNetwork: undefined as any,
  zilliqa: undefined as Zilliqa | undefined,
  version: undefined as number | undefined,
  provider: undefined as HTTPProvider | undefined,

  isAuth: undefined as boolean | undefined,
  address: undefined as string | undefined,
  publicKey: undefined as string | undefined,
  privateKey: undefined as string | undefined,
};
export const ZilContext = React.createContext(initialState);

export class ZilProvider extends React.Component {
  public readonly state = initialState;
  async componentDidMount() {
    const res = await fetch('config.json');
    const config = await res.json();
    console.log('config', config);
    this.setState({ config }, () => this.initState());
  }

  initState = (networkKey?: string) => {
    let curNetworkKey = networkKey || NETWORK.TestNet;

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const networkParam = params['network'];
    const isValidNetwork = [NETWORK.IsolatedServer, NETWORK.TestNet].includes(
      networkParam as NETWORK
    );
    if (isValidNetwork) {
      curNetworkKey = networkParam;
    }

    if (networkParam === undefined || !isValidNetwork) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.set('network', curNetworkKey);
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}?${urlSearchParams.toString()}`
      );
    }
    const { config } = this.state;

    const curNetwork =
      curNetworkKey === NETWORK.TestNet ? config[NETWORK.TestNet] : config[NETWORK.IsolatedServer];

    const provider = new HTTPProvider(curNetwork.nodeUrl);
    const zilliqa = new Zilliqa(curNetwork.nodeUrl, provider);
    const version = bytes.pack(curNetwork.chainId, curNetwork.msgVersion);

    this.setState({
      curNetwork: curNetwork,
      zilliqa: zilliqa,
      version: version,
      provider: provider,

      isAuth: undefined as boolean | undefined,
      address: undefined as string | undefined,
      publicKey: undefined as string | undefined,
      privateKey: undefined as string | undefined,
    });
  };

  public accessWallet = (privateKey: string) => {
    try {
      const address = getAddressFromPrivateKey(privateKey);
      const publicKey = getPubKeyFromPrivateKey(privateKey);
      const zilliqa = this.state.zilliqa as Zilliqa;
      zilliqa.wallet.addByPrivateKey(privateKey);

      this.setState({
        isAuth: true,
        privateKey,
        publicKey,
        address,
        zilliqa,
      });
    } catch (error) {
      this.setState({ isAuth: false });
    }
  };

  private getParams = async (toAddr, amountInZil) => {
    const zilliqa = this.state.zilliqa as Zilliqa;
    const version = this.state.version as number;
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
    const zilliqa = this.state.zilliqa as Zilliqa;
    const provider = this.state.provider as HTTPProvider;
    const tx = new Transaction(await this.getParams(toAddress, amount), provider);
    const signedTx = await zilliqa.wallet.sign(tx);
    const { txParams } = signedTx;
    // Send a transaction to the network
    const res = await provider.send(RPCMethod.CreateTransaction, txParams);
    if (res.error !== undefined) throw new Error(res.error.message);
    return res.result ? res.result.TranID : undefined;
  };

  public getBalance = async (): Promise<string> => {
    const zilliqa = this.state.zilliqa as Zilliqa;
    const address = this.state.address as string;

    if (typeof address !== 'string') {
      return '0';
    }
    const res = await zilliqa.blockchain.getBalance(address);
    if (res.error !== undefined) return '0';
    return res.result ? res.result.balance : '0';
  };

  public getMinGasPrice = async (): Promise<string> => {
    const zilliqa = this.state.zilliqa as Zilliqa;
    const res = await zilliqa.blockchain.getMinimumGasPrice();
    if (res.error !== undefined) throw new Error(res.error.message);
    return res.result ? res.result : '0';
  };

  public faucet = async ({ args, signal }): Promise<string | void> => {
    const { token, toAddress } = args;

    let address = toAddress;
    // address is either ByStr20 or bech32
    //
    // ByStr20: 20 byte hexadecimal string
    // e.g. 0x573EC96638C8bB1c386394602E1460634F02aDdA
    //
    // bech32: A bech32 with a human-readable prefix of zil
    // e.g. zil12ulvje3ceza3cwrrj3szu9rqvd8s9tw69c978p

    if (validation.isBech32(toAddress)) {
      address = fromBech32Address(toAddress);
    }

    const body = JSON.stringify({
      address,
      token,
    });
    const { curNetwork } = this.state;
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
    this.initState(curNetwork.name);
  };

  public switchNetwork = (key) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('network', key);
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${urlSearchParams.toString()}`
    );
    this.initState(key);
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
