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
