import { CitationAnchor } from './citation';

export type ClaimAuditStatus = 'AUTHORIZED' | 'PENDING_REVIEW' | 'REJECTED_DISCREPANCY' | 'MISSING_EVIDENCE';

export interface ClaimItem {
  item_id: string;
  service_code: string; // CPT or ACHI code
  description: string;
  amount: number;
  currency: 'AED' | 'SAR' | 'USD';
  status: 'COMPLIANT' | 'FLAGGED';
  clinical_evidence_pointer?: string;
  notes?: string;
}

export interface ClaimAuditRecord {
  claim_id: string;
  patient_id: string;
  encounter_id: string;
  submission_date: string;
  total_amount: number;
  currency: 'AED' | 'SAR' | 'USD';
  hie_network: 'NPHIES' | 'MALAFFI' | 'NABIDH' | 'RIAYATI';
  status: ClaimAuditStatus;
  denial_risk_probability: number;
  items: ClaimItem[];
  citations: CitationAnchor[];
  scrubber_notes: string[];
}
