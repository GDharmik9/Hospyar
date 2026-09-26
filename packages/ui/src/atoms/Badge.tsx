import React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'brand';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const variantStyles = {
    default: 'bg-[#B8E3E9]/50 text-[#0B2E33] border border-[#93B1B5]',
    info: 'bg-[#B8E3E9] text-[#0B2E33] border border-[#6B8B99]',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    warning: 'bg-amber-50 text-amber-800 border border-amber-300',
    danger: 'bg-rose-50 text-rose-800 border border-rose-300',
    purple: 'bg-[#EBF6F8] text-[#0B2E33] border border-[#4F7C82]',
    brand: 'bg-[#0B2E33] text-white border border-[#0B2E33]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
};
