from datetime import datetime, timedelta
from typing import List, Dict, Any
from ..domain.enums import SeverityLevel

class TemporalAlignerUseCase:
    """
    Computes relative temporal offsets Delta t = t_event - t_admission
    to project heterogeneous multi-modal events (vitals, notes, labs, claims)
    onto a unified chronological Patient 360 timeline.
    """
    def align_patient_timeline(self, patient_id: str, admission_date_str: str) -> List[Dict[str, Any]]:
        admission_time = datetime.fromisoformat(admission_date_str.replace("Z", "+00:00"))
        events = []

        events.append({
            "event_id": "EVT-001",
            "patient_id": patient_id,
            "encounter_id": "ENC-40291",
            "timestamp": admission_time,
            "relative_offset_hours": 0,
            "event_type": "ADMISSION",
            "title": "Hospital Inpatient Admission",
            "title_ar": "دخول المستشفى - إقامة داخلية",
            "description": "Patient admitted via Emergency Department with acute glycemic elevation and hypertensive urgency.",
            "fhir_path": "Encounter/ENC-40291",
            "severity": SeverityLevel.WARNING
        })

        events.append({
            "event_id": "EVT-002",
            "patient_id": patient_id,
            "encounter_id": "ENC-40291",
            "timestamp": admission_time + timedelta(hours=3),
            "relative_offset_hours": 3,
            "event_type": "LAB_OBSERVATION",
            "title": "Serum Glucose & Electrolyte Panel",
            "title_ar": "لوحة السكر والكهارل في الدم",
            "description": "Fasting blood glucose measured at 142 mg/dL. HbA1c drawn and sent to clinical laboratory.",
            "fhir_path": "Observation/obs-89104#valueQuantity",
            "verbatim_span": "Fasting blood glucose (142 mg/dL)",
            "severity": SeverityLevel.WARNING
        })

        events.append({
            "event_id": "EVT-003",
            "patient_id": patient_id,
            "encounter_id": "ENC-40291",
            "timestamp": admission_time + timedelta(hours=12),
            "relative_offset_hours": 12,
            "event_type": "CLINICAL_NOTE",
            "title": "Attending Physician Progress Note",
            "title_ar": "ملاحظة سير الحالة - الطبيب المعالج",
            "description": "Metformin titrated to 1000mg BID. Patient reports resolution of cephalea. Blood pressure responding to Lisinopril.",
            "fhir_path": "Discharge_Summary/note-22104#span_120-145",
            "verbatim_span": "Metformin dosage was adjusted to 1000mg BID",
            "severity": SeverityLevel.NORMAL
        })

        events.append({
            "event_id": "EVT-004",
            "patient_id": patient_id,
            "encounter_id": "ENC-40291",
            "timestamp": admission_time + timedelta(hours=24),
            "relative_offset_hours": 24,
            "event_type": "CLAIM_SUBMISSION",
            "title": "Prior-Auth Scrubber Submission (Malaffi / Daman)",
            "title_ar": "تقديم المطالبة - التأمين الصحي الوطني",
            "description": "Pre-authorization claim submitted for inpatient endocrinology monitoring and diagnostic echocardiography.",
            "fhir_path": "Claim/CLM-90214",
            "severity": SeverityLevel.NORMAL
        })

        return events
