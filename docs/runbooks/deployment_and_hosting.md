# Runbook: Live Hosting & Deployment Guide

This runbook provides complete, step-by-step instructions for deploying the **Hospyar Sovereign AI Copilot** to obtain **live public URLs** for project submission, clinical demonstrations, and enterprise reviews.

---

## 1. System Deployment Architecture

```
                                 ┌────────────────────────────────────────┐
                                 │              END USERS                 │
                                 │     Clinicians & Medical Auditors      │
                                 └───────────────────┬────────────────────┘
                                                     │ HTTPS (Web & Mobile)
                                                     ▼
                                 ┌────────────────────────────────────────┐
                                 │           FRONTEND WEB UI              │
                                 │     Host: Vercel / Netlify / Render    │
                                 │     Live URL: https://hospyar.vercel.app
                                 └───────────────────┬────────────────────┘
                                                     │ REST API / CORS
                                                     ▼
                                 ┌────────────────────────────────────────┐
                                 │             BACKEND API                │
                                 │       Host: Render / Cloud Run         │
                                 │  Live API: https://api-hospyar.onrender.com
                                 │  Swagger: https://api-hospyar.onrender.com/docs
                                 └───────────────────┬────────────────────┘
                                                     │ Sovereign Data Perimeter
                                                     ▼
                                 ┌────────────────────────────────────────┐
                                 │         SNOWFLAKE DATA CLOUD           │
                                 │    Account: ROWTOWL-AQ46857            │
                                 │    Database: HOSPYAR_PATIENT360_DB     │
                                 │    AI: Snowflake Cortex (llama3.3-70b) │
                                 └────────────────────────────────────────┘
```

---

## 2. Option A: Fast Public Deployment (Recommended for Submissions)

This setup is **free, instant, and automated via Git pushes**.

### Step 2.1: Deploy Backend API on Render.com

1. Sign up / log in to [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `GetLiveSeed/Hospyar`.
4. Configure the service settings:
   - **Name**: `hospyar-api`
   - **Root Directory**: `apps/backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Click **Advanced** → **Add Environment Variable**:
   | Variable              | Value                                      | Purpose                      |
   | --------------------- | ------------------------------------------ | ---------------------------- |
   | `SNOWFLAKE_ACCOUNT`   | `ROWTOWL-AQ46857`                          | Snowflake account identifier |
   | `SNOWFLAKE_USER`      | `GDHARMIK9`                                | Snowflake clinical user      |
   | `SNOWFLAKE_PASSWORD`  | `<your-snowflake-password>`                | Secure login password        |
   | `SNOWFLAKE_DATABASE`  | `HOSPYAR_PATIENT360_DB`                    | Sovereign DB name            |
   | `SNOWFLAKE_SCHEMA`    | `PUBLIC`                                   | Relational schema            |
   | `SNOWFLAKE_WAREHOUSE` | `HOSPYAR_CLINICAL_WH`                      | Compute warehouse            |
   | `SNOWFLAKE_ROLE`      | `HOSPYAR_CLINICAL_ROLE`                    | RBAC role                    |
   | `CORTEX_MODEL`        | `llama3.3-70b`                             | Sovereign LLM                |
   | `SOVEREIGN_REGION`    | `UAE-CENTRAL-1`                            | UAE compliance flag          |
   | `JWT_SECRET_KEY`      | `hospyar-production-secret-token-2026-32b` | Auth signature key           |
6. Click **Deploy Web Service**.
7. Once deployed, note your live backend URL:
   - **API Base**: `https://hospyar-api.onrender.com`
   - **Swagger Docs**: `https://hospyar-api.onrender.com/docs`
   - **Health Check**: `https://hospyar-api.onrender.com/health`

---

### Step 2.2: Deploy Frontend on Vercel

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import the `GetLiveSeed/Hospyar` repository.
4. In **Project Configuration**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit → select `apps/web`.
   - **Build Command**: `cd ../.. && pnpm --filter @hospyar/web build` (or leave default `pnpm run build`).
   - **Output Directory**: `dist`
5. Expand **Environment Variables**:
   | Variable       | Value                                     |
   | -------------- | ----------------------------------------- |
   | `VITE_API_URL` | `https://hospyar-api.onrender.com/api/v1` |
6. Click **Deploy**.
7. In ~60 seconds, Vercel will generate your live public URL:
   - **Live Web UI**: `https://hospyar.vercel.app` (or custom subdomain).

---

## 3. Option B: Enterprise Sovereign Cloud Deployment (Google Cloud Run / AWS ECS)

For strictly sovereign in-country hosting complying with **UAE PDPL Law No. 45** or **Saudi Arabia PDPL**:

### Step 3.1: Build & Deploy Container to Google Cloud Run (Region: `me-central1` / Dammam `me-central2`)

```bash
# Authenticate and set sovereign project
gcloud config set project <YOUR_SOVEREIGN_GCP_PROJECT>

# Build backend image
docker build -t gcr.io/<YOUR_SOVEREIGN_GCP_PROJECT>/hospyar-backend:latest apps/backend

# Push image to sovereign container registry
docker push gcr.io/<YOUR_SOVEREIGN_GCP_PROJECT>/hospyar-backend:latest

# Deploy to Cloud Run in Middle East region
gcloud run deploy hospyar-backend \
  --image gcr.io/<YOUR_SOVEREIGN_GCP_PROJECT>/hospyar-backend:latest \
  --region me-central1 \
  --allow-unauthenticated \
  --set-env-vars SOVEREIGN_REGION=UAE-CENTRAL-1,SNOWFLAKE_ACCOUNT=ROWTOWL-AQ46857,SNOWFLAKE_USER=GDHARMIK9,SNOWFLAKE_PASSWORD=<PASSWORD>
```

---

## 4. Verification & Submission Checklist

Before submitting your live URLs:

| #   | Checkpoint                  | Verification URL / Action                                                  | Expected Result                                               |
| --- | --------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | **Backend Health Check**    | `GET https://your-backend.onrender.com/health`                             | Returns `{"status":"UP","sovereign_region":"UAE-CENTRAL-1"}`  |
| 2   | **Snowflake Status**        | `GET https://your-backend.onrender.com/api/v1/patient360/snowflake/status` | Returns `{"mode":"LIVE_SNOWFLAKE","is_connected":true}`       |
| 3   | **Interactive API Docs**    | `GET https://your-backend.onrender.com/docs`                               | Swagger UI loads with Patient 360, Copilot, Claims endpoints  |
| 4   | **Web UI Home Canvas**      | Visit `https://your-frontend.vercel.app`                                   | Patient 360 header loads with LOINC vitals and Home Tour hero |
| 5   | **Guided Tour Trigger**     | Click `Start Guided Tour`                                                  | 5-step interactive modal guides through all features          |
| 6   | **Snowflake Query History** | Check Snowflake Snowsight                                                  | Real-time queries logged under user `GDHARMIK9`               |

---

## 5. Sample Submission Markdown Template

When submitting your project, use this formatted summary:

```markdown
### 🌐 Hospyar Sovereign AI Copilot - Live URLs & Submission Info

- **🖥️ Live Web Application:** [https://hospyar.vercel.app](https://hospyar.vercel.app)
- **📖 Live API Swagger Documentation:** [https://hospyar-api.onrender.com/docs](https://hospyar-api.onrender.com/docs)
- **🩺 Sovereign Health Endpoint:** [https://hospyar-api.onrender.com/health](https://hospyar-api.onrender.com/health)
- **❄️ Snowflake Connection Status:** [https://hospyar-api.onrender.com/api/v1/patient360/snowflake/status](https://hospyar-api.onrender.com/api/v1/patient360/snowflake/status)
- **📂 GitHub Monorepo:** [https://github.com/GetLiveSeed/Hospyar](https://github.com/GetLiveSeed/Hospyar)

#### Key Demo Credentials & Patients to Test:

1. **Patient 1:** `PAT-78921` — Tariq Mansoor Al-Hashemi (UAE Malaffi, Daman Gold)
2. **Patient 2:** `PAT-10492` — Fatima Zahra Al-Otaibi (Saudi NPHIES, Tawuniya)
```
