import React from 'react';
import Input from './Input';
import './AssetInput.scss';

interface AssetInputProps {
  value?: string | number;
  onChange?: (value: string) => void;
  assetSymbol?: string;
  assetPrice?: number;
  showMaxButton?: boolean;
  onMaxClick?: () => void;
  error?: string;
  label?: string;
  min?: number;
  max?: number;
}

const AssetInput: React.FC<AssetInputProps> = ({
  value,
  onChange,
  assetSymbol,
  assetPrice,
  showMaxButton,
  onMaxClick,
  min = 0,
  max,
  ...props
}) => {
  const handleChange = (newValue: string) => {
    const isValidNumber = /^\d*\.?\d*$/.test(newValue);
    
    if (!newValue || isValidNumber) {
      const numericValue = newValue === '' ? 0 : parseFloat(newValue);
      
      if (max !== undefined && numericValue > max) {
        onChange?.(max.toString());
        return;
      }
      
      if (numericValue < min) {
        onChange?.(min.toString());
        return;
      }
      
      onChange?.(newValue);
    }
  };

  const calculateTotalPrice = () => {
    if (!value || !assetPrice) return '$0.00';
    const numericValue = parseFloat(String(value).replace(/,/g, ''));
    if (isNaN(numericValue)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue * assetPrice);
  };

  return (
    <Input
      {...props}
      type="number"
      value={value}
      onChange={handleChange}
      leftAddon={showMaxButton && (
        <button className="max-button" onClick={onMaxClick}>
          MAX
        </button>
      )}
      rightAddon={assetSymbol && (
        <div className="asset-info">
          <div className="symbol">{assetSymbol}</div>
          <div className="price">≈ {calculateTotalPrice()}</div>
        </div>
      )}
      inputClassName="text-right"
    />
  );
};

export default AssetInput; 