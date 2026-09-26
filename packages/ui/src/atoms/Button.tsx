import React from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'clinical';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#4F7C82] hover:bg-[#3d6368] text-white focus:ring-[#4F7C82] shadow-xs',
    secondary: 'bg-white hover:bg-[#B8E3E9]/30 text-[#0B2E33] focus:ring-[#6B8B99] border border-[#6B8B99] shadow-xs',
    outline: 'border border-[#93B1B5] text-[#0B2E33] hover:bg-[#B8E3E9]/20 focus:ring-[#4F7C82]',
    ghost: 'text-[#6B8B99] hover:text-[#0B2E33] hover:bg-[#B8E3E9]/30 focus:ring-[#4F7C82]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    clinical: 'bg-[#0B2E33] hover:bg-[#143e44] text-white shadow-md shadow-[#0B2E33]/20'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  );
};
