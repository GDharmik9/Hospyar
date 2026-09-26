# Hospyar Sovereign AI Copilot Monorepo

> **Enterprise Patient & Member 360 Platform for GCC Healthcare Governance**  
> Grounded in **UAE PDPL (Federal Decree-Law No. 45)** and **Saudi Arabia PDPL** with zero cross-border data egress.

---

## 🏛️ Monorepo Architecture Overview

This monorepo is orchestrated by **Turborepo** (`turbo.json`) and **pnpm workspaces**, implementing a unified **Atomic Architecture** across both frontend applications and backend services.

```text
hospyar/
├── apps/
│   ├── web/                          # Next.js / Vite React Patient 360 & Copilot App
│   │   ├── src/
│   │   │   ├── pages/                # Page Views (Patient360, Copilot, Timeline, Claims, HIE)
│   │   │   ├── hooks/                # React State & Query Hooks
│   │   │   ├── context/              # Locale Context (Bilingual RTL/LTR), Patient Context
│   │   │   ├── services/             # Typed API Client with Fallback Resilience
│   │   │   └── components/templates/ # Layout Shells with RTL direction management
│   │
│   └── backend/                      # Python 3.12+ FastAPI Sovereign Backend
│       ├── app/
│       │   ├── atoms/                # Core Primitives: DTOs, Enums, Config, Hashers, Crypto
│       │   ├── molecules/            # Domain Services: Embedder, BM25, Graph, FHIR, DLQ, Snowflake
│       │   ├── organisms/            # Orchestrators: HybridRAG Router, Cortex AI, Aligner, Scrubber, Audit
│       │   ├── pages/                # API Route Controllers (/patient360, /copilot, /claims, /timeline, /hie)
│       │   ├── hooks/                # FastAPI Middleware & Dependencies (use_auth, use_db, use_locale, use_audit)
│       │   └── main.py               # FastAPI App Factory & Middleware
│       └── tests/                    # Pytest verification for Atoms, Molecules & Organisms
│
├── packages/
│   ├── shared-types/                 # Shared TypeScript Data Contracts & FHIR DTOs
│   ├── ui/                           # Shared Atomic Design System UI Library
│   │   ├── src/atoms/                # Atoms (Button, Badge, CitationAnchorBadge, Input, Spinner, SeverityPill)
│   │   ├── src/molecules/            # Molecules (VitalMetricCard, RouteBadgeGroup, LanguageSwitcher, ChatMessageBubble)
│   │   ├── src/organisms/            # Organisms (Patient360Header, CopilotChatPanel, TriFoldRetrievalInspector, Timeline)
│   │   └── src/hooks/                # UI Hooks (useRTL, useCitationModal)
│   ├── typescript-config/            # Shared Base & React TSConfigs
│   └── docs/                         # System HLD, LLD, DFD, Sequence & Ingestion Specs
```

---

## 🔬 Frontend & Backend Atomic Mapping

| Atomic Layer | Frontend (`packages/ui` & `apps/web`) | Backend (`apps/backend/app`) |
| :--- | :--- | :--- |
| **Atoms** | `Button`, `Badge`, `CitationAnchorBadge`, `Input`, `Spinner`, `SeverityPill` | `types.py` (Pydantic DTOs), `enums.py`, `config.py`, `errors.py`, `security.py` |
| **Molecules** | `VitalMetricCard`, `RouteBadgeGroup`, `LanguageSwitcher`, `ClaimStatusBadge`, `ChatMessageBubble` | `vector_embedder.py`, `bm25_ranker.py`, `graph_traverser.py`, `fhir_validator.py`, `snowflake_client.py` |
| **Organisms** | `Patient360Header`, `CopilotChatPanel`, `TriFoldRetrievalInspector`, `LongitudinalTimeline`, `ClaimsScrubberTable` | `hybrid_rag_router.py`, `cortex_orchestrator.py`, `temporal_aligner.py`, `claims_scrubber.py`, `audit_logger.py` |
| **Pages** | `Patient360Page`, `CopilotChatPage`, `LongitudinalTimelinePage`, `ClaimsAuditPage`, `HIESyncPage` | `patient360_routes.py`, `copilot_routes.py`, `claims_routes.py`, `timeline_routes.py`, `hie_routes.py` |
| **Hooks** | `useRTL`, `useCitationModal`, `usePatient360`, `useCopilot`, `useClaims` | `use_auth.py` (RBAC), `use_db.py`, `use_audit.py`, `use_locale.py` |

---

## 🚀 Quickstart & Commands

### 1. Install Workspace Dependencies
```bash
pnpm install
```

### 2. Build All Packages & Applications
```bash
pnpm run build
```

### 3. Run Automated Tests
```bash
pnpm run test
```

### 4. Start Development Servers
```bash
# Starts both frontend (port 3000) and backend (port 8000)
pnpm run dev
```

* **Web Application UI:** `http://localhost:3000`
* **FastAPI Interactive Docs:** `http://localhost:8000/docs`
* **Sovereign Health Check:** `http://localhost:8000/health`

---

## 🛡️ GCC Sovereignty & Key Features

* **Deterministic Tri-Fold Hybrid Retrieval**: Seamless routing across **VectorRAG** (narrative notes), **GraphRAG** (SNOMED CT / LOINC ontology graph), and **Text2SQL** (deterministic exact numbers and totals).
* **Verbatim Citation Anchors**: Every AI assertion contains interactive inline proof tags e.g. `[CIT-001]` linked to exact FHIR paths (`Observation/obs-89104#valueQuantity`) or document spans (`Discharge_Summary/note-22104#span_120-145`).
* **Bilingual Arabic & English with Native RTL**: Dynamic direction switching and typography optimized for GCC users.
* **Regional HIE Gateways**: Native alignment with Saudi NPHIES, Abu Dhabi Malaffi, Dubai NABIDH, and UAE Riayati.
