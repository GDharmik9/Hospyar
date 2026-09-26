import React from 'react';
import { ClaimAuditRecord, CitationAnchor } from '@hospyar/shared-types';
import { ClaimStatusBadge } from '../molecules/ClaimStatusBadge';
import { CitationAnchorBadge } from '../atoms/CitationAnchorBadge';
import { Receipt, CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ClaimsScrubberTableProps {
  claim: ClaimAuditRecord;
  onSelectCitation?: (citation: CitationAnchor) => void;
  className?: string;
}

export const ClaimsScrubberTable: React.FC<ClaimsScrubberTableProps> = ({
  claim,
  onSelectCitation,
  className
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#93B1B5] rounded-2xl p-6 shadow-sm space-y-6',
        className
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#93B1B5]/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#B8E3E9] text-[#0B2E33] border border-[#93B1B5]">
            <Receipt className="w-5 h-5 text-[#4F7C82]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0B2E33]">
                Claim Scrubbing & Authorization Ledger
              </h3>
              <span className="font-mono text-xs text-[#6B8B99]">
                ({claim.claim_id})
              </span>
            </div>
            <p className="text-xs text-[#6B8B99]">
              Cross-referenced against clinical discharge summaries & lab observation evidence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ClaimStatusBadge status={claim.status} />
          <div className="text-right">
            <span className="text-[10px] text-[#6B8B99] uppercase font-semibold block">
              Total Amount
            </span>
            <span className="text-lg font-bold font-mono text-[#0B2E33]">
              {claim.total_amount.toFixed(2)} {claim.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="overflow-x-auto rounded-xl border border-[#93B1B5] bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FCFD] text-[#0B2E33] border-b border-[#93B1B5] uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Clinical Pointer Anchor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#93B1B5]/30 font-sans">
            {claim.items.map((item) => (
              <tr key={item.item_id} className="hover:bg-[#B8E3E9]/30 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-[#4F7C82]">
                  {item.service_code}
                </td>
                <td className="px-4 py-3 text-[#0B2E33]">
                  <div className="font-medium">{item.description}</div>
                  {item.notes && (
                    <div className="text-[11px] text-[#6B8B99] mt-0.5">{item.notes}</div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-[#4F7C82]">
                  {item.clinical_evidence_pointer || '—'}
                </td>
                <td className="px-4 py-3 font-mono font-medium text-[#0B2E33]">
                  {item.amount.toFixed(2)} {item.currency}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scrubber notes & citations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-[#F8FCFD] p-4 rounded-xl border border-[#93B1B5] space-y-2">
          <h4 className="text-xs font-semibold text-[#0B2E33] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4F7C82]" />
            Regional Scrubber Compliance Notes
          </h4>
          <ul className="space-y-1.5 text-xs text-[#0B2E33] list-disc list-inside">
            {claim.scrubber_notes.map((note, idx) => (
              <li key={idx} className="leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#F8FCFD] p-4 rounded-xl border border-[#93B1B5] space-y-2">
          <h4 className="text-xs font-semibold text-[#0B2E33] flex items-center gap-1.5">
            <span>Verified Source Citation Anchors</span>
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {claim.citations.map((c) => (
              <CitationAnchorBadge
                key={c.citation_id}
                citation={c}
                onClick={onSelectCitation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
