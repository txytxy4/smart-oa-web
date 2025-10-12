import React from 'react';
import { Button, ButtonProps } from 'antd';
import { useTheme } from '@/hooks/useTheme';

interface ThemeButtonProps extends ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'text';
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ 
  variant = 'primary', 
  className = '', 
  style = {},
  ...props 
}) => {
  const { config } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = { ...style };
    
    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          borderColor: config.primaryColor,
          color: config.primaryColor,
          backgroundColor: 'transparent',
        };
      case 'ghost':
        return {
          ...baseStyle,
          borderColor: 'transparent',
          color: config.primaryColor,
          backgroundColor: 'transparent',
        };
      case 'text':
        return {
          ...baseStyle,
          border: 'none',
          color: config.primaryColor,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getButtonType = (): ButtonProps['type'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'outline':
        return 'default';
      case 'ghost':
        return 'ghost';
      case 'text':
        return 'text';
      default:
        return 'primary';
    }
  };

  return (
    <Button
      {...props}
      type={getButtonType()}
      className={`${className} theme-button theme-button-${variant}`}
      style={getButtonStyle()}
    />
  );
};

export default ThemeButton;
