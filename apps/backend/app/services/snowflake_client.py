from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta, timezone
from ..core.config import settings
from ..domain.enums import SeverityLevel

class SnowflakeClientService:
    """
    Connects to Snowflake Relational Database, Cortex Search vector indexes,
    and Snowflake Cortex AI managed LLM inference.
    Includes in-memory governed repository for seed GCC patient records.
    """
    def __init__(self):
        self.account = settings.SNOWFLAKE_ACCOUNT
        self.database = settings.SNOWFLAKE_DATABASE
        self.schema = settings.SNOWFLAKE_SCHEMA
        self.role = settings.SNOWFLAKE_ROLE
        self._seed_mock_tables()

    def _seed_mock_tables(self):
        self.patients = {
            "PAT-78921": {
                "patient_id": "PAT-78921",
                "national_id_hash": "784-1985-3928172-1",
                "full_name": "Tariq Mansoor Al-Hashemi",
                "full_name_ar": "طارق منصور الهاشمي",
                "gender": "MALE",
                "birth_date": "1982-04-12",
                "age": 42,
                "blood_type": "O+",
                "primary_language": "ar-AE",
                "regional_hie_id": "MAL-DXB-99214",
                "insurance_provider": "Daman National Health Insurance",
                "policy_number": "DMN-GLD-882190",
                "active_encounter_id": "ENC-40291",
                "admission_date": "2026-09-24T08:30:00Z",
                "risk_score": {
                    "readmission_30d": 0.28,
                    "mortality_risk": 0.04,
                    "claim_denial_probability": 0.12,
                    "risk_level": "MEDIUM"
                }
            },
            "PAT-10492": {
                "patient_id": "PAT-10492",
                "national_id_hash": "108-1979-4481023-9",
                "full_name": "Fatima Zahra Al-Otaibi",
                "full_name_ar": "فاطمة زهراء العتيبي",
                "gender": "FEMALE",
                "birth_date": "1979-11-20",
                "age": 46,
                "blood_type": "A+",
                "primary_language": "ar-SA",
                "regional_hie_id": "NPHIES-RUH-77401",
                "insurance_provider": "Tawuniya Cooperative Insurance",
                "policy_number": "TAW-PRM-102941",
                "active_encounter_id": "ENC-55102",
                "admission_date": "2026-09-25T14:15:00Z",
                "risk_score": {
                    "readmission_30d": 0.45,
                    "mortality_risk": 0.08,
                    "claim_denial_probability": 0.35,
                    "risk_level": "HIGH"
                }
            }
        }

        now_utc = datetime.now(timezone.utc)
        self.vitals = {
            "PAT-78921": [
                {
                    "id": "VIT-01",
                    "code": "8867-4",
                    "display": "Heart Rate",
                    "display_ar": "معدل ضربات القلب",
                    "value": 74,
                    "unit": "bpm",
                    "timestamp": now_utc - timedelta(hours=2),
                    "trend": "STABLE",
                    "status": SeverityLevel.NORMAL,
                    "fhir_reference": "Observation/obs-89102"
                },
                {
                    "id": "VIT-02",
                    "code": "8480-6",
                    "display": "Systolic Blood Pressure",
                    "display_ar": "ضغط الدم الانقباضي",
                    "value": 138,
                    "unit": "mmHg",
                    "timestamp": now_utc - timedelta(hours=2),
                    "trend": "UP",
                    "status": SeverityLevel.WARNING,
                    "fhir_reference": "Observation/obs-89103"
                },
                {
                    "id": "VIT-03",
                    "code": "1558-6",
                    "display": "Fasting Blood Glucose",
                    "display_ar": "سكر الدم الصائم",
                    "value": 142,
                    "unit": "mg/dL",
                    "timestamp": now_utc - timedelta(hours=5),
                    "trend": "UP",
                    "status": SeverityLevel.WARNING,
                    "fhir_reference": "Observation/obs-89104"
                },
                {
                    "id": "VIT-04",
                    "code": "4548-4",
                    "display": "Hemoglobin A1c",
                    "display_ar": "السكر التراكمي",
                    "value": 7.4,
                    "unit": "%",
                    "timestamp": now_utc - timedelta(days=1),
                    "trend": "STABLE",
                    "status": SeverityLevel.WARNING,
                    "fhir_reference": "Observation/obs-89105"
                }
            ]
        }

        self.conditions = {
            "PAT-78921": [
                {
                    "id": "COND-01",
                    "snomed_code": "44054006",
                    "display": "Type 2 diabetes mellitus",
                    "display_ar": "داء السكري من النوع الثاني",
                    "onset_date": "2022-03-10",
                    "clinical_status": "active",
                    "verification_status": "confirmed"
                },
                {
                    "id": "COND-02",
                    "snomed_code": "38341003",
                    "display": "Hypertensive disorder",
                    "display_ar": "ارتفاع ضغط الدم الشرياني",
                    "onset_date": "2023-01-15",
                    "clinical_status": "active",
                    "verification_status": "confirmed"
                }
            ]
        }

        self.clinical_notes = [
            {
                "chunk_id": "CHK-001",
                "patient_id": "PAT-78921",
                "note_type": "Discharge_Summary",
                "pointer": "Discharge_Summary/note-22104#span_120-145",
                "text": "Patient Tariq Al-Hashemi presented with elevated fasting blood glucose (142 mg/dL) and persistent morning headaches. Metformin dosage was adjusted to 1000mg BID. Recommended lifestyle modification and follow-up HbA1c check in 3 months.",
                "relative_offset_hours": 12
            },
            {
                "chunk_id": "CHK-002",
                "patient_id": "PAT-78921",
                "note_type": "Cardiology_Consult",
                "pointer": "Consult_Note/note-33109#span_45-88",
                "text": "Echocardiogram indicates normal left ventricular ejection fraction (LVEF 58%). Mild concentric left ventricular hypertrophy consistent with chronic Stage 1 hypertension. Continue lisinopril 10mg daily.",
                "relative_offset_hours": 24
            }
        ]

    def get_patient_header(self, patient_id: str) -> Optional[Dict[str, Any]]:
        return self.patients.get(patient_id)

    def get_patient_vitals(self, patient_id: str) -> List[Dict[str, Any]]:
        return self.vitals.get(patient_id, [])

    def get_patient_conditions(self, patient_id: str) -> List[Dict[str, Any]]:
        return self.conditions.get(patient_id, [])

    def search_note_chunks(self, patient_id: str) -> List[Dict[str, Any]]:
        return [n for n in self.clinical_notes if n["patient_id"] == patient_id]

    def execute_text2sql(self, query: str, patient_id: str) -> Dict[str, Any]:
        vitals = self.get_patient_vitals(patient_id)
        if "glucose" in query.lower() or "blood sugar" in query.lower():
            res = [v for v in vitals if v["code"] == "1558-6"]
            if res:
                return {
                    "metric": "Fasting Blood Glucose",
                    "value": res[0]["value"],
                    "unit": res[0]["unit"],
                    "pointer": res[0]["fhir_reference"] + "#valueQuantity",
                    "sql_query": "SELECT NUMERIC_VALUE, VALUE_UNIT FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = 'PAT-78921' AND LOINC_CODE = '1558-6' ORDER BY OBSERVATION_TIMESTAMP DESC LIMIT 1;"
                }
        if "hba1c" in query.lower() or "a1c" in query.lower():
            res = [v for v in vitals if v["code"] == "4548-4"]
            if res:
                return {
                    "metric": "Hemoglobin A1c",
                    "value": res[0]["value"],
                    "unit": res[0]["unit"],
                    "pointer": res[0]["fhir_reference"] + "#valueQuantity",
                    "sql_query": "SELECT NUMERIC_VALUE, VALUE_UNIT FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = 'PAT-78921' AND LOINC_CODE = '4548-4' ORDER BY OBSERVATION_TIMESTAMP DESC LIMIT 1;"
                }
        return {
            "metric": "General Observation Count",
            "value": len(vitals),
            "unit": "observations",
            "pointer": "Observation/summary#count",
            "sql_query": f"SELECT COUNT(*) FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = '{patient_id}';"
        }

snowflake_service = SnowflakeClientService()
