import React from 'react';
import { cn } from '../lib/utils';

export interface SeverityPillProps {
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | string;
  className?: string;
}

export const SeverityPill: React.FC<SeverityPillProps> = ({ status, className }) => {
  const styles: Record<string, string> = {
    NORMAL: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    WARNING: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
    CRITICAL: 'bg-rose-950/70 text-rose-400 border-rose-800/60'
  };

  const currentStyle = styles[status] || 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border',
        currentStyle,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'NORMAL' && 'bg-emerald-400',
          status === 'WARNING' && 'bg-amber-400',
          status === 'CRITICAL' && 'bg-rose-400 animate-pulse'
        )}
      />
      {status}
    </span>
  );
};
