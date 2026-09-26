import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[#0B2E33]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[#6B8B99] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-white border border-[#93B1B5] rounded-lg px-3.5 py-2 text-sm text-[#0B2E33] placeholder:text-[#6B8B99] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F7C82] focus:border-[#4F7C82] disabled:opacity-50 disabled:bg-[#B8E3E9]/20 shadow-2xs',
              icon ? 'pl-10' : '',
              error ? 'border-rose-500 focus:ring-rose-500' : '',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
