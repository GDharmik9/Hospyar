import { CitationAnchor } from './citation';

export type RetrievalRoute = 'VectorRAG' | 'GraphRAG' | 'Text2SQL';

export type UserRole = 'CLINICIAN' | 'CLAIMS_AUDITOR' | 'SYSTEM_ADMIN' | 'RESEARCHER';

export interface QueryRequestDTO {
  patient_id: string;
  query_text: string;
  user_role: UserRole;
  locale: 'en-US' | 'ar-SA' | 'ar-AE';
  filters?: {
    encounter_id?: string;
    date_from?: string;
    date_to?: string;
    max_citations?: number;
  };
}

export interface RetrievalEvidenceItem {
  id: string;
  route: RetrievalRoute;
  source_type: 'FHIR_OBSERVATION' | 'CLINICAL_NOTE' | 'SNOMED_ONTOLOGY' | 'CLAIMS_LEDGER';
  reference: string;
  excerpt: string;
  relevance_score: number;
}

export interface QueryResponseDTO {
  patient_id: string;
  generated_answer: string;
  generated_answer_ar?: string;
  citations: CitationAnchor[];
  retrieval_routes_used: RetrievalRoute[];
  evidence_items: RetrievalEvidenceItem[];
  execution_time_ms: number;
  confidence_score: number;
  deterministic_metrics?: Record<string, number | string>;
}
