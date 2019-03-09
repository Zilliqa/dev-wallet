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
import './style.css';

interface IProps {
  size?: 'small' | 'medium' | 'large';
}
// Renders spinner to visualize loading status
const Spinner: React.SFC<IProps> = ({ size }) => {
  const SMALL = 15;
  const MEDIUM = 50;
  const LARGE = 80;

  let style = { width: MEDIUM, height: MEDIUM };
  if (size === 'small') {
    style = { width: SMALL, height: SMALL };
  } else if (size === 'large') {
    style = { width: LARGE, height: LARGE };
  }
  return <div data-testid="spinner" className="spinner" style={style} />;
};

export default Spinner;
