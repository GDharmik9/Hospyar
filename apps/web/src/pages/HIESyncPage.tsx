import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { HIESyncStatus } from '@hospyar/shared-types';
import { Spinner } from '@hospyar/ui';
import { Network, CheckCircle, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export const HIESyncPage: React.FC = () => {
  const [hieList, setHieList] = useState<HIESyncStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      setIsLoading(true);
      try {
        const data = await apiClient.getHIEStatus();
        setHieList(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Spinner size="lg" />
        <span>Pinging GCC Health Information Exchange nodes (mTLS / FHIR R4)...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Regional Health Information Exchanges (HIE) Sovereign Gateway
            </h3>
            <p className="text-xs text-slate-400">
              Bi-directional FHIR R4 synchronization across UAE & Saudi Arabia healthcare authorities
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hieList.map((hie) => (
          <div
            key={hie.system}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-white font-mono">
                  {hie.country}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {hie.system}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Regime: {hie.compliance_regime}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <CheckCircle className="w-3.5 h-3.5" />
                {hie.connection_status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  Records Synchronized
                </span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {hie.records_synchronized.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  Round-Trip Latency
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  {hie.latency_ms} ms
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Egress mTLS Verified
              </span>
              <span>{new Date(hie.last_sync_timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
