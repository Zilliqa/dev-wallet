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
import './style.css';

interface IProps {
  type: ButtonType;
  ariaLabel: string;
  size?: Size;
  text?: string;
  onClick: (e?) => void;
  id?: string;
  disabled?: boolean;
  before?: React.ReactNode;
  after?: React.ReactNode;
  className?: string;
  IsSubmitButton?: boolean;
}

type Size = 'lg' | 'md' | 'sm';
type ButtonType = 'primary' | 'secondary' | 'tertiary';

const Button: React.SFC<IProps> = ({
  type,
  disabled,
  className,
  onClick,
  before,
  after,
  text,
  size,
  ariaLabel,
  IsSubmitButton
}) => (
  <button
    className={`btn btn-${size} type-${type} ${className}`}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    type={IsSubmitButton ? 'submit' : 'button'}
  >
    {before ? before : null} {text} {after ? after : null}
  </button>
);

Button.defaultProps = {
  text: '',
  size: 'md',
  className: '',
  IsSubmitButton: false
};

export default Button;
