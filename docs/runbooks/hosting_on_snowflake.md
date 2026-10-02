# Hosting Hospyar Directly on Snowflake

This runbook guides you through hosting Hospyar **100% inside your sovereign Snowflake cloud** (`ROWTOWL-AQ46857`).

Hosting inside Snowflake guarantees **zero cross-border data egress**: all patient data, embeddings, and Cortex LLM inferences (`llama3.3-70b`) remain strictly within your sovereign boundary (UAE/KSA region).

Snowflake provides two native hosting options:

1. **Option A: Snowpark Container Services (SPCS)** — Recommended for full React 19 + FastAPI production deployment with a public ingress URL.
2. **Option B: Streamlit in Snowflake (SiS)** — Instant 1-click native dashboard with zero Docker setup required.

---

## Option A: Deploy to Snowpark Container Services (SPCS)

Snowpark Container Services (SPCS) runs your Docker container directly within a secure Snowflake compute pool, providing a public TLS URL (`https://<guid>-<account>.snowflakecomputing.app`).

### Prerequisites

- Docker installed locally (`docker --version`).
- Snowflake user (`GDHARMIK9`) with access to `ACCOUNTADMIN` or privileges to create compute pools.
- Snowflake Database `HOSPYAR_CLINICAL_DB` and Schema `CLINICAL_DATA` already created via [`snowflake_setup.sql`](file:///d:/projects-bhim/Hospyar/scripts/snowflake_setup.sql).

---

### Step 1: Provision Compute Pool & Image Repository in Snowflake

Open a new Worksheet in your [Snowflake Web Console](https://app.snowflake.com/) and run lines 1–35 of [`scripts/snowflake_spcs_setup.sql`](file:///d:/projects-bhim/Hospyar/scripts/snowflake_spcs_setup.sql):

```sql
USE ROLE ACCOUNTADMIN;
USE WAREHOUSE HOSPYAR_WH;
USE DATABASE HOSPYAR_CLINICAL_DB;
USE SCHEMA CLINICAL_DATA;

-- Create Compute Pool (CPU_X64_XS is low-cost and ideal for web + API)
CREATE COMPUTE POOL IF NOT EXISTS HOSPYAR_COMPUTE_POOL
  MIN_NODES = 1
  MAX_NODES = 1
  INSTANCE_FAMILY = 'CPU_X64_XS'
  AUTO_RESUME = TRUE
  AUTO_SUSPEND_SECS = 3600;

-- Create Image Repository
CREATE IMAGE REPOSITORY IF NOT EXISTS HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_IMAGE_REPO;

-- Retrieve Registry URL
SHOW IMAGE REPOSITORIES IN SCHEMA HOSPYAR_CLINICAL_DB.CLINICAL_DATA;
```

In the output table, locate the **`repository_url`** column. It will look like:

```text
<orgname>-<accountname>.registry.snowflakecomputing.com/hospyar_clinical_db/clinical_data/hospyar_image_repo
```

---

### Step 2: Build the Container Image

Open PowerShell or terminal in your project root (`d:/projects-bhim/Hospyar`) and build the unified production image:

```bash
docker build -t hospyar-app:latest -f Dockerfile.snowflake .
```

_Note: This multi-stage Docker build bundles the compiled React 19 SPA and FastAPI backend into a single sovereign container._

---

### Step 3: Log In to Snowflake Container Registry

Authenticate your local Docker client with Snowflake using your Snowflake username and password:

```bash
# Format: <orgname>-<accountname>.registry.snowflakecomputing.com
docker login <your-orgname>-<your-accountname>.registry.snowflakecomputing.com -u GDHARMIK9
```

_When prompted, enter your Snowflake password._

---

### Step 4: Tag & Push Image to Snowflake

Tag your local image with the Snowflake repository URL and push:

```bash
# Tag the image
docker tag hospyar-app:latest <repository_url>/hospyar-app:latest

# Push to Snowflake Image Repository
docker push <repository_url>/hospyar-app:latest
```

---

### Step 5: Launch the Live Service in Snowflake

Return to your Snowflake Worksheet and execute the service creation statement:

```sql
USE ROLE ACCOUNTADMIN;
USE DATABASE HOSPYAR_CLINICAL_DB;
USE SCHEMA CLINICAL_DATA;

CREATE SERVICE IF NOT EXISTS HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE
  IN COMPUTE POOL HOSPYAR_COMPUTE_POOL
  FROM SPECIFICATION $$
  spec:
    containers:
    - name: hospyar-app
      image: /hospyar_clinical_db/clinical_data/hospyar_image_repo/hospyar-app:latest
      env:
        SOVEREIGN_REGION: UAE-CENTRAL-1
        REGULATORY_REGIME: UAE_PDPL_ADHICS
        SNOWFLAKE_ACCOUNT: ROWTOWL-AQ46857
        SNOWFLAKE_WAREHOUSE: HOSPYAR_WH
        SNOWFLAKE_DATABASE: HOSPYAR_CLINICAL_DB
        SNOWFLAKE_SCHEMA: CLINICAL_DATA
      resources:
        requests:
          memory: 1G
          cpu: 0.5
        limits:
          memory: 2G
          cpu: 1.0
    endpoints:
    - name: web
      port: 8000
      public: true
  $$;

-- Allow public web traffic to the ingress endpoint
GRANT USAGE ON SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE TO ROLE PUBLIC;
```

---

### Step 6: Retrieve Your Live Public Snowflake URL

Run the following command to get your live application endpoint:

```sql
SHOW ENDPOINTS IN SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE;
```

Look at the **`ingress_url`** column in the output. You will see your permanent live URL:

```text
https://<random-hash>-rowtowl-aq46857.snowflakecomputing.app
```

Open this link in your browser to view the live app!

---

### Step 7: Service Monitoring & Logs

- **Check Service Status**:
  ```sql
  SELECT SYSTEM$GET_SERVICE_STATUS('HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE');
  ```
- **Inspect Live Container Logs**:
  ```sql
  SELECT SYSTEM$GET_SERVICE_LOGS('HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE', '0', 'hospyar-app', 100);
  ```
- **Suspend/Resume to Control Costs**:
  ```sql
  -- Suspend when not in use:
  ALTER SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE SUSPEND;
  ALTER COMPUTE POOL HOSPYAR_COMPUTE_POOL SUSPEND;

  -- Resume:
  ALTER COMPUTE POOL HOSPYAR_COMPUTE_POOL RESUME;
  ALTER SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE RESUME;
  ```

---

## Option B: Native Streamlit in Snowflake (SiS) (Instant 1-Click)

If you need a live demo running inside Snowflake immediately without running Docker commands:

1. Log into your [Snowflake Web Console](https://app.snowflake.com/).
2. In the left navigation bar, navigate to **Projects** &rarr; **Streamlit**.
3. Click the blue **`+ Streamlit App`** button in the top right.
4. Set the modal settings:
   - **App Name**: `Hospyar Sovereign Copilot`
   - **Database**: `HOSPYAR_CLINICAL_DB`
   - **Schema**: `CLINICAL_DATA`
   - **Warehouse**: `HOSPYAR_WH`
5. In the Snowflake code editor, clear the template code.
6. Open [`scripts/snowflake_streamlit_app.py`](file:///d:/projects-bhim/Hospyar/scripts/snowflake_streamlit_app.py) from this repository, copy its full contents, and paste it into the Snowflake editor.
7. Click the blue **Run** button.
8. Click **Share** (top right) to invite reviewers or share access.

---

## Comparison Summary

| Metric           | Option A: Snowpark Container Services (SPCS) | Option B: Streamlit in Snowflake (SiS)   |
| ---------------- | -------------------------------------------- | ---------------------------------------- |
| **Tech Stack**   | React 19 + TypeScript + FastAPI + Uvicorn    | Native Python Streamlit in Snowflake     |
| **Ingress URL**  | Public HTTPS (`.snowflakecomputing.app`)     | Snowflake Native App Link / Shared Link  |
| **Setup Effort** | `docker build` + `docker push` + 1 SQL query | 100% in-browser, copy & paste (1 minute) |
| **Sovereignty**  | 100% inside Snowflake UAE-CENTRAL-1          | 100% inside Snowflake UAE-CENTRAL-1      |
| **Cortex AI**    | Live `llama3.3-70b`                          | Live `llama3.3-70b`                      |
