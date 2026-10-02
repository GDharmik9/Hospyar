# Runbook: Snowflake Sovereign Setup & Integration

This runbook guides you through provisioning, configuring, and verifying **Snowflake** and **Snowflake Cortex AI** for the **Hospyar Sovereign AI Copilot**.

---

## 1. Overview & Sovereign Architecture

Hospyar connects to Snowflake as its governed data perimeter to satisfy **UAE PDPL (Federal Decree-Law No. 45)** and **Saudi Arabia PDPL**:

- **Structured Clinical Spine**: Relational tables for Patient 360 (`PATIENT_360_HEADER`), LOINC vitals (`CLINICAL_OBSERVATIONS`), and SNOMED CT diagnoses (`CLINICAL_CONDITIONS`).
- **Vector Search**: `NOTE_CHUNKS_VECTOR_STORE` with 768-dimensional embeddings (`bge-large-en`).
- **Snowflake Cortex AI**: Sovereign managed LLM inference (`llama3-70b`) via `SNOWFLAKE.CORTEX.COMPLETE()` with zero cross-border egress.

---

## 2. Snowflake Account & Region Selection

To guarantee sovereign compliance:

- **UAE Deployments**: Use Snowflake on AWS Middle East (`me-central-1` / UAE) or Azure UAE Central (`uae-central`).
- **KSA Deployments**: Use Snowflake on AWS Middle East (Bahrain / KSA region) or sovereign private link.

### Determining Your Account Identifier

In Snowflake Snowsight:

1. Click your user profile in the bottom-left corner.
2. Go to **Account** -> **Manage Accounts** or view the URL in your browser.
3. The account format is either:
   - **Organization URL format (Recommended)**: `<ORG_NAME>-<ACCOUNT_NAME>` (e.g., `MYORG-HOSPYAR_PROD`)
   - **Legacy Locator format**: `<ACCOUNT_LOCATOR>.<REGION>` (e.g., `xy12345.me-central-1.aws`)

---

## 3. Step 1: Execute SQL Provisioning Script

We provide a complete SQL DDL script located at:
[`scripts/snowflake_setup.sql`](file:///d:/projects-bhim/Hospyar/scripts/snowflake_setup.sql)

### Option A: Using Snowflake Snowsight (Web UI)

1. Log in to your Snowflake Snowsight console as `ACCOUNTADMIN` (or `SYSADMIN`).
2. Navigate to **Projects** -> **Worksheets**.
3. Create a new SQL Worksheet (+ button).
4. Copy and paste the entire contents of [`scripts/snowflake_setup.sql`](file:///d:/projects-bhim/Hospyar/scripts/snowflake_setup.sql).
5. Click **Run All** (Ctrl+Shift+Enter / Cmd+Shift+Enter).

### Option B: Using SnowSQL CLI

```bash
snowsql -a <YOUR_ACCOUNT_IDENTIFIER> -u <YOUR_ADMIN_USER> -f scripts/snowflake_setup.sql
```

### What the Script Provisions:

1. **Role**: `HOSPYAR_CLINICAL_ROLE`
2. **User Role Grant**: `GRANT ROLE HOSPYAR_CLINICAL_ROLE TO USER GDHARMIK9;` (grants permission to switch into role)
3. **Compute Warehouse**: `HOSPYAR_CLINICAL_WH` (Size `XSMALL`, auto-suspend 60s)
4. **Database**: `HOSPYAR_PATIENT360_DB`
5. **Schema**: `PUBLIC`
6. **Cortex AI Access**: `GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE HOSPYAR_CLINICAL_ROLE`
7. **DDL Tables**:
   - `PATIENT_360_HEADER`
   - `CLINICAL_OBSERVATIONS`
   - `CLINICAL_CONDITIONS`
   - `NOTE_CHUNKS_VECTOR_STORE` (with `VECTOR(FLOAT, 768)`)
8. **Canonical Seed Data**: GCC Demo patients (`PAT-78921` Tariq Al-Hashemi and `PAT-10492` Fatima Al-Otaibi)

---

## 4. Step 2: Configure `.env` in Hospyar

Open your root [`.env`](file:///d:/projects-bhim/Hospyar/.env) file and populate the Snowflake parameters:

```ini
# Sovereign Cloud & GCC Compliance
SOVEREIGN_REGION=UAE-CENTRAL-1
REGULATORY_REGIME=UAE_PDPL_LAW_45

# Snowflake Governed Boundary Configuration
SNOWFLAKE_ACCOUNT=<YOUR_ORG_NAME>-<YOUR_ACCOUNT_NAME>
SNOWFLAKE_USER=<YOUR_SNOWFLAKE_USERNAME>
SNOWFLAKE_PASSWORD=<YOUR_SNOWFLAKE_PASSWORD>
SNOWFLAKE_DATABASE=HOSPYAR_PATIENT360_DB
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_WAREHOUSE=HOSPYAR_CLINICAL_WH
SNOWFLAKE_ROLE=HOSPYAR_CLINICAL_ROLE

# Cortex AI Managed LLM
CORTEX_MODEL=llama3.3-70b
```

> [!TIP]
> If you are using Snowflake Key-Pair authentication instead of a password, provide `SNOWFLAKE_PRIVATE_KEY_PATH` pointing to your RSA private key file.

---

## 5. Step 3: Verify Snowflake Connectivity & Cortex AI

### 1. Test Snowflake Cortex AI in Snowflake

Execute this query in a Snowflake worksheet to verify Cortex AI model availability:

```sql
USE ROLE HOSPYAR_CLINICAL_ROLE;
USE WAREHOUSE HOSPYAR_CLINICAL_WH;

SELECT SNOWFLAKE.CORTEX.COMPLETE(
    'llama3.3-70b',
    'You are Hospyar Clinical AI. Confirm sovereign readiness for GCC Patient 360.'
) AS CORTEX_TEST;
```

### 2. Verify Table Data

```sql
SELECT PATIENT_ID, FULL_NAME, REGIONAL_HIE_ID, RISK_LEVEL
FROM HOSPYAR_PATIENT360_DB.PUBLIC.PATIENT_360_HEADER;
```

### 3. Check Backend API Health

Start your local dev stack:

```bash
pnpm run dev
```

Open [http://localhost:8000/health](http://localhost:8000/health) or test the copilot chat at [http://localhost:3000](http://localhost:3000).
