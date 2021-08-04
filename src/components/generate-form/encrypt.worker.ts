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

import { generatePrivateKey, encryptPrivateKey } from '../../crypto';

const encrypt = async (event) => {
  try {
    const { passphrase } = event.data;
    const privateKey = generatePrivateKey();
    const keystoreJSON = await encryptPrivateKey('pbkdf2', privateKey, passphrase);
    // @ts-ignore
    // eslint-disable-next-line
    self.postMessage({ keystoreJSON, privateKey });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    // eslint-disable-next-line
    self.postMessage({ keystoreJSON: undefined, privateKey: undefined });
  }
};

// Worker.ts
// eslint-disable-next-line
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (event) => encrypt(event).catch(console.log));
