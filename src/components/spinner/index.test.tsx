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

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Spinner from '.';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

test('matches the snapshot (small)', () => {
  const { container } = render(<Spinner size="small" data-testid="spinner" />);
  expect(container.firstChild).toMatchSnapshot();
});
test('matches the snapshot (medium)', () => {
  const { container } = render(<Spinner size="medium" data-testid="spinner" />);
  expect(container.firstChild).toMatchSnapshot();
});
test('matches the snapshot (large)', () => {
  const { container } = render(<Spinner size="large" data-testid="spinner" />);
  expect(container.firstChild).toMatchSnapshot();
});
