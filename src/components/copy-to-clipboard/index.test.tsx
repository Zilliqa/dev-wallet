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
import { render, cleanup } from '@testing-library/react';
import CopyToClipboard from '.';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

test('matches the snapshot', () => {
  const copy = jest.fn();
  const { container } = render(<CopyToClipboard data="lorem" copyToClipboard={copy} />);
  expect(container.firstChild).toMatchSnapshot();
});
