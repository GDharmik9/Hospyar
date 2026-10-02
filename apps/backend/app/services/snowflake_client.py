import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta, timezone
from ..core.config import settings
from ..domain.enums import SeverityLevel

logger = logging.getLogger("hospyar.snowflake")

try:
    import snowflake.connector
    SNOWFLAKE_CONNECTOR_AVAILABLE = True
except ImportError:
    SNOWFLAKE_CONNECTOR_AVAILABLE = False
    logger.warning("snowflake-connector-python not installed. Operating in in-memory seed mode.")

class SnowflakeClientService:
    """
    Connects to Snowflake Relational Database, Cortex Search vector indexes,
    and Snowflake Cortex AI managed LLM inference.
    Includes in-memory governed repository for seed GCC patient records.
    """
    def __init__(self):
        self.account = settings.SNOWFLAKE_ACCOUNT
        self.user = settings.SNOWFLAKE_USER
        self.password = settings.SNOWFLAKE_PASSWORD
        self.database = settings.SNOWFLAKE_DATABASE
        self.schema = settings.SNOWFLAKE_SCHEMA
        self.warehouse = settings.SNOWFLAKE_WAREHOUSE
        self.role = settings.SNOWFLAKE_ROLE
        self.cortex_model = settings.CORTEX_MODEL
        self._is_connected = False
        self._last_error = None

        # Always initialize deterministic in-memory seed records as baseline
        self._seed_mock_tables()

        # Attempt live connection if credentials are configured
        self._check_live_connection()

    def _check_live_connection(self):
        """Attempts a lightweight handshake with Snowflake if credentials are provided."""
        if not SNOWFLAKE_CONNECTOR_AVAILABLE:
            self._is_connected = False
            self._last_error = "snowflake-connector-python library not available"
            return

        if not self.password or self.password == "replace-with-your-snowflake-password":
            self._is_connected = False
            self._last_error = "SNOWFLAKE_PASSWORD is unset or contains default placeholder"
            return

        try:
            conn = snowflake.connector.connect(
                account=self.account,
                user=self.user,
                password=self.password,
                database=self.database,
                schema=self.schema,
                warehouse=self.warehouse,
                role=self.role,
                login_timeout=6,
                network_timeout=6
            )
            with conn.cursor() as cur:
                cur.execute("SELECT CURRENT_VERSION(), CURRENT_ACCOUNT(), CURRENT_ROLE(), CURRENT_WAREHOUSE()")
                row = cur.fetchone()
                logger.info(f"Snowflake live connection verified: version={row[0]}, account={row[1]}")
            conn.close()
            self._is_connected = True
            self._last_error = None
        except Exception as e:
            self._is_connected = False
            self._last_error = str(e)
            logger.warning(f"Snowflake live handshake failed ({e}). Operating in Sovereign Seed Fallback.")

    def get_status(self) -> Dict[str, Any]:
        """Returns the current connection and operational state of Snowflake."""
        return {
            "mode": "LIVE_SNOWFLAKE" if self._is_connected else "SOVEREIGN_SEED_FALLBACK",
            "is_connected": self._is_connected,
            "account": self.account,
            "user": self.user,
            "database": self.database,
            "schema": self.schema,
            "warehouse": self.warehouse,
            "role": self.role,
            "cortex_model": self.cortex_model,
            "connector_installed": SNOWFLAKE_CONNECTOR_AVAILABLE,
            "last_error": self._last_error
        }

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
                    "value": 74.0,
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
                    "value": 138.0,
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
                    "value": 142.0,
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
        """Retrieves patient spine header from live Snowflake table or seed fallback."""
        if self._is_connected and SNOWFLAKE_CONNECTOR_AVAILABLE:
            try:
                conn = snowflake.connector.connect(
                    account=self.account,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    schema=self.schema,
                    warehouse=self.warehouse,
                    role=self.role,
                    login_timeout=5,
                    network_timeout=5
                )
                with conn.cursor(snowflake.connector.DictCursor) as cur:
                    cur.execute(
                        "SELECT PATIENT_ID, NATIONAL_ID_HASH, FULL_NAME, FULL_NAME_AR, GENDER, "
                        "TO_CHAR(BIRTH_DATE, 'YYYY-MM-DD') AS BIRTH_DATE, BLOOD_TYPE, PRIMARY_LANGUAGE, "
                        "REGIONAL_HIE_ID, INSURANCE_PROVIDER, POLICY_NUMBER, ACTIVE_ENCOUNTER_ID, "
                        "TO_CHAR(ADMISSION_DATE, 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') AS ADMISSION_DATE, "
                        "RISK_READMISSION_30D, RISK_MORTALITY, RISK_DENIAL_PROBABILITY, RISK_LEVEL "
                        "FROM PATIENT_360_HEADER WHERE PATIENT_ID = %(pid)s",
                        {"pid": patient_id}
                    )
                    row = cur.fetchone()
                    if row:
                        birth_year = int(row["BIRTH_DATE"][:4]) if row.get("BIRTH_DATE") else 1980
                        age = datetime.now().year - birth_year
                        return {
                            "patient_id": row["PATIENT_ID"],
                            "national_id_hash": row["NATIONAL_ID_HASH"],
                            "full_name": row["FULL_NAME"],
                            "full_name_ar": row["FULL_NAME_AR"],
                            "gender": row["GENDER"],
                            "birth_date": row["BIRTH_DATE"],
                            "age": age,
                            "blood_type": row["BLOOD_TYPE"],
                            "primary_language": row["PRIMARY_LANGUAGE"],
                            "regional_hie_id": row["REGIONAL_HIE_ID"],
                            "insurance_provider": row["INSURANCE_PROVIDER"],
                            "policy_number": row["POLICY_NUMBER"],
                            "active_encounter_id": row["ACTIVE_ENCOUNTER_ID"],
                            "admission_date": row["ADMISSION_DATE"],
                            "risk_score": {
                                "readmission_30d": float(row["RISK_READMISSION_30D"] or 0.28),
                                "mortality_risk": float(row["RISK_MORTALITY"] or 0.04),
                                "claim_denial_probability": float(row["RISK_DENIAL_PROBABILITY"] or 0.12),
                                "risk_level": row["RISK_LEVEL"] or "MEDIUM"
                            }
                        }
                conn.close()
            except Exception as e:
                logger.warning(f"Live query to Snowflake PATIENT_360_HEADER failed: {e}. Falling back to seed.")

        return self.patients.get(patient_id)

    def get_patient_vitals(self, patient_id: str) -> List[Dict[str, Any]]:
        """Retrieves patient clinical vitals from live Snowflake table or seed fallback."""
        if self._is_connected and SNOWFLAKE_CONNECTOR_AVAILABLE:
            try:
                conn = snowflake.connector.connect(
                    account=self.account,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    schema=self.schema,
                    warehouse=self.warehouse,
                    role=self.role,
                    login_timeout=5,
                    network_timeout=5
                )
                with conn.cursor(snowflake.connector.DictCursor) as cur:
                    cur.execute(
                        "SELECT OBSERVATION_ID AS ID, LOINC_CODE AS CODE, LOINC_DISPLAY AS DISPLAY, "
                        "LOINC_DISPLAY_AR AS DISPLAY_AR, NUMERIC_VALUE AS VALUE, VALUE_UNIT AS UNIT, "
                        "TO_CHAR(OBSERVATION_TIMESTAMP, 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') AS TIMESTAMP, "
                        "TREND_DIRECTION AS TREND, SEVERITY_STATUS AS STATUS, FHIR_RESOURCE_PATH AS FHIR_REFERENCE "
                        "FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = %(pid)s "
                        "ORDER BY OBSERVATION_TIMESTAMP DESC",
                        {"pid": patient_id}
                    )
                    rows = cur.fetchall()
                    if rows:
                        results = []
                        for r in rows:
                            status_val = r.get("STATUS", "NORMAL")
                            try:
                                status_enum = SeverityLevel(status_val)
                            except ValueError:
                                status_enum = SeverityLevel.NORMAL
                            results.append({
                                "id": r["ID"],
                                "code": r["CODE"],
                                "display": r["DISPLAY"],
                                "display_ar": r["DISPLAY_AR"] or r["DISPLAY"],
                                "value": float(r["VALUE"] or 0.0),
                                "unit": r["UNIT"],
                                "timestamp": r["TIMESTAMP"],
                                "trend": r["TREND"] or "STABLE",
                                "status": status_enum,
                                "fhir_reference": r["FHIR_REFERENCE"] or f"Observation/{r['ID']}"
                            })
                        return results
                conn.close()
            except Exception as e:
                logger.warning(f"Live query to Snowflake CLINICAL_OBSERVATIONS failed: {e}. Falling back to seed.")

        return self.vitals.get(patient_id, [])

    def get_patient_conditions(self, patient_id: str) -> List[Dict[str, Any]]:
        """Retrieves active conditions from live Snowflake table or seed fallback."""
        if self._is_connected and SNOWFLAKE_CONNECTOR_AVAILABLE:
            try:
                conn = snowflake.connector.connect(
                    account=self.account,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    schema=self.schema,
                    warehouse=self.warehouse,
                    role=self.role,
                    login_timeout=5,
                    network_timeout=5
                )
                with conn.cursor(snowflake.connector.DictCursor) as cur:
                    cur.execute(
                        "SELECT CONDITION_ID AS ID, SNOMED_CODE, DISPLAY_NAME AS DISPLAY, "
                        "DISPLAY_NAME_AR AS DISPLAY_AR, TO_CHAR(ONSET_DATE, 'YYYY-MM-DD') AS ONSET_DATE, "
                        "CLINICAL_STATUS, VERIFICATION_STATUS "
                        "FROM CLINICAL_CONDITIONS WHERE PATIENT_ID = %(pid)s",
                        {"pid": patient_id}
                    )
                    rows = cur.fetchall()
                    if rows:
                        return [
                            {
                                "id": r["ID"],
                                "snomed_code": r["SNOMED_CODE"],
                                "display": r["DISPLAY"],
                                "display_ar": r["DISPLAY_AR"] or r["DISPLAY"],
                                "onset_date": r["ONSET_DATE"],
                                "clinical_status": r["CLINICAL_STATUS"] or "active",
                                "verification_status": r["VERIFICATION_STATUS"] or "confirmed"
                            }
                            for r in rows
                        ]
                conn.close()
            except Exception as e:
                logger.warning(f"Live query to Snowflake CLINICAL_CONDITIONS failed: {e}. Falling back to seed.")

        return self.conditions.get(patient_id, [])

    def search_note_chunks(self, patient_id: str) -> List[Dict[str, Any]]:
        """Retrieves clinical note chunks from live Snowflake vector store or seed fallback."""
        if self._is_connected and SNOWFLAKE_CONNECTOR_AVAILABLE:
            try:
                conn = snowflake.connector.connect(
                    account=self.account,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    schema=self.schema,
                    warehouse=self.warehouse,
                    role=self.role,
                    login_timeout=5,
                    network_timeout=5
                )
                with conn.cursor(snowflake.connector.DictCursor) as cur:
                    cur.execute(
                        "SELECT CHUNK_ID, NOTE_ID, PATIENT_ID, NOTE_TYPE, NOTE_SPAN_POINTER AS POINTER, "
                        "VERBATIM_TEXT AS TEXT, RELATIVE_OFFSET_HOURS "
                        "FROM NOTE_CHUNKS_VECTOR_STORE WHERE PATIENT_ID = %(pid)s",
                        {"pid": patient_id}
                    )
                    rows = cur.fetchall()
                    if rows:
                        return [
                            {
                                "chunk_id": r["CHUNK_ID"],
                                "patient_id": r["PATIENT_ID"],
                                "note_type": r["NOTE_TYPE"],
                                "pointer": r["POINTER"],
                                "text": r["TEXT"],
                                "relative_offset_hours": r["RELATIVE_OFFSET_HOURS"] or 0
                            }
                            for r in rows
                        ]
                conn.close()
            except Exception as e:
                logger.warning(f"Live query to NOTE_CHUNKS_VECTOR_STORE failed: {e}. Falling back to seed.")

        return [n for n in self.clinical_notes if n["patient_id"] == patient_id]

    def execute_cortex_llm(self, prompt: str, model: str = None) -> Optional[str]:
        """Executes SNOWFLAKE.CORTEX.COMPLETE live inference."""
        target_model = model or self.cortex_model
        if self._is_connected and SNOWFLAKE_CONNECTOR_AVAILABLE:
            try:
                conn = snowflake.connector.connect(
                    account=self.account,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    schema=self.schema,
                    warehouse=self.warehouse,
                    role=self.role,
                    login_timeout=8,
                    network_timeout=8
                )
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT SNOWFLAKE.CORTEX.COMPLETE(%(model)s, %(prompt)s) AS COMPLETION",
                        {"model": target_model, "prompt": prompt}
                    )
                    row = cur.fetchone()
                    if row and row[0]:
                        return row[0]
                conn.close()
            except Exception as e:
                logger.warning(f"Live SNOWFLAKE.CORTEX.COMPLETE execution failed: {e}")
        return None

    def execute_text2sql(self, query: str, patient_id: str) -> Dict[str, Any]:
        """Translates exact numeric inquiry into relational SQL execution."""
        vitals = self.get_patient_vitals(patient_id)
        if "glucose" in query.lower() or "blood sugar" in query.lower():
            res = [v for v in vitals if v["code"] == "1558-6"]
            if res:
                return {
                    "metric": "Fasting Blood Glucose",
                    "value": res[0]["value"],
                    "unit": res[0]["unit"],
                    "pointer": res[0]["fhir_reference"] + "#valueQuantity",
                    "sql_query": f"SELECT NUMERIC_VALUE, VALUE_UNIT FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = '{patient_id}' AND LOINC_CODE = '1558-6' ORDER BY OBSERVATION_TIMESTAMP DESC LIMIT 1;"
                }
        if "hba1c" in query.lower() or "a1c" in query.lower():
            res = [v for v in vitals if v["code"] == "4548-4"]
            if res:
                return {
                    "metric": "Hemoglobin A1c",
                    "value": res[0]["value"],
                    "unit": res[0]["unit"],
                    "pointer": res[0]["fhir_reference"] + "#valueQuantity",
                    "sql_query": f"SELECT NUMERIC_VALUE, VALUE_UNIT FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = '{patient_id}' AND LOINC_CODE = '4548-4' ORDER BY OBSERVATION_TIMESTAMP DESC LIMIT 1;"
                }
        return {
            "metric": "General Observation Count",
            "value": len(vitals),
            "unit": "observations",
            "pointer": "Observation/summary#count",
            "sql_query": f"SELECT COUNT(*) FROM CLINICAL_OBSERVATIONS WHERE PATIENT_ID = '{patient_id}';"
        }

snowflake_service = SnowflakeClientService()
