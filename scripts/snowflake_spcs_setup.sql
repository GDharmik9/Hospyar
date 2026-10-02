-- ============================================================================
-- Hospyar Sovereign AI Copilot - Snowflake Snowpark Container Services (SPCS) Setup
-- Target Architecture: Fully sovereign container deployment inside Snowflake
-- Features: Public TLS Ingress, Zero Cross-Border Egress, Single-Container Web & API
-- ============================================================================

-- Step 1: Switch to Account Admin to provision compute pool & repository
USE ROLE ACCOUNTADMIN;
USE WAREHOUSE HOSPYAR_WH;
USE DATABASE HOSPYAR_CLINICAL_DB;
USE SCHEMA CLINICAL_DATA;

-- Step 2: Create Sovereign Compute Pool
-- (CPU_X64_XS is the lowest-cost tier for web and API microservices)
CREATE COMPUTE POOL IF NOT EXISTS HOSPYAR_COMPUTE_POOL
  MIN_NODES = 1
  MAX_NODES = 1
  INSTANCE_FAMILY = 'CPU_X64_XS'
  AUTO_RESUME = TRUE
  AUTO_SUSPEND_SECS = 3600
  COMMENT = 'Sovereign compute pool for Hospyar Web UI and FastAPI backend';

-- Step 3: Create Snowflake Image Repository for Docker containers
CREATE IMAGE REPOSITORY IF NOT EXISTS HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_IMAGE_REPO
  COMMENT = 'Repository for Hospyar multi-modal web & copilot container images';

-- Step 4: Retrieve the Image Repository Registry URL
-- Output column "repository_url" gives you your unique login target, e.g.:
-- <orgname>-<accountname>.registry.snowflakecomputing.com/hospyar_clinical_db/clinical_data/hospyar_image_repo
SHOW IMAGE REPOSITORIES IN SCHEMA HOSPYAR_CLINICAL_DB.CLINICAL_DATA;

-- ============================================================================
-- DOCKER PUSH CHEATSHEET (Run these in your local terminal):
--
-- 1. Build local container:
--    docker build -t hospyar-app:latest -f Dockerfile.snowflake .
--
-- 2. Authenticate Docker with Snowflake Container Registry:
--    docker login <your-orgname>-<your-accountname>.registry.snowflakecomputing.com -u GDHARMIK9
--    (Enter your Snowflake password when prompted)
--
-- 3. Tag image for Snowflake registry:
--    docker tag hospyar-app:latest <repository_url>/hospyar-app:latest
--
-- 4. Push to Snowflake:
--    docker push <repository_url>/hospyar-app:latest
-- ============================================================================

-- Step 5: Grant permissions to HOSPYAR_CLINICAL_ROLE
GRANT USAGE, MONITOR ON COMPUTE POOL HOSPYAR_COMPUTE_POOL TO ROLE HOSPYAR_CLINICAL_ROLE;
GRANT READ, WRITE ON IMAGE REPOSITORY HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_IMAGE_REPO TO ROLE HOSPYAR_CLINICAL_ROLE;

-- Step 6: Create or Replace the Live Snowflake Service with Public Ingress
USE ROLE HOSPYAR_CLINICAL_ROLE;
USE WAREHOUSE HOSPYAR_WH;
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

-- Step 7: Grant public access to the service endpoint
GRANT USAGE ON SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE TO ROLE PUBLIC;

-- Step 8: RETRIEVE YOUR LIVE PUBLIC SNOWFLAKE URL!
-- Look at the column "ingress_url" in the output:
-- Format: https://<guid>-<account>.snowflakecomputing.app
SHOW ENDPOINTS IN SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE;

-- Step 9: Diagnostics and Monitoring
-- Check overall service status (PENDING -> READY):
SELECT SYSTEM$GET_SERVICE_STATUS('HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE');

-- View real-time container startup & query logs:
SELECT SYSTEM$GET_SERVICE_LOGS('HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE', '0', 'hospyar-app', 100);

-- To pause service compute when idle:
-- ALTER SERVICE HOSPYAR_CLINICAL_DB.CLINICAL_DATA.HOSPYAR_SERVICE SUSPEND;
-- ALTER COMPUTE POOL HOSPYAR_COMPUTE_POOL SUSPEND;
