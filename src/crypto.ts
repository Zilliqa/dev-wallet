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

import { getAddressFromPrivateKey } from '@zilliqa-js/crypto';
import { bytes } from '@zilliqa-js/util';
import { v4 } from 'uuid';
import elliptic from 'elliptic';
import aes from 'aes-js';
import hashjs from 'hash.js';
import { pbkdf2Sync } from 'pbkdf2';

const ALGO_IDENTIFIER = 'aes-128-ctr';

type KDF = 'pbkdf2' | 'scrypt';

interface PBKDF2Params {
  salt: string;
  dklen: number;
  c: number;
}

interface ScryptParams {
  salt: string;
  dklen: number;
  n: number;
  r: number;
  p: number;
}

type KDFParams = PBKDF2Params | ScryptParams;

const secp256k1 = elliptic.ec('secp256k1');
const PRIVKEY_SIZE_BYTES = 32;
const HEX_ENC: 'hex' = 'hex';

const randomBytes = (bytes: number) => {
  let randBz: number[] | Uint8Array;
  if (crypto && crypto.getRandomValues) {
    randBz = crypto.getRandomValues(new Uint8Array(bytes));
  } else {
    throw new Error('Unable to generate safe random numbers.');
  }

  let randStr = '';
  for (let i = 0; i < bytes; i++) {
    randStr += ('00' + randBz[i].toString(16)).slice(-2);
  }

  return randStr;
};

export const generatePrivateKey = (): string => {
  return secp256k1
    .genKeyPair({
      entropy: randomBytes(secp256k1.curve.n.byteLength()),
      entropyEnc: HEX_ENC,
      pers: 'zilliqajs+secp256k1+SHA256',
    })
    .getPrivate()
    .toString(16, PRIVKEY_SIZE_BYTES * 2);
};

async function getDerivedKey(key: Buffer, kdf: KDF, params: KDFParams): Promise<Buffer> {
  const salt = Buffer.from(params.salt, 'hex');

  if (kdf === 'pbkdf2') {
    const { c, dklen } = params as PBKDF2Params;
    return pbkdf2Sync(key, salt, c, dklen, 'sha256');
  }

  throw new Error('Only pbkdf2 and scrypt are supported');
}

export const encryptPrivateKey = async (
  kdf: KDF,
  privateKey: string,
  passphrase: string
): Promise<string> => {
  const address = getAddressFromPrivateKey(privateKey);
  const salt = randomBytes(32);
  const iv = Buffer.from(randomBytes(16), 'hex');
  const kdfparams = {
    salt,
    n: 8192,
    c: 262144,
    r: 8,
    p: 1,
    dklen: 32,
  };

  const derivedKey = await getDerivedKey(Buffer.from(passphrase), kdf, kdfparams);
  const cipher = new aes.ModeOfOperation.ctr(derivedKey.slice(0, 16), new aes.Counter(iv));
  const ciphertext = Buffer.from(cipher.encrypt(Buffer.from(privateKey, 'hex')));

  return JSON.stringify({
    address,
    crypto: {
      cipher: ALGO_IDENTIFIER,
      cipherparams: {
        iv: iv.toString('hex'),
      },
      ciphertext: ciphertext.toString('hex'),
      kdf,
      kdfparams,
      mac: hashjs
        // @ts-ignore
        .hmac(hashjs.sha256, derivedKey, 'hex')
        .update(
          Buffer.concat([derivedKey.slice(16, 32), ciphertext, iv, Buffer.from(ALGO_IDENTIFIER)]),
          'hex'
        )
        .digest('hex'),
    },
    id: v4({ random: bytes.hexToIntArray(randomBytes(16)) }),
    version: 3,
  });
};
