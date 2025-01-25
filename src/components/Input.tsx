import React, { InputHTMLAttributes } from 'react';
import './Input.scss';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  rightAddon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  rightAddon,
  leftAddon,
  className = '',
  wrapperClassName = '',
  inputClassName = '',
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`input-wrapper ${wrapperClassName} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {leftAddon && (
          <div className="input-addon left">
            {leftAddon}
          </div>
        )}
        <input 
          className={`custom-input ${error ? 'has-error' : ''} ${leftAddon ? 'with-left-addon' : ''} ${rightAddon ? 'with-right-addon' : ''} ${inputClassName}`}
          onChange={handleChange}
          {...props}
        />
        {rightAddon && (
          <div className="input-addon right">
            {rightAddon}
          </div>
        )}
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input; 