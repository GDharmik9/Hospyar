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
        'inline-flex items-center gap-1 font-mono text-[11px] text-[#4F7C82] hover:text-[#0B2E33] hover:underline transition-colors cursor-pointer bg-[#B8E3E9]/30 px-2 py-0.5 rounded border border-[#93B1B5]',
        className
      )}
    >
      <Hash className="w-2.5 h-2.5 text-[#4F7C82]" />
      <span>{pointer}</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
    </button>
  );
};
