import React from 'react';
import { ExternalLink, Hash } from 'lucide-react';
import { cn } from '../lib/utils';

export interface FHIRPointerLinkProps {
  pointer: string; // e.g. "Observation/obs-89102#valueQuantity"
  onClick?: () => void;
  className?: string;
}

export const FHIRPointerLink: React.FC<FHIRPointerLinkProps> = ({
  pointer,
  onClick,
  className
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[11px] text-teal-400 hover:text-teal-300 hover:underline transition-colors cursor-pointer bg-slate-950/70 px-2 py-0.5 rounded border border-teal-900/40',
        className
      )}
    >
      <Hash className="w-2.5 h-2.5 text-teal-500" />
      <span>{pointer}</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
    </button>
  );
};
