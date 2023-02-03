import { ButtonType, ButtonVariant } from '@/types';
import React, { FunctionComponent } from 'react';

import $ from './Button.module.css';

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false
}) => {
  return (
    <button
      // TODO: Add conditional classNames
      // - Must have a condition to set the '.primary' className
      // - Must have a condition to set the '.secondary' className
      className={$.button}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
