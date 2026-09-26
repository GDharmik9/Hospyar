from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from ...domain.enums import RouteEnum, UserRole, CitationPointerType, ClaimStatus, SeverityLevel, HIESystem

class CitationDTO(BaseModel):
    citation_id: str
    pointer_type: CitationPointerType
    source_reference: str
    verbatim_text: str
    confidence_score: Optional[float] = 1.0
    metadata: Optional[Dict[str, Any]] = None

class QueryFilterDTO(BaseModel):
    encounter_id: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    max_citations: Optional[int] = 5

class QueryRequestDTO(BaseModel):
    patient_id: str = Field(..., description="Universal patient identifier spine")
    query_text: str = Field(..., description="User query in English or Arabic")
    user_role: UserRole = Field(default=UserRole.CLINICIAN)
    locale: str = Field(default="en-US")
    filters: Optional[QueryFilterDTO] = None

class EvidenceItemDTO(BaseModel):
    id: str
    route: RouteEnum
    source_type: str
    reference: str
    excerpt: str
    relevance_score: float

class QueryResponseDTO(BaseModel):
    patient_id: str
    generated_answer: str
    generated_answer_ar: Optional[str] = None
    citations: List[CitationDTO]
    retrieval_routes_used: List[RouteEnum]
    evidence_items: List[EvidenceItemDTO] = []
    execution_time_ms: float
    confidence_score: float
    deterministic_metrics: Optional[Dict[str, Any]] = None

class VitalObservationDTO(BaseModel):
    id: str
    code: str
    display: str
    display_ar: Optional[str] = None
    value: float
    unit: str
    timestamp: datetime
    trend: str
    status: SeverityLevel
    fhir_reference: str

class ConditionDTO(BaseModel):
    id: str
    snomed_code: str
    display: str
    display_ar: Optional[str] = None
    onset_date: str
    clinical_status: str
    verification_status: str

class RiskProfileDTO(BaseModel):
    readmission_30d: float
    mortality_risk: float
    claim_denial_probability: float
    risk_level: str

class Patient360HeaderDTO(BaseModel):
    patient_id: str
    national_id_hash: str
    full_name: str
    full_name_ar: str
    gender: str
    birth_date: str
    age: int
    blood_type: str
    primary_language: str
    regional_hie_id: str
    insurance_provider: str
    policy_number: str
    active_encounter_id: Optional[str] = None
    admission_date: Optional[str] = None
    vitals: List[VitalObservationDTO] = []
    conditions: List[ConditionDTO] = []
    risk_score: RiskProfileDTO

class TimelineEventDTO(BaseModel):
    event_id: str
    patient_id: str
    encounter_id: str
    timestamp: datetime
    relative_offset_hours: int
    event_type: str
    title: str
    title_ar: Optional[str] = None
    description: str
    verbatim_span: Optional[str] = None
    fhir_path: Optional[str] = None
    severity: Optional[SeverityLevel] = SeverityLevel.NORMAL

class ClaimItemDTO(BaseModel):
    item_id: str
    service_code: str
    description: str
    amount: float
    currency: str = "AED"
    status: str
    clinical_evidence_pointer: Optional[str] = None
    notes: Optional[str] = None

class ClaimAuditDTO(BaseModel):
    claim_id: str
    patient_id: str
    encounter_id: str
    submission_date: str
    total_amount: float
    currency: str = "AED"
    hie_network: HIESystem
    status: ClaimStatus
    denial_risk_probability: float
    items: List[ClaimItemDTO]
    citations: List[CitationDTO]
    scrubber_notes: List[str]

class HIESyncStatusDTO(BaseModel):
    system: HIESystem
    country: str
    connection_status: str
    last_sync_timestamp: datetime
    records_synchronized: int
    compliance_regime: str
    latency_ms: float
