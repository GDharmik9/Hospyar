export type CitationPointerType = 'FHIR_POINTER' | 'SQL_KEY' | 'TEXT_SPAN' | 'ONTOLOGY_NODE';

export interface CitationAnchor {
  citation_id: string; // e.g. "CIT-001"
  pointer_type: CitationPointerType;
  source_reference: string; // e.g. "Observation/obs-89102#valueQuantity" or "Discharge_Summary/note-22104#span_120-145"
  verbatim_text: string; // Exact quoted text or verified metric
  confidence_score?: number;
  metadata?: Record<string, unknown>;
}
