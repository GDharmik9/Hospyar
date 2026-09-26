import React from 'react';
import { VitalMetric } from '@hospyar/shared-types';
import { SeverityPill } from '../atoms/SeverityPill';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export interface VitalMetricCardProps {
  metric: VitalMetric;
  locale?: string;
  className?: string;
}

export const VitalMetricCard: React.FC<VitalMetricCardProps> = ({
  metric,
  locale = 'en-US',
  className
}) => {
  const isRTL = locale.startsWith('ar');

  const trendIcon = {
    UP: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
    DOWN: <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />,
    STABLE: <Minus className="w-3.5 h-3.5 text-slate-400" />
  }[metric.trend];

  return (
    <div
      className={cn(
        'bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/20',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">
              {isRTL && metric.display_ar ? metric.display_ar : metric.display}
            </h4>
            <span className="text-[10px] font-mono text-slate-500">
              LOINC: {metric.code}
            </span>
          </div>
        </div>
        <SeverityPill status={metric.status} />
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">
            {metric.value}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {metric.unit}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
          {trendIcon}
          <span className="text-[11px] font-medium">{metric.trend}</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>{metric.fhir_reference}</span>
        <span className="text-emerald-500/80 font-sans">Verified Anchor</span>
      </div>
    </div>
  );
};
