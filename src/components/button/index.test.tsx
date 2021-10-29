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

import { render, cleanup } from '@testing-library/react';
import Button from '.';

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

const levelArray = ['primary', 'secondary', 'tertiary'];
const sizeArray = ['small', 'medium', 'large'];
const disabledArray = [true, false];
const snapshot = (level) => (size) => (disabled) => {
  test('matches the snapshot', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Button
        text={`${level} ${size}`}
        level={level}
        size={size}
        disabled={disabled}
        data-testid={`${level}-${size}`}
        onClick={onClick}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
};

levelArray.forEach((level) =>
  sizeArray.forEach((size) => disabledArray.forEach((disabled) => snapshot(level)(size)(disabled)))
);

test('matches the snapshot', () => {
  const onClick = jest.fn();
  const { container } = render(
    <Button
      text={'before'}
      before={<span>Pre</span>}
      level={'primary'}
      data-testid={'button-before'}
      onClick={onClick}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});

test('matches the snapshot', () => {
  const onClick = jest.fn();
  const { container } = render(
    <Button
      text={'before'}
      after={<span>Post</span>}
      level={'primary'}
      data-testid={'button-before'}
      onClick={onClick}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
