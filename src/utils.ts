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
import { BN, units } from '@zilliqa-js/util';
import { EXPLORER_URL } from './constants';

export const setValIfWholeNum = (fn) => (e: React.ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault();
  const value = e.target.value;
  const isWholeNumber = /^\d*\.?\d*$/.test(value) && !isNaN(Number(value));
  const isEmptyString = value === '';
  return isEmptyString || isWholeNumber ? fn(value) : undefined;
};

export const getInputValidationState = (key: string, value: string, testVal: RegExp | boolean) => {
  const isInvalid: boolean = typeof testVal === 'boolean' ? testVal : testVal.test(value);
  const keyValid = key + 'Valid';
  const keyInvalid = key + 'Invalid';
  const state = {};
  if (!value) {
    state[keyValid] = false;
    state[keyInvalid] = false;
    return state;
  }
  if (isInvalid) {
    state[keyValid] = true;
    state[keyInvalid] = false;
    return state;
  } else {
    state[keyValid] = false;
    state[keyInvalid] = true;
    return state;
  }
};

export const exportToCsv = (filename, rows) => {
  const processRow = (row) => {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) {
        result = '"' + result + '"';
      }
      if (j > 0) {
        finalVal += ',';
      }
      finalVal += result;
    }
    return finalVal + '\n';
  };

  let csvFile = '';

  for (const row of rows) {
    csvFile += processRow(row);
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export const downloadObjectAsJson = (exportObj, exportName) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const formatSendAmountInZil = (
  amountInZil: string,
  balanceInZil: string,
  minGasPriceInZil: string
): string => {
  const amountInQaBN: BN = units.toQa(amountInZil, units.Units.Zil);
  const balanceInQaBN: BN = units.toQa(balanceInZil, units.Units.Zil);
  const minGasPriceInQaBN: BN = units.toQa(minGasPriceInZil, units.Units.Zil);

  const maxAmountInQaBN = balanceInQaBN.sub(minGasPriceInQaBN);

  if (amountInQaBN.lte(minGasPriceInQaBN)) {
    return units.fromQa(minGasPriceInQaBN, units.Units.Zil).toString();
  } else if (amountInQaBN.gt(maxAmountInQaBN)) {
    return units.fromQa(maxAmountInQaBN, units.Units.Zil).toString();
  } else {
    return units.fromQa(amountInQaBN, units.Units.Zil).toString();
  }
};

export const getTxExplorerURL = (txId) => `${EXPLORER_URL}/tx/${txId}?network=testnet`;
export const getAddressExplorerURL = (bechAddress) =>
  `${EXPLORER_URL}/address/${bechAddress}?network=testnet`;
