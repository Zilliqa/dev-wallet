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

export enum requestStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCEED = 'SUCCEED'
}

export const CAPTCHA_SITE_KEY: string = '6LdazYoUAAAAAIJDC8m5PSMp2mcmSmzgt7pxU6IG';
export const NETWORK: string = 'Dev Testnet';

export const CHAIN_ID: number =
  process.env.REACT_APP_CHAIN_ID !== undefined ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : 0;

export const MSG_VERSION: number =
  process.env.REACT_APP_MSG_VERSION !== undefined
    ? parseInt(process.env.REACT_APP_MSG_VERSION, 10)
    : 0;

export const NODE_URL: string = process.env.REACT_APP_NODE_URL || '';
export const EXPLORER_URL: string = process.env.REACT_APP_EXPLORER_URL || '';
