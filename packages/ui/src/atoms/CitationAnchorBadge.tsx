import React from 'react';
import { cn } from '../lib/utils';
import { CitationAnchor } from '@hospyar/shared-types';

export interface CitationAnchorBadgeProps {
  citation: CitationAnchor;
  onClick?: (citation: CitationAnchor) => void;
  className?: string;
  isActive?: boolean;
}

export const CitationAnchorBadge: React.FC<CitationAnchorBadgeProps> = ({
  citation,
  onClick,
  className,
  isActive = false
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(citation)}
      title={`${citation.source_reference} — Click to inspect verbatim clinical proof`}
      className={cn(
        'inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded border transition-all cursor-pointer select-none',
        isActive
          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/50 scale-105'
          : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 hover:text-emerald-200 border-emerald-700/60',
        className
      )}
    >
      <span className="text-[10px] text-emerald-400 font-sans">#</span>
      <span>[{citation.citation_id}]</span>
    </button>
  );
};
