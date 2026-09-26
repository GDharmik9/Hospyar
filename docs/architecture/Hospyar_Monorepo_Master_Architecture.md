# Hospyar Sovereign AI Copilot: Master Architecture & Monorepo Specification

**Target Domain:** Enterprise Patient & Member 360, GCC Healthcare Governance  
**Governance Frameworks:** UAE PDPL (Federal Decree-Law No. 45), Saudi Arabia PDPL, ADHICS  
**Regional Health Information Exchanges (HIE):** Saudi NPHIES, Abu Dhabi Malaffi, Dubai NABIDH, Federal Riayati  
**Version:** 1.0.0-PROD  

---

## 1. Executive Summary & Big Picture Architecture

Healthcare organizations in the Gulf Cooperation Council (GCC) operate across fragmented data landscapes:
* **Structured Data:** Electronic Health Records (EHR), laboratory observations (LOINC), diagnoses (ICD-10/SNOMED CT), and insurance billing claims (CPT/ACHI).
* **Unstructured Data:** Free-text clinical progress notes, discharge summaries (MIMIC-IV-Note corpus), and diagnostic radiology narratives (MIMIC-CXR).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THE BIG PICTURE                                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Heterogeneous Sources           Tri-Fold Hybrid Engine              Enterprise Delivery   │
│  ┌───────────────────────┐      ┌─────────────────────────┐      ┌───────────────────┐ │
│  │ Structured FHIR Data  │──┐   │ VectorRAG (Notes)       │   ┌─►│ Patient 360 UI    │ │
│  │ Claims & Vitals       │  │   │                         │   │  │ (Bilingual RTL)   │ │
│  └───────────────────────┘  ├──►│ GraphRAG (SNOMED/LOINC) │───┼─►├───────────────────┤ │
│  ┌───────────────────────┐  │   │                         │   │  │ Verbatim Source   │ │
│  │ Unstructured Notes    │──┘   │ Text2SQL / FHIRPath     │   └─►│ Citation Anchors  │ │
│  │ (MIMIC-IV / CXR)      │      └─────────────────────────┘      └───────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Architectural Pillars
1. **Zero Cross-Border Data Egress**: All data, vector indexes, knowledge graph nodes, and LLM inference models (Snowflake Cortex AI) execute within local sovereign cloud boundaries (`UAE-CENTRAL-1` / `KSA-CENTRAL-1`).
2. **Deterministic Tri-Fold Hybrid Retrieval**:
   - **VectorRAG**: 768-dimensional dense semantic search (`bge-large-en`) paired with lexical BM25 ranker over clinical note chunks.
   - **GraphRAG**: NetworkX graph traversal over SNOMED CT and LOINC ontologies to preserve clinical hierarchy without semantic drift.
   - **Text2SQL / FHIRPath**: Direct database execution against Snowflake tables for exact numerical metrics and financial aggregations (guaranteeing zero generative math errors).
3. **Verbatim Citation Anchors**: Every AI claim is programmatically bound to immutable source references (e.g., `Observation/obs-89104#valueQuantity` or `Discharge_Summary/note-22104#span_120-145`).

---

## 2. Monorepo Repository Structure

The repository is managed via **Turborepo** and **pnpm workspaces**:

```text
hospyar/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                     # Continuous integration: build, lint & pytest
│   └── pull_request_template.md       # Pull request checklist & compliance rubric
│
├── docs/                              # Human & AI reference documentation
│   ├── architecture/                  # System design, DFDs, HLD, LLD, and master spec
│   │   └── Hospyar_Monorepo_Master_Architecture.md
│   ├── adr/                           # Architecture Decision Records
│   │   └── ADR-001_Turborepo_Clean_Architecture.md
│   ├── api/                           # OpenAPI contracts & endpoint specifications
│   │   └── openapi.json
│   └── runbooks/                      # Deployment, local dev, and recovery procedures
│       └── local_setup.md
│
├── apps/
│   ├── backend/                       # Python 3.12+ FastAPI Clean Architecture API
│   │   ├── app/
│   │   │   ├── core/                  # Config, exceptions, logging, security
│   │   │   │   ├── config.py          # Settings, Snowflake CoCo parameters
│   │   │   │   ├── exceptions.py      # Domain exceptions (FHIRValidationError, DLQQuarantineError)
│   │   │   │   ├── security.py        # SHA-256 hash chains, HMAC, PII masking
│   │   │   │   └── logging.py         # Cryptographic append-only audit logger
│   │   │   ├── domain/                # Business models, entities, and enums
│   │   │   │   ├── enums.py           # RouteEnum, UserRole, CitationPointerType, HIESystem
│   │   │   │   └── entities.py        # PatientProfile, VitalObservation, Citation, EvidenceItem
│   │   │   ├── services/              # External integrations & technology adapters
│   │   │   │   ├── vector_embedder.py # bge-large-en 768-dim embedding generator
│   │   │   │   ├── bm25_ranker.py     # Lexical BM25 ranker for clinical notes
│   │   │   │   ├── graph_traverser.py # NetworkX SNOMED CT / LOINC ontology graph
│   │   │   │   ├── fhir_validator.py  # HL7 FHIR R4 schema validation
│   │   │   │   ├── citation_parser.py # Verbatim anchor parser & proof verifier
│   │   │   │   ├── dlq_quarantine.py  # Encrypted Dead-Letter Queue
│   │   │   │   └── snowflake_client.py# Snowflake session pool & query executor
│   │   │   ├── use_cases/             # Application orchestrators & workflows
│   │   │   │   ├── hybrid_rag_router.py # Tri-Fold query classifier & evidence gatherer
│   │   │   │   ├── cortex_orchestrator.py # Snowflake Cortex AI LLM synthesis
│   │   │   │   ├── temporal_aligner.py# Relative offset calculator (Delta t = event - admission)
│   │   │   │   └── claims_scrubber.py # NPHIES / Malaffi prior-auth claim auditor
│   │   │   ├── delivery/              # HTTP delivery layer (FastAPI)
│   │   │   │   ├── routes/            # patient360, copilot, claims, timeline, hie
│   │   │   │   ├── dto/               # Pydantic request / response contracts
│   │   │   │   └── dependencies/      # auth (RBAC), db, audit, locale
│   │   │   └── main.py                # FastAPI app factory & CORS
│   │   ├── tests/                     # Automated unit and integration test suite
│   │   ├── requirements.txt           # Python package dependencies
│   │   ├── Dockerfile                 # Production container image definition
│   │   └── package.json               # Turbo integration for backend
│   │
│   └── web/                           # Next.js / Vite React 19 Frontend
│       ├── src/
│       │   ├── pages/                 # Patient360, CopilotChat, Timeline, ClaimsAudit, HIESync
│       │   ├── hooks/                 # usePatient360, useCopilot, useClaims, useTimeline
│       │   ├── context/               # LocaleContext (Bilingual RTL/LTR), PatientContext
│       │   ├── services/              # Typed API client with mock fallback
│       │   └── components/templates/  # MainLayout with sovereign badges & navigation
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
│
├── packages/
│   ├── shared-types/                  # Shared TypeScript interfaces & DTOs
│   ├── ui/                            # Shared Atomic Design System UI Library
│   │   ├── src/atoms/                 # Button, Badge, CitationAnchorBadge, Input, Spinner, SeverityPill
│   │   ├── src/molecules/             # VitalMetricCard, RouteBadgeGroup, LanguageSwitcher, ChatMessageBubble
│   │   ├── src/organisms/             # Patient360Header, CopilotChatPanel, TriFoldInspector, Timeline
│   │   └── src/hooks/                 # useRTL, useCitationModal
│   └── typescript-config/             # Shared compiler options (base.json, react-library.json)
│
├── .editorconfig                      # Consistent whitespace & indentation across IDEs
├── .gitignore                         # Build outputs, python caches, secrets
├── .env.example                       # Environment variable templates
├── AGENTS.md                          # Coding guidelines for AI assistants & developers
├── GEMINI.md                          # Contextual prompt reference
├── README.md                          # Executive overview & quickstart
└── turbo.json                         # Turborepo task pipeline definitions
```

---

## 3. Layered Clean Architecture Mapping

| Layer | Frontend (`packages/ui` & `apps/web`) | Backend (`apps/backend/app`) |
| :--- | :--- | :--- |
| **Primitives & Config** | `atoms/` (`Button`, `Badge`, `CitationAnchorBadge`, `Input`) | `core/` (`config.py`, `security.py`, `exceptions.py`, `logging.py`) |
| **Domain Models & Enums** | `packages/shared-types` (`patient.ts`, `copilot.ts`, `claims.ts`) | `domain/` (`entities.py`, `enums.py`) |
| **Domain Services & Integrations**| `molecules/` (`VitalMetricCard`, `RouteBadgeGroup`, `LanguageSwitcher`)| `services/` (`vector_embedder.py`, `bm25_ranker.py`, `graph_traverser.py`, `snowflake_client.py`) |
| **Application Workflows** | `organisms/` (`Patient360Header`, `CopilotChatPanel`, `LongitudinalTimeline`) | `use_cases/` (`hybrid_rag_router.py`, `cortex_orchestrator.py`, `temporal_aligner.py`, `claims_scrubber.py`) |
| **Presentation / Delivery** | `pages/` (`Patient360Page`, `CopilotChatPage`, `ClaimsAuditPage`)| `delivery/` (`routes/`, `dto/`, `dependencies/`) |

---

## 4. Quickstart Execution Guide

```bash
# 1. Install dependencies across all packages and apps
pnpm install

# 2. Build the entire monorepo with Turborepo
pnpm run build

# 3. Execute backend pytest test suite
pnpm run test

# 4. Start concurrent development servers (Web on :3000, API on :8000)
pnpm run dev
```
