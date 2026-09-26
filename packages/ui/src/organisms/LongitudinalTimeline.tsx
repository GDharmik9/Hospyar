import React from 'react';
import { TimelineEvent } from '@hospyar/shared-types';
import { SeverityPill } from '../atoms/SeverityPill';
import { Clock, FileText, FlaskConical, Receipt, Stethoscope, BedDouble } from 'lucide-react';
import { cn } from '../lib/utils';

export interface LongitudinalTimelineProps {
  events: TimelineEvent[];
  locale?: string;
  className?: string;
}

export const LongitudinalTimeline: React.FC<LongitudinalTimelineProps> = ({
  events = [],
  locale = 'en-US',
  className
}) => {
  const isRTL = locale.startsWith('ar');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ADMISSION':
        return <BedDouble className="w-4 h-4 text-cyan-400" />;
      case 'LAB_OBSERVATION':
        return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case 'CLINICAL_NOTE':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'CLAIM_SUBMISSION':
        return <Receipt className="w-4 h-4 text-purple-400" />;
      default:
        return <Stethoscope className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div
      className={cn(
        'bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6',
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/40">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Longitudinal Temporal Timeline
            </h3>
            <p className="text-[11px] text-slate-400">
              Synchronized Multi-Modal Events (Δt offset relative to admission)
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
          Δt = t_event - t_admission
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt) => {
          const displayTitle = isRTL && evt.title_ar ? evt.title_ar : evt.title;
          return (
            <div key={evt.event_id} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-emerald-500/80 flex items-center justify-center shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Event card */}
              <div className="bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getEventIcon(evt.event_type)}
                    <h4 className="text-sm font-semibold text-slate-200">
                      {displayTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300 font-bold">
                      Δt: +{evt.relative_offset_hours} hrs
                    </span>
                    {evt.severity && <SeverityPill status={evt.severity} />}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                  {evt.description}
                </p>

                {evt.verbatim_span && (
                  <div className="bg-emerald-950/20 border-l-2 border-emerald-500 p-2 rounded-r-md text-[11px] font-mono text-emerald-300 mb-2">
                    <span className="text-slate-500 mr-1.5 font-sans">Verbatim Span:</span>
                    "{evt.verbatim_span}"
                  </div>
                )}

                {evt.fhir_path && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900">
                    <span>FHIR Pointer: {evt.fhir_path}</span>
                    <span className="text-slate-400 font-sans">Encounter: {evt.encounter_id}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
