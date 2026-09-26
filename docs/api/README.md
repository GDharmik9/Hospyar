# Hospyar API Documentation & Contracts

The Hospyar API is exposed as a high-performance RESTful API using FastAPI under sovereign GCC governance rules.

## Base URL
* **Development**: `http://localhost:8000/api/v1`
* **Swagger Interactive UI**: `http://localhost:8000/docs`
* **ReDoc Interactive UI**: `http://localhost:8000/redoc`

---

## Core Endpoints

### 1. Patient & Member 360
* `GET /api/v1/patient360/{patient_id}`: Returns the real-time unified Patient 360 profile, LOINC vital trends, active SNOMED CT diagnoses, and risk scores.

### 2. Tri-Fold Hybrid Retrieval AI Copilot
* `POST /api/v1/copilot/query`: Executes deterministic hybrid retrieval (VectorRAG + GraphRAG + Text2SQL) with verbatim citation anchor generation.

### 3. Claims Scrubber & Prior-Authorization
* `GET /api/v1/claims/audit`: Audits claims against clinical progress notes and lab observations.
* `POST /api/v1/claims/scrub`: Validates claim submission payloads for Saudi NPHIES and UAE Malaffi.

### 4. Longitudinal Timeline
* `GET /api/v1/timeline/{patient_id}`: Returns synchronized multi-modal events with relative offset hours ($\Delta t = t_{event} - t_{admission}$).

### 5. Regional HIE Gateway
* `GET /api/v1/hie/status`: Pings Saudi NPHIES, Abu Dhabi Malaffi, Dubai NABIDH, and UAE Riayati nodes.
