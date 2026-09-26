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
    UP: <TrendingUp className="w-3.5 h-3.5 text-amber-600" />,
    DOWN: <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />,
    STABLE: <Minus className="w-3.5 h-3.5 text-[#6B8B99]" />
  }[metric.trend];

  return (
    <div
      className={cn(
        'bg-white border border-[#93B1B5] hover:border-[#4F7C82] rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:shadow-[#0B2E33]/10',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#B8E3E9] text-[#0B2E33] border border-[#93B1B5]">
            <Activity className="w-4 h-4 text-[#4F7C82]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#0B2E33]">
              {isRTL && metric.display_ar ? metric.display_ar : metric.display}
            </h4>
            <span className="text-[10px] font-mono text-[#6B8B99]">
              LOINC: {metric.code}
            </span>
          </div>
        </div>
        <SeverityPill status={metric.status} />
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono text-[#0B2E33] tracking-tight">
            {metric.value}
          </span>
          <span className="text-xs font-medium text-[#6B8B99]">
            {metric.unit}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#0B2E33] bg-[#F8FCFD] px-2 py-0.5 rounded-md border border-[#93B1B5]">
          {trendIcon}
          <span className="text-[11px] font-medium font-mono">{metric.trend}</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#93B1B5]/30 flex items-center justify-between text-[10px] text-[#6B8B99] font-mono">
        <span>{metric.fhir_reference}</span>
        <span className="text-[#4F7C82] font-semibold font-sans">Verified Anchor</span>
      </div>
    </div>
  );
};
