import React from 'react';
import { ClaimAuditStatus } from '@hospyar/shared-types';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ClaimStatusBadgeProps {
  status: ClaimAuditStatus;
  className?: string;
}

export const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    AUTHORIZED: {
      label: 'Authorized (Compliant)',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    },
    PENDING_REVIEW: {
      label: 'Pending Clinical Review',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      color: 'bg-amber-50 text-amber-800 border-amber-300'
    },
    REJECTED_DISCREPANCY: {
      label: 'Rejected - Discrepancy',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      color: 'bg-rose-50 text-rose-800 border-rose-300'
    },
    MISSING_EVIDENCE: {
      label: 'Missing Narrative Anchor',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#4F7C82]" />,
      color: 'bg-[#B8E3E9] text-[#0B2E33] border-[#4F7C82]'
    }
  }[status] || {
    label: status,
    icon: null,
    color: 'bg-[#F8FCFD] text-[#0B2E33] border-[#93B1B5]'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs',
        statusConfig.color,
        className
      )}
    >
      {statusConfig.icon}
      {statusConfig.label}
    </span>
  );
};
