import React from 'react';
import { RetrievalRoute } from '@hospyar/shared-types';
import { Database, Network, Binary } from 'lucide-react';
import { cn } from '../lib/utils';

export interface RouteBadgeGroupProps {
  routes: RetrievalRoute[];
  className?: string;
}

export const RouteBadgeGroup: React.FC<RouteBadgeGroupProps> = ({ routes, className }) => {
  const routeConfig: Record<RetrievalRoute, { label: string; icon: React.ReactNode; color: string }> = {
    VectorRAG: {
      label: 'VectorRAG (Semantic)',
      icon: <Binary className="w-3 h-3 text-[#4F7C82]" />,
      color: 'bg-[#EBF6F8] text-[#0B2E33] border-[#4F7C82]/60'
    },
    GraphRAG: {
      label: 'GraphRAG (SNOMED/LOINC)',
      icon: <Network className="w-3 h-3 text-[#6B8B99]" />,
      color: 'bg-[#B8E3E9] text-[#0B2E33] border-[#6B8B99]'
    },
    Text2SQL: {
      label: 'Text2SQL (Exact Math)',
      icon: <Database className="w-3 h-3 text-[#4F7C82]" />,
      color: 'bg-white text-[#4F7C82] border-[#93B1B5] font-semibold'
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {routes.map((route) => {
        const conf = routeConfig[route];
        if (!conf) return null;
        return (
          <span
            key={route}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs',
              conf.color
            )}
          >
            {conf.icon}
            {conf.label}
          </span>
        );
      })}
    </div>
  );
};
