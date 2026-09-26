export interface VitalMetric {
  id: string;
  code: string; // LOINC code e.g. "8867-4"
  display: string; // e.g. "Heart Rate", "Blood Glucose"
  display_ar?: string; // Arabic display name
  value: number;
  unit: string; // e.g. "bpm", "mg/dL"
  timestamp: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  fhir_reference: string;
}

export interface ChronicCondition {
  id: string;
  snomed_code: string;
  display: string;
  display_ar?: string;
  onset_date: string;
  clinical_status: 'active' | 'recurrence' | 'remission' | 'resolved';
  verification_status: 'confirmed' | 'provisional' | 'differential';
}

export interface Patient360Header {
  patient_id: string;
  national_id_hash: string;
  full_name: string;
  full_name_ar: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birth_date: string;
  age: number;
  blood_type: string;
  primary_language: 'en-US' | 'ar-SA' | 'ar-AE';
  regional_hie_id: string; // Malaffi / NPHIES / NABIDH / Riayati ID
  insurance_provider: string;
  policy_number: string;
  active_encounter_id?: string;
  admission_date?: string;
  vitals: VitalMetric[];
  conditions: ChronicCondition[];
  risk_score: {
    readmission_30d: number; // 0.0 - 1.0
    mortality_risk: number;
    claim_denial_probability: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
}

export interface TimelineEvent {
  event_id: string;
  patient_id: string;
  encounter_id: string;
  timestamp: string;
  relative_offset_hours: number; // Delta t relative to admission
  event_type: 'ADMISSION' | 'LAB_OBSERVATION' | 'CLINICAL_NOTE' | 'MEDICATION' | 'PROCEDURE' | 'CLAIM_SUBMISSION';
  title: string;
  title_ar?: string;
  description: string;
  verbatim_span?: string;
  fhir_path?: string;
  severity?: 'NORMAL' | 'WARNING' | 'CRITICAL';
}
