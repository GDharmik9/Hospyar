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
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#6B8B99] font-mono text-xs">
        <Spinner size="lg" />
        <span>Pinging GCC Health Information Exchange nodes (mTLS / FHIR R4)...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#93B1B5]/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#B8E3E9] text-[#0B2E33] border border-[#93B1B5]">
            <Network className="w-5 h-5 text-[#4F7C82]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B2E33]">
              Regional Health Information Exchanges (HIE) Sovereign Gateway
            </h3>
            <p className="text-xs text-[#6B8B99]">
              Bi-directional FHIR R4 synchronization across UAE & Saudi Arabia healthcare authorities
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#93B1B5] text-xs font-semibold text-[#0B2E33] hover:bg-[#B8E3E9]/30 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#4F7C82]" />
          <span>Refresh Ping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hieList.map((hie) => (
          <div
            key={hie.system}
            className="bg-white border border-[#93B1B5] hover:border-[#4F7C82] rounded-2xl p-5 shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F8FCFD] border border-[#93B1B5] flex items-center justify-center font-bold text-[#0B2E33] font-mono">
                  {hie.country}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B2E33] tracking-tight">
                    {hie.system}
                  </h4>
                  <span className="text-[11px] font-mono text-[#6B8B99]">
                    Regime: {hie.compliance_regime}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {hie.connection_status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#93B1B5]/30 text-xs">
              <div className="bg-[#F8FCFD] p-2.5 rounded-lg border border-[#93B1B5]">
                <span className="text-[10px] text-[#6B8B99] font-semibold uppercase block">
                  Records Synchronized
                </span>
                <span className="text-sm font-bold font-mono text-[#0B2E33]">
                  {hie.records_synchronized.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#F8FCFD] p-2.5 rounded-lg border border-[#93B1B5]">
                <span className="text-[10px] text-[#6B8B99] font-semibold uppercase block">
                  Round-Trip Latency
                </span>
                <span className="text-sm font-bold font-mono text-[#4F7C82] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#4F7C82]" />
                  {hie.latency_ms} ms
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-[#93B1B5]/30 flex items-center justify-between text-[11px] text-[#6B8B99] font-mono">
              <span className="flex items-center gap-1 text-[#4F7C82] font-semibold">
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
