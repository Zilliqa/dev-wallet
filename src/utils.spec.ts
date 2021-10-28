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
import { formatSendAmountInZil } from './utils';

describe('formatSendAmountInZil tests', () => {
  describe('basic tests', () => {
    it('int amount and int balance', () => {
      const result = formatSendAmountInZil('100', '200', '0.001');
      expect(result).toBe('100');
    });

    it('float amount and int balance', () => {
      const result = formatSendAmountInZil('98.999', '99', '0.001');
      expect(result).toBe('98.999');
    });

    it('int amount and float balance', () => {
      const result = formatSendAmountInZil('99', '99.999', '0.001');
      expect(result).toBe('99');
    });

    it('float amount and float balance', () => {
      const result = formatSendAmountInZil('99.000', '99.999', '0.001');
      expect(result).toBe('99');
    });

    it('min value test', () => {
      const result = formatSendAmountInZil('0.000', '100.000', '0.001');
      expect(result).toBe('0.001');
    });

    it('max value test', () => {
      const result = formatSendAmountInZil('1000.000', '100.002', '0.001');
      expect(result).toBe('100.001');
    });
  });
});
