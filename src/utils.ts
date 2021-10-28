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
import { BN, units } from '@zilliqa-js/util';

export const setValIfWholeNum =
  (fn) =>
  (e: React.ChangeEvent<HTMLInputElement>): void => {
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
