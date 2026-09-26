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
          ? 'bg-[#4F7C82] text-white font-bold border-[#0B2E33] shadow-sm shadow-[#4F7C82]/40 scale-105'
          : 'bg-[#B8E3E9]/70 text-[#0B2E33] hover:bg-[#4F7C82] hover:text-white border-[#4F7C82]/60',
        className
      )}
    >
      <span className="text-[10px] text-[#4F7C82] font-sans group-hover:text-white">#</span>
      <span>[{citation.citation_id}]</span>
    </button>
  );
};
