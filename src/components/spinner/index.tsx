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

type SizeType = 'large' | 'medium' | 'small';

interface IProps {
  readonly size?: SizeType;
}

const SMALL = 15;
const MEDIUM = 50;
const LARGE = 80;

const StyledSpinner = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${colors.gray500};
  animation: loader-spin 1s infinite linear;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;

  ${({ size }) =>
    size === 'large'
      ? `&{
        width: ${LARGE}px;
        height: ${LARGE}px;
      }`
      : size === 'small'
      ? `&{
        width: ${SMALL}px;
        height: ${SMALL}px;
      }`
      : `&{
        width: ${MEDIUM}px;
        height: ${MEDIUM}px;
      }`}

  @keyframes loader-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner: React.FunctionComponent<IProps> = ({ size, ...rest }) => (
  <StyledSpinner size={size} {...rest} />
);

export default Spinner;
