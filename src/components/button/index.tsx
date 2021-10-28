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

import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../colors';

const StyledButton = styled.button`
  outline: none;
  margin: 0;
  font-family: inherit;
  overflow: visible;
  text-transform: none;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::-webkit-file-upload-button {
    font: inherit;
    -webkit-appearance: button;
  }

  & [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button;
  }

  &:not(:disabled),
  [type='button']:not(:disabled),
  [type='reset']:not(:disabled),
  [type='submit']:not(:disabled) {
    cursor: pointer;
  }

  &::-moz-focus-inner,
  [type='button']::-moz-focus-inner,
  [type='reset']::-moz-focus-inner,
  [type='submit']::-moz-focus-inner {
    padding: 0;
    border-style: none;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ size }) =>
    size === 'large'
      ? `&{
        padding: 0.5rem 1rem;
        font-size: 1.25rem;
        line-height: 1.5;
        border-radius: 0.3rem;
      }`
      : size === 'small'
      ? `&{
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
        border-radius: 0.2rem;
      }`
      : `&{
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
      }`}

  ${({ level }) =>
    level === 'primary'
      ? `&{
              background-color: ${colors.teal600};
              color: ${colors.white};
              border-color: transparent;
            }&:hover,:active,:focus{
              background-color: ${colors.teal500};
              color: ${colors.white};
              border-color: 'transparent';
            }&:disabled{
              color: ${colors.gray500};
              background-color: ${colors.teal600};
            }`
      : level === 'secondary'
      ? `&{
              background-color: transparent;
              color: ${colors.gray500};
              border-color: ${colors.gray500};
            }&:hover,:active,:focus{
              color: ${colors.white};
              border-color: ${colors.white};
            }&:disabled{
              color: ${colors.gray600};
              border-color: ${colors.gray600};
            }`
      : level === 'tertiary'
      ? `&{
              background-color: transparent;
              color: ${colors.gray500};
              border-color: transparent;
            }&:hover,:active,:focus{
              color: ${colors.white};
            }&:disabled{
              color: ${colors.gray600};
            }`
      : ``}
`;

interface IProps {
  readonly level: ButtonLevelType;
  readonly size?: SizeType;
  readonly text?: string;
  readonly onClick?: (e?) => void;
  readonly id?: string;
  readonly disabled?: boolean;
  readonly before?: React.ReactNode;
  readonly after?: React.ReactNode;
  readonly className?: string;
  readonly type?: ButtonType;
  readonly style?: object;
  readonly testId?: string;
}

type ButtonType = 'button' | 'submit' | 'reset';
type SizeType = 'large' | 'medium' | 'small';
type ButtonLevelType = 'primary' | 'secondary' | 'tertiary';

const Button: React.FunctionComponent<IProps> = ({
  text = '',
  size = 'medium',
  className = '',
  type = 'submit',
  disabled,
  onClick,
  before,
  after,
  style,
  level,
  testId,
  ...rest
}) => (
  <StyledButton
    level={level}
    size={size}
    className={className || ''}
    onClick={onClick}
    aria-label={text}
    disabled={disabled}
    type={type}
    style={style}
    {...rest}
  >
    {before ? before : null} {text} {after ? after : null}
  </StyledButton>
);

export default Button;
