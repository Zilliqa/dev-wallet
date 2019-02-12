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

import * as React from 'react';
import { storiesOf } from '@storybook/react';

const getFontWeight = (fontWeight) => ({ fontWeight });
storiesOf('Typography', module)
  .add('levels', () => (
    <div>
      <h1>h1 Noto Sans</h1>
      <h2>h2 Noto Sans</h2>
      <h3>h3 Noto Sans</h3>
      <h4>h4 Noto Sans</h4>
      <h5>h5 Noto Sans</h5>
      <h6>h6 Noto Sans</h6>
      <a>a Noto Sans</a>
      <p>p Noto Sans</p>
      <span>span Noto Sans</span>
      <br />
      <small>small Noto Sans</small>
    </div>
  ))
  .add('colors', () => (
    <div>
      <h3>h3 default</h3>
      <h3 className="text-secondary">h3 secondary</h3>
      <br />
      <p>p default</p>
      <p className="text-secondary">p secondary</p>
    </div>
  ))
  .add('font weights', () => (
    <div>
      <p>
        <b className="text-secondary">Noto Sans Regular</b>
      </p>
      <p className="text-secondary">Noto Sans Regular</p>
    </div>
  ));
