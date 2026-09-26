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
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
    },
    PENDING_REVIEW: {
      label: 'Pending Clinical Review',
      icon: <Clock className="w-3.5 h-3.5" />,
      color: 'bg-amber-950/80 text-amber-300 border-amber-700/60'
    },
    REJECTED_DISCREPANCY: {
      label: 'Rejected - Discrepancy',
      icon: <XCircle className="w-3.5 h-3.5" />,
      color: 'bg-rose-950/80 text-rose-300 border-rose-700/60'
    },
    MISSING_EVIDENCE: {
      label: 'Missing Narrative Anchor',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      color: 'bg-orange-950/80 text-orange-300 border-orange-700/60'
    }
  }[status] || {
    label: status,
    icon: null,
    color: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs',
        statusConfig.color,
        className
      )}
    >
      {statusConfig.icon}
      {statusConfig.label}
    </span>
  );
};
