-- ============================================================================
-- Hospyar Sovereign AI Copilot - Snowflake Enterprise Setup Script
-- Sovereign Perimeter: UAE PDPL (Federal Decree-Law No. 45) & KSA PDPL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: Provision Sovereign RBAC & Compute Warehouse
-- ----------------------------------------------------------------------------
USE ROLE ACCOUNTADMIN;

-- Create Dedicated Clinical Analytics Role
CREATE ROLE IF NOT EXISTS HOSPYAR_CLINICAL_ROLE
    COMMENT = 'Sovereign clinical copilot role for Hospyar Patient 360';

-- Create Sovereign Compute Warehouse (Auto-suspend after 60s idle to minimize cost)
CREATE WAREHOUSE IF NOT EXISTS HOSPYAR_CLINICAL_WH
    WAREHOUSE_SIZE = 'XSMALL'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE
    COMMENT = 'Dedicated compute warehouse for Hospyar FHIR queries & Text2SQL';

-- Grant Warehouse Usage to Clinical Role
GRANT USAGE, OPERATE ON WAREHOUSE HOSPYAR_CLINICAL_WH TO ROLE HOSPYAR_CLINICAL_ROLE;

-- ----------------------------------------------------------------------------
-- STEP 2: Provision Governed Patient 360 Database & Schema
-- ----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS HOSPYAR_PATIENT360_DB
    COMMENT = 'Sovereign repository for GCC Patient 360 & FHIR clinical data';

GRANT USAGE ON DATABASE HOSPYAR_PATIENT360_DB TO ROLE HOSPYAR_CLINICAL_ROLE;

USE DATABASE HOSPYAR_PATIENT360_DB;

CREATE SCHEMA IF NOT EXISTS PUBLIC
    COMMENT = 'Core clinical spine, observations, and vector note store';

GRANT ALL PRIVILEGES ON SCHEMA HOSPYAR_PATIENT360_DB.PUBLIC TO ROLE HOSPYAR_CLINICAL_ROLE;
GRANT ALL PRIVILEGES ON FUTURE TABLES IN SCHEMA HOSPYAR_PATIENT360_DB.PUBLIC TO ROLE HOSPYAR_CLINICAL_ROLE;

-- Grant Snowflake Cortex AI Privileges (for LLM inference & Vector Search)
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE HOSPYAR_CLINICAL_ROLE;

-- Grant Clinical Role to User
GRANT ROLE HOSPYAR_CLINICAL_ROLE TO USER GDHARMIK9;

-- Switch to the provisioned role and context
USE ROLE HOSPYAR_CLINICAL_ROLE;
USE WAREHOUSE HOSPYAR_CLINICAL_WH;
USE DATABASE HOSPYAR_PATIENT360_DB;
USE SCHEMA PUBLIC;

-- ----------------------------------------------------------------------------
-- STEP 3: Create Relational Schema & Tables (DDL)
-- ----------------------------------------------------------------------------

-- Table 1: Master Patient Spine Header
CREATE TABLE IF NOT EXISTS PATIENT_360_HEADER (
    PATIENT_ID VARCHAR(64) PRIMARY KEY,
    NATIONAL_ID_HASH VARCHAR(128) NOT NULL,
    FULL_NAME VARCHAR(255) NOT NULL,
    FULL_NAME_AR VARCHAR(255) NOT NULL,
    GENDER VARCHAR(10),
    BIRTH_DATE DATE,
    BLOOD_TYPE VARCHAR(5),
    PRIMARY_LANGUAGE VARCHAR(10) DEFAULT 'ar-AE',
    REGIONAL_HIE_ID VARCHAR(64),           -- Malaffi / NABIDH / NPHIES / Riayati Key
    INSURANCE_PROVIDER VARCHAR(128),
    POLICY_NUMBER VARCHAR(64),
    ACTIVE_ENCOUNTER_ID VARCHAR(64),
    ADMISSION_DATE TIMESTAMP_NTZ,
    RISK_READMISSION_30D NUMBER(5,2),
    RISK_MORTALITY NUMBER(5,2),
    RISK_DENIAL_PROBABILITY NUMBER(5,2),
    RISK_LEVEL VARCHAR(16) DEFAULT 'MEDIUM',
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Table 2: Structured FHIR Clinical Observations (LOINC Grounded)
CREATE TABLE IF NOT EXISTS CLINICAL_OBSERVATIONS (
    OBSERVATION_ID VARCHAR(64) PRIMARY KEY,
    PATIENT_ID VARCHAR(64) NOT NULL REFERENCES PATIENT_360_HEADER(PATIENT_ID),
    ENCOUNTER_ID VARCHAR(64),
    LOINC_CODE VARCHAR(32) NOT NULL,
    LOINC_DISPLAY VARCHAR(255),
    LOINC_DISPLAY_AR VARCHAR(255),
    NUMERIC_VALUE NUMBER(12,4),
    VALUE_UNIT VARCHAR(32),
    TREND_DIRECTION VARCHAR(16) DEFAULT 'STABLE', -- UP, DOWN, STABLE
    SEVERITY_STATUS VARCHAR(16) DEFAULT 'NORMAL', -- NORMAL, WARNING, CRITICAL
    OBSERVATION_TIMESTAMP TIMESTAMP_NTZ NOT NULL,
    FHIR_RESOURCE_PATH VARCHAR(255)               -- Ptr anchor: Observation/obs-89104#valueQuantity
);

-- Table 3: Active Conditions & Diagnoses (SNOMED CT Grounded)
CREATE TABLE IF NOT EXISTS CLINICAL_CONDITIONS (
    CONDITION_ID VARCHAR(64) PRIMARY KEY,
    PATIENT_ID VARCHAR(64) NOT NULL REFERENCES PATIENT_360_HEADER(PATIENT_ID),
    SNOMED_CODE VARCHAR(32) NOT NULL,
    DISPLAY_NAME VARCHAR(255) NOT NULL,
    DISPLAY_NAME_AR VARCHAR(255) NOT NULL,
    ONSET_DATE DATE,
    CLINICAL_STATUS VARCHAR(32) DEFAULT 'active',
    VERIFICATION_STATUS VARCHAR(32) DEFAULT 'confirmed',
    FHIR_RESOURCE_PATH VARCHAR(255)
);

-- Table 4: Clinical Note Chunks & 768-Dim Vector Store
CREATE TABLE IF NOT EXISTS NOTE_CHUNKS_VECTOR_STORE (
    CHUNK_ID VARCHAR(64) PRIMARY KEY,
    NOTE_ID VARCHAR(64) NOT NULL,
    PATIENT_ID VARCHAR(64) NOT NULL REFERENCES PATIENT_360_HEADER(PATIENT_ID),
    HADM_ID VARCHAR(64),
    NOTE_TYPE VARCHAR(64),                        -- Discharge_Summary, Cardiology_Consult
    SECTION_HEADER VARCHAR(128),
    VERBATIM_TEXT VARCHAR(4000) NOT NULL,
    RELATIVE_OFFSET_HOURS INT,
    NOTE_SPAN_POINTER VARCHAR(255),               -- Discharge_Summary/note-22104#span_120-145
    VECTOR_EMBEDDING VECTOR(FLOAT, 768),          -- bge-large-en 768-dim embeddings
    CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- ----------------------------------------------------------------------------
-- STEP 4: Seed Canonical GCC Demo Records
-- ----------------------------------------------------------------------------

-- Insert Demo Patient 1: Tariq Mansoor Al-Hashemi (UAE Malaffi)
MERGE INTO PATIENT_360_HEADER AS target
USING (
    SELECT 
        'PAT-78921' AS PATIENT_ID,
        '784-1985-3928172-1' AS NATIONAL_ID_HASH,
        'Tariq Mansoor Al-Hashemi' AS FULL_NAME,
        'طارق منصور الهاشمي' AS FULL_NAME_AR,
        'MALE' AS GENDER,
        '1982-04-12'::DATE AS BIRTH_DATE,
        'O+' AS BLOOD_TYPE,
        'ar-AE' AS PRIMARY_LANGUAGE,
        'MAL-DXB-99214' AS REGIONAL_HIE_ID,
        'Daman National Health Insurance' AS INSURANCE_PROVIDER,
        'DMN-GLD-882190' AS POLICY_NUMBER,
        'ENC-40291' AS ACTIVE_ENCOUNTER_ID,
        '2026-09-24 08:30:00'::TIMESTAMP_NTZ AS ADMISSION_DATE,
        0.28 AS RISK_READMISSION_30D,
        0.04 AS RISK_MORTALITY,
        0.12 AS RISK_DENIAL_PROBABILITY,
        'MEDIUM' AS RISK_LEVEL
) AS src
ON target.PATIENT_ID = src.PATIENT_ID
WHEN NOT MATCHED THEN INSERT (
    PATIENT_ID, NATIONAL_ID_HASH, FULL_NAME, FULL_NAME_AR, GENDER, BIRTH_DATE,
    BLOOD_TYPE, PRIMARY_LANGUAGE, REGIONAL_HIE_ID, INSURANCE_PROVIDER, POLICY_NUMBER,
    ACTIVE_ENCOUNTER_ID, ADMISSION_DATE, RISK_READMISSION_30D, RISK_MORTALITY,
    RISK_DENIAL_PROBABILITY, RISK_LEVEL
) VALUES (
    src.PATIENT_ID, src.NATIONAL_ID_HASH, src.FULL_NAME, src.FULL_NAME_AR, src.GENDER, src.BIRTH_DATE,
    src.BLOOD_TYPE, src.PRIMARY_LANGUAGE, src.REGIONAL_HIE_ID, src.INSURANCE_PROVIDER, src.POLICY_NUMBER,
    src.ACTIVE_ENCOUNTER_ID, src.ADMISSION_DATE, src.RISK_READMISSION_30D, src.RISK_MORTALITY,
    src.RISK_DENIAL_PROBABILITY, src.RISK_LEVEL
);

-- Insert Demo Patient 2: Fatima Zahra Al-Otaibi (Saudi NPHIES)
MERGE INTO PATIENT_360_HEADER AS target
USING (
    SELECT 
        'PAT-10492' AS PATIENT_ID,
        '108-1979-4481023-9' AS NATIONAL_ID_HASH,
        'Fatima Zahra Al-Otaibi' AS FULL_NAME,
        'فاطمة زهراء العتيبي' AS FULL_NAME_AR,
        'FEMALE' AS GENDER,
        '1979-11-20'::DATE AS BIRTH_DATE,
        'A+' AS BLOOD_TYPE,
        'ar-SA' AS PRIMARY_LANGUAGE,
        'NPHIES-RUH-77401' AS REGIONAL_HIE_ID,
        'Tawuniya Cooperative Insurance' AS INSURANCE_PROVIDER,
        'TAW-PRM-102941' AS POLICY_NUMBER,
        'ENC-55102' AS ACTIVE_ENCOUNTER_ID,
        '2026-09-25 14:15:00'::TIMESTAMP_NTZ AS ADMISSION_DATE,
        0.45 AS RISK_READMISSION_30D,
        0.08 AS RISK_MORTALITY,
        0.35 AS RISK_DENIAL_PROBABILITY,
        'HIGH' AS RISK_LEVEL
) AS src
ON target.PATIENT_ID = src.PATIENT_ID
WHEN NOT MATCHED THEN INSERT (
    PATIENT_ID, NATIONAL_ID_HASH, FULL_NAME, FULL_NAME_AR, GENDER, BIRTH_DATE,
    BLOOD_TYPE, PRIMARY_LANGUAGE, REGIONAL_HIE_ID, INSURANCE_PROVIDER, POLICY_NUMBER,
    ACTIVE_ENCOUNTER_ID, ADMISSION_DATE, RISK_READMISSION_30D, RISK_MORTALITY,
    RISK_DENIAL_PROBABILITY, RISK_LEVEL
) VALUES (
    src.PATIENT_ID, src.NATIONAL_ID_HASH, src.FULL_NAME, src.FULL_NAME_AR, src.GENDER, src.BIRTH_DATE,
    src.BLOOD_TYPE, src.PRIMARY_LANGUAGE, src.REGIONAL_HIE_ID, src.INSURANCE_PROVIDER, src.POLICY_NUMBER,
    src.ACTIVE_ENCOUNTER_ID, src.ADMISSION_DATE, src.RISK_READMISSION_30D, src.RISK_MORTALITY,
    src.RISK_DENIAL_PROBABILITY, src.RISK_LEVEL
);

-- Seed Clinical Vitals (LOINC Grounded)
MERGE INTO CLINICAL_OBSERVATIONS AS target
USING (
    SELECT 'VIT-01' AS OBSERVATION_ID, 'PAT-78921' AS PATIENT_ID, 'ENC-40291' AS ENCOUNTER_ID, '8867-4' AS LOINC_CODE, 'Heart Rate' AS LOINC_DISPLAY, 'معدل ضربات القلب' AS LOINC_DISPLAY_AR, 74.0 AS NUMERIC_VALUE, 'bpm' AS VALUE_UNIT, 'STABLE' AS TREND_DIRECTION, 'NORMAL' AS SEVERITY_STATUS, DATEADD('hour', -2, CURRENT_TIMESTAMP()) AS OBSERVATION_TIMESTAMP, 'Observation/obs-89102' AS FHIR_RESOURCE_PATH UNION ALL
    SELECT 'VIT-02', 'PAT-78921', 'ENC-40291', '8480-6', 'Systolic Blood Pressure', 'ضغط الدم الانقباضي', 138.0, 'mmHg', 'UP', 'WARNING', DATEADD('hour', -2, CURRENT_TIMESTAMP()), 'Observation/obs-89103' UNION ALL
    SELECT 'VIT-03', 'PAT-78921', 'ENC-40291', '1558-6', 'Fasting Blood Glucose', 'سكر الدم الصائم', 142.0, 'mg/dL', 'UP', 'WARNING', DATEADD('hour', -5, CURRENT_TIMESTAMP()), 'Observation/obs-89104' UNION ALL
    SELECT 'VIT-04', 'PAT-78921', 'ENC-40291', '4548-4', 'Hemoglobin A1c', 'السكر التراكمي', 7.4, '%', 'STABLE', 'WARNING', DATEADD('day', -1, CURRENT_TIMESTAMP()), 'Observation/obs-89105'
) AS src
ON target.OBSERVATION_ID = src.OBSERVATION_ID
WHEN NOT MATCHED THEN INSERT (
    OBSERVATION_ID, PATIENT_ID, ENCOUNTER_ID, LOINC_CODE, LOINC_DISPLAY, LOINC_DISPLAY_AR,
    NUMERIC_VALUE, VALUE_UNIT, TREND_DIRECTION, SEVERITY_STATUS, OBSERVATION_TIMESTAMP, FHIR_RESOURCE_PATH
) VALUES (
    src.OBSERVATION_ID, src.PATIENT_ID, src.ENCOUNTER_ID, src.LOINC_CODE, src.LOINC_DISPLAY, src.LOINC_DISPLAY_AR,
    src.NUMERIC_VALUE, src.VALUE_UNIT, src.TREND_DIRECTION, src.SEVERITY_STATUS, src.OBSERVATION_TIMESTAMP, src.FHIR_RESOURCE_PATH
);

-- Seed Conditions (SNOMED CT Grounded)
MERGE INTO CLINICAL_CONDITIONS AS target
USING (
    SELECT 'COND-01' AS CONDITION_ID, 'PAT-78921' AS PATIENT_ID, '44054006' AS SNOMED_CODE, 'Type 2 diabetes mellitus' AS DISPLAY_NAME, 'داء السكري من النوع الثاني' AS DISPLAY_NAME_AR, '2022-03-10'::DATE AS ONSET_DATE, 'active' AS CLINICAL_STATUS, 'confirmed' AS VERIFICATION_STATUS, 'Condition/cond-9011' AS FHIR_RESOURCE_PATH UNION ALL
    SELECT 'COND-02', 'PAT-78921', '38341003', 'Hypertensive disorder', 'ارتفاع ضغط الدم الشرياني', '2023-01-15'::DATE, 'active', 'confirmed', 'Condition/cond-9012'
) AS src
ON target.CONDITION_ID = src.CONDITION_ID
WHEN NOT MATCHED THEN INSERT (
    CONDITION_ID, PATIENT_ID, SNOMED_CODE, DISPLAY_NAME, DISPLAY_NAME_AR, ONSET_DATE,
    CLINICAL_STATUS, VERIFICATION_STATUS, FHIR_RESOURCE_PATH
) VALUES (
    src.CONDITION_ID, src.PATIENT_ID, src.SNOMED_CODE, src.DISPLAY_NAME, src.DISPLAY_NAME_AR, src.ONSET_DATE,
    src.CLINICAL_STATUS, src.VERIFICATION_STATUS, src.FHIR_RESOURCE_PATH
);

-- Seed Clinical Note Chunks
MERGE INTO NOTE_CHUNKS_VECTOR_STORE AS target
USING (
    SELECT 
        'CHK-001' AS CHUNK_ID, 
        'NOTE-22104' AS NOTE_ID, 
        'PAT-78921' AS PATIENT_ID, 
        'HADM-40291' AS HADM_ID, 
        'Discharge_Summary' AS NOTE_TYPE, 
        'Discharge Instructions' AS SECTION_HEADER, 
        'Patient Tariq Al-Hashemi presented with elevated fasting blood glucose (142 mg/dL) and persistent morning headaches. Metformin dosage was adjusted to 1000mg BID. Recommended lifestyle modification and follow-up HbA1c check in 3 months.' AS VERBATIM_TEXT, 
        12 AS RELATIVE_OFFSET_HOURS, 
        'Discharge_Summary/note-22104#span_120-145' AS NOTE_SPAN_POINTER UNION ALL
    SELECT 
        'CHK-002', 
        'NOTE-33109', 
        'PAT-78921', 
        'HADM-40291', 
        'Cardiology_Consult', 
        'Cardiology Findings', 
        'Echocardiogram indicates normal left ventricular ejection fraction (LVEF 58%). Mild concentric left ventricular hypertrophy consistent with chronic Stage 1 hypertension. Continue lisinopril 10mg daily.', 
        24, 
        'Consult_Note/note-33109#span_45-88'
) AS src
ON target.CHUNK_ID = src.CHUNK_ID
WHEN NOT MATCHED THEN INSERT (
    CHUNK_ID, NOTE_ID, PATIENT_ID, HADM_ID, NOTE_TYPE, SECTION_HEADER, VERBATIM_TEXT, RELATIVE_OFFSET_HOURS, NOTE_SPAN_POINTER
) VALUES (
    src.CHUNK_ID, src.NOTE_ID, src.PATIENT_ID, src.HADM_ID, src.NOTE_TYPE, src.SECTION_HEADER, src.VERBATIM_TEXT, src.RELATIVE_OFFSET_HOURS, src.NOTE_SPAN_POINTER
);

-- ----------------------------------------------------------------------------
-- STEP 5: Verification Queries & Cortex AI Health Check
-- ----------------------------------------------------------------------------
-- Verify Table Row Counts
SELECT 'PATIENT_360_HEADER' AS TABLE_NAME, COUNT(*) AS ROW_COUNT FROM PATIENT_360_HEADER
UNION ALL
SELECT 'CLINICAL_OBSERVATIONS', COUNT(*) FROM CLINICAL_OBSERVATIONS
UNION ALL
SELECT 'CLINICAL_CONDITIONS', COUNT(*) FROM CLINICAL_CONDITIONS
UNION ALL
SELECT 'NOTE_CHUNKS_VECTOR_STORE', COUNT(*) FROM NOTE_CHUNKS_VECTOR_STORE;

-- Test Snowflake Cortex AI LLM Inference
SELECT SNOWFLAKE.CORTEX.COMPLETE(
    'llama3.3-70b', 
    'You are Hospyar Clinical AI. Confirm sovereign readiness for GCC Patient 360.'
) AS CORTEX_AI_TEST_RESPONSE;
