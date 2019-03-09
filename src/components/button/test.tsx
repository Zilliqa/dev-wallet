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
import { render, cleanup } from 'react-testing-library';
import { FaCheck } from 'react-icons/fa';
import Button from '.';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);
const baseComponent = (props) => (
  <Button
    type={props.type}
    text={'ButtonText'}
    disabled={false}
    onClick={() => console.log('click')}
    ariaLabel={'Test Button'}
    before={<FaCheck />}
    size={'md'}
  />
);

test('matches the snapshot for primary type)', () => {
  const { container } = render(baseComponent({ type: 'primary' }));
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot for secondary type)', () => {
  const { container } = render(baseComponent({ type: 'secondary' }));
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot for tertiary type)', () => {
  const { container } = render(baseComponent({ type: 'tertiary' }));
  expect(container.firstChild).toMatchSnapshot();
});
