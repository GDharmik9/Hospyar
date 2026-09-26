from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from .enums import CitationPointerType, SeverityLevel, RouteEnum

class Citation(BaseModel):
    citation_id: str
    pointer_type: CitationPointerType
    source_reference: str
    verbatim_text: str
    confidence_score: Optional[float] = 1.0
    metadata: Optional[Dict[str, Any]] = None

class VitalObservation(BaseModel):
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

class Condition(BaseModel):
    id: str
    snomed_code: str
    display: str
    display_ar: Optional[str] = None
    onset_date: str
    clinical_status: str
    verification_status: str

class RiskProfile(BaseModel):
    readmission_30d: float
    mortality_risk: float
    claim_denial_probability: float
    risk_level: str

class PatientProfile(BaseModel):
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
    vitals: List[VitalObservation] = []
    conditions: List[Condition] = []
    risk_score: RiskProfile

class EvidenceItem(BaseModel):
    id: str
    route: RouteEnum
    source_type: str
    reference: str
    excerpt: str
    relevance_score: float
