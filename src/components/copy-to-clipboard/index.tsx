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

import { useState } from 'react';
import Button from '../button';
import { FaCopy, FaCheck, FaTimes } from 'react-icons/fa';

enum ASYNC_STATUS {
  Idle = 'Idle',
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

const CopyToClipboard = ({ data, copyToClipboard }) => {
  const [copyStatus, setCopyStatus] = useState(ASYNC_STATUS.Idle);
  const handleCopyAddress = async () => {
    setCopyStatus(ASYNC_STATUS.Pending);
    try {
      await copyToClipboard(data);
      setCopyStatus(ASYNC_STATUS.Fulfilled);
      setTimeout(() => setCopyStatus(ASYNC_STATUS.Idle), 1000);
    } catch (error) {
      setCopyStatus(ASYNC_STATUS.Rejected);
      setTimeout(() => setCopyStatus(ASYNC_STATUS.Idle), 1000);
    }
  };
  return copyToClipboard !== undefined ? (
    <Button
      data-testid="button-copy"
      className="p-0"
      style={{ verticalAlign: 'top' }}
      level="tertiary"
      size="small"
      before={
        copyStatus === ASYNC_STATUS.Fulfilled ? (
          <span data-testid="icon-check">
            <FaCheck className="text-success" />
          </span>
        ) : copyStatus === ASYNC_STATUS.Rejected ? (
          <span data-testid="icon-error">
            <FaTimes className="text-danger" />
          </span>
        ) : (
          <span data-testid="icon-copy">
            <FaCopy />
          </span>
        )
      }
      disabled={copyStatus !== ASYNC_STATUS.Idle}
      onClick={handleCopyAddress}
    />
  ) : null;
};

const Copy = (props) => (
  <CopyToClipboard
    {...props}
    copyToClipboard={
      props.copyToClipboard
        ? props.copyToClipboard
        : window.navigator && window.navigator.clipboard && window.navigator.clipboard.writeText
        ? (text) => window.navigator.clipboard.writeText(text)
        : undefined
    }
  />
);

export default Copy;
