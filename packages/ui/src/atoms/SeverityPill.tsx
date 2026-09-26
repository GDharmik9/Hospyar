import React from 'react';
import { cn } from '../lib/utils';

export interface SeverityPillProps {
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | string;
  className?: string;
}

export const SeverityPill: React.FC<SeverityPillProps> = ({ status, className }) => {
  const styles: Record<string, string> = {
    NORMAL: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    WARNING: 'bg-amber-50 text-amber-800 border-amber-300',
    CRITICAL: 'bg-rose-50 text-rose-800 border-rose-300'
  };

  const currentStyle = styles[status] || 'bg-[#B8E3E9]/50 text-[#0B2E33] border-[#93B1B5]';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border shadow-2xs',
        currentStyle,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'NORMAL' && 'bg-emerald-500',
          status === 'WARNING' && 'bg-amber-500',
          status === 'CRITICAL' && 'bg-rose-500 animate-pulse'
        )}
      />
      {status}
    </span>
  );
};
