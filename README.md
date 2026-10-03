# Hospyar Sovereign AI Copilot Monorepo

> **Enterprise Patient & Member 360 Platform for GCC Healthcare Governance**  
> Grounded in **UAE PDPL (Federal Decree-Law No. 45)**, **Saudi Arabia PDPL**, and regional HIE standards (NPHIES, Malaffi, NABIDH, Riayati) with zero cross-border data egress.

### 🎥 Live Frontend Walkthrough & System Tour

![Hospyar Frontend Walkthrough](docs/assets/walkthrough.webp)

- 🌐 **Live Web Application:** [https://hospyar.vercel.app](https://hospyar.vercel.app)

---

## 🏛️ Monorepo Architecture Overview

This monorepo is orchestrated by **Turborepo** (`turbo.json`) and **pnpm workspaces**, implementing **Atomic Design** across the frontend and **Clean Architecture (Hexagonal)** across the backend.

```text
hospyar/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                         # CI/CD: build, lint & pytest verification
│   └── pull_request_template.md           # PR description & GCC governance checklist
│
├── docs/                                  # Human & AI reference documentation
│   ├── architecture/                      # System design diagrams, DFDs, LLD, and master spec
│   │   └── Hospyar_Monorepo_Master_Architecture.md   # 📄 Complete details consolidated in one file
│   ├── adr/                               # Architecture Decision Records
│   │   └── ADR-001_Turborepo_Clean_Architecture.md
│   ├── api/                               # OpenAPI documentation & endpoint specs
│   │   └── README.md
│   └── runbooks/                          # Local development setup & operations
│       └── local_setup.md
│
├── apps/
│   ├── backend/                           # Clean Architecture / Hexagonal FastAPI Service
│   │   ├── app/
│   │   │   ├── core/                      # Config, exceptions, logging, security
│   │   │   │   ├── config.py              # Environment & Snowflake CoCo CLI settings
│   │   │   │   ├── exceptions.py          # Domain exceptions & DLQ quarantine errors
│   │   │   │   ├── security.py            # SHA-256 hash chains, HMAC & PII masking
│   │   │   │   └── logging.py             # Append-only cryptographic audit logger
│   │   │   ├── domain/                    # Entities, value objects, business rules
│   │   │   │   ├── enums.py               # RouteEnum, UserRole, CitationPointerType, HIESystem
│   │   │   │   └── entities.py            # PatientProfile, VitalObservation, Citation, EvidenceItem
│   │   │   ├── services/                  # External integrations & technology adapters
│   │   │   │   ├── vector_embedder.py     # bge-large-en 768-dim embedding generator
│   │   │   │   ├── bm25_ranker.py         # Lexical BM25 ranker for clinical notes
│   │   │   │   ├── graph_traverser.py     # NetworkX SNOMED CT / LOINC ontology graph
│   │   │   │   ├── fhir_validator.py      # HL7 FHIR R4 schema parser
│   │   │   │   ├── citation_parser.py     # Verbatim anchor parser & proof verifier
│   │   │   │   ├── dlq_quarantine.py      # Encrypted Dead-Letter Queue
│   │   │   │   └── snowflake_client.py    # Snowflake session pool & query executor
│   │   │   ├── use_cases/                 # Application orchestrators & workflows
│   │   │   │   ├── hybrid_rag_router.py   # Tri-Fold query classifier & evidence gatherer
│   │   │   │   ├── cortex_orchestrator.py # Snowflake Cortex AI LLM synthesis
│   │   │   │   ├── temporal_aligner.py    # Relative offset calculator (Δt = t_event - t_admission)
│   │   │   │   └── claims_scrubber.py     # NPHIES / Malaffi prior-auth claim auditor
│   │   │   ├── delivery/                  # HTTP delivery layer (FastAPI)
│   │   │   │   ├── routes/                # patient360, copilot, claims, timeline, hie
│   │   │   │   ├── dto/                   # Pydantic request / response contracts
│   │   │   │   └── dependencies/          # auth (RBAC), db, audit, locale
│   │   │   └── main.py                    # FastAPI application factory & CORS
│   │   ├── tests/                         # Pytest test suite (all tests passing)
│   │   ├── requirements.txt               # Python package dependencies
│   │   ├── Dockerfile                     # Containerized production runtime
│   │   └── package.json                   # Turborepo task integration
│   │
│   └── web/                               # Atomic Design Frontend Client
│       ├── src/
│       │   ├── pages/                     # Patient360, CopilotChat, Timeline, ClaimsAudit, HIESync
│       │   ├── hooks/                     # usePatient360, useCopilot, useClaims, useTimeline
│       │   ├── context/                   # LocaleContext (Bilingual RTL/LTR), PatientContext
│       │   ├── services/                  # Typed API client with mock fallback
│       │   └── components/templates/      # MainLayout with sovereign badges & navigation
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
│
├── packages/
│   ├── shared-types/                      # Shared TypeScript data contracts
│   ├── ui/                                # Shared Atomic Design System UI Library
│   │   ├── src/atoms/                     # Button, Badge, CitationAnchorBadge, Input, Spinner, SeverityPill
│   │   ├── src/molecules/                 # VitalMetricCard, RouteBadgeGroup, LanguageSwitcher, ChatMessageBubble
│   │   ├── src/organisms/                 # Patient360Header, CopilotChatPanel, TriFoldInspector, Timeline
│   │   └── src/hooks/                     # useRTL, useCitationModal
│   └── typescript-config/                 # Shared compiler configs
│
├── .editorconfig                          # Uniform spacing & indentation across IDEs
├── .gitignore                             # Root exclusion rules
├── .env.example                           # Clean dummy environment template
├── AGENTS.md                              # Unified AI assistant coding conventions
├── GEMINI.md                              # Direct context file for LLM agents
├── README.md                              # Executive overview & quickstart
└── turbo.json                             # Turborepo task pipelines

```

---

## 🎨 Official Hospyar Enterprise Healthcare Palette

| Role                   | Color Name       | Hex Code  | Purpose in Hospyar UI                                                               |
| :--------------------- | :--------------- | :-------- | :---------------------------------------------------------------------------------- |
| **Primary Base**       | Pure White       | `#FFFFFF` | Main application background, card bodies, patient charts, and clean clinical canvas |
| **Brand & Text**       | Deep Teal Navy   | `#0B2E33` | Primary headings, top navigation bar, active sidebar links, and high-contrast text  |
| **Primary Actions**    | Slate Teal       | `#4F7C82` | Action buttons (Book Appointment, Save, Submit), selected tabs, and key icons       |
| **Cool Accent**        | Icy / Slate Blue | `#6B8B99` | Secondary buttons, patient tag outlines, and table header accents                   |
| **Borders & Dividers** | Muted Aqua Grey  | `#93B1B5` | Subtle container borders, card outlines, table gridlines, and disabled states       |
| **Soft Surface Fill**  | Soft Powder Blue | `#B8E3E9` | Highlighted rows, hover backgrounds, badge chips, and alert containers              |

---

## 🔬 Architectural Layer Mapping

### Frontend: Atomic Design (`packages/ui` & `apps/web`)

- **Atoms (`packages/ui/src/atoms`)**: `Button`, `Badge`, `CitationAnchorBadge`, `Input`, `Spinner`, `SeverityPill`
- **Molecules (`packages/ui/src/molecules`)**: `VitalMetricCard`, `RouteBadgeGroup`, `LanguageSwitcher`, `ClaimStatusBadge`, `ChatMessageBubble`, `FHIRPointerLink`
- **Organisms (`packages/ui/src/organisms`)**: `Patient360Header`, `CopilotChatPanel`, `TriFoldRetrievalInspector`, `LongitudinalTimeline`, `ClaimsScrubberTable`, `EvidenceCitationDrawer`
- **Pages (`apps/web/src/pages`)**: `Patient360Page`, `CopilotChatPage`, `LongitudinalTimelinePage`, `ClaimsAuditPage`, `HIESyncPage`
- **Templates (`apps/web/src/components/templates`)**: `MainLayout` with Deep Teal Navy sovereign bar and bilingual LTR/RTL support

### Backend: Clean Architecture (`apps/backend/app`)

- **Core (`app/core/`)**: Application settings (`config.py`), custom exceptions (`errors.py`), security primitives (`security.py`), audit trails (`audit_logger.py`)
- **Domain (`app/domain/`)**: Pure business models (`PatientProfile`, `VitalObservation`, `ClaimAuditRecord`, `CitationAnchor`) and enums (`RouteEnum`, `UserRole`, `HIESystem`)
- **Use Cases (`app/use_cases/`)**: Workflows for `HybridRAGRouterUseCase`, `CortexOrchestratorUseCase`, `TemporalAlignerUseCase`, `ClaimsScrubberUseCase`
- **Services (`app/services/`)**: Adapters for `VectorEmbedderService`, `BM25RankerService`, `GraphTraverserService`, `FHIRValidatorService`, `SnowflakeClientService`, `DLQQuarantineService`
- **Delivery (`app/delivery/`)**: FastAPI `routes/` (`patient360_routes.py`, `copilot_routes.py`, etc.), Pydantic `dto/`, and request `dependencies/` (`auth.py`, `db.py`, `audit.py`, `locale.py`)

---

## 🚀 Local Development & Operations Quickstart

### 1. Prerequisites

Ensure your local machine has the following tools installed:

- **Node.js**: `>= 20.0.0` (Recommended `v20.x` or `v22.x`)
- **pnpm**: `>= 9.0.0` (Recommended `9.15.0`)
- **Python**: `>= 3.12`
- **Git**: `>= 2.30.0`

---

### 2. Setup & Installation

```bash
# 1. Clone repository
git clone https://github.com/GetLiveSeed/Hospyar.git
cd Hospyar

# 2. Copy environment template
cp .env.example .env

# 3. Install all monorepo dependencies & activate Husky git hooks
pnpm install

# 4. Install backend Python dependencies (virtual environment optional)
pip install -r apps/backend/requirements.txt
```

---

### 3. Quality Gates & Checksum Verification

```bash
# Verify cryptographic SHA-256 integrity of tracked configs & assets
pnpm run checksum:verify

# Recompute checksum manifest after approved dependency/schema changes
pnpm run checksum:generate

# Run ESLint across all workspaces (zero-warning standard)
pnpm run lint

# Auto-fix linting and formatting issues
pnpm run lint:fix

# Run automated test suites (Pytest + Clean Architecture + Checksum Tests)
pnpm run test

# Run Turborepo production build
pnpm run build
```

---

### 4. Start Local Development Servers

```bash
# Launches both the React 19 Web UI (port 5173) and FastAPI API (port 8000)
pnpm run dev
```

- 🌐 **Patient 360 Web UI:** [http://localhost:5173](http://localhost:5173)
- 📖 **FastAPI Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🩺 **Sovereign Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

### 5. Git Commit & Push Workflow (Husky Hooks)

Hospyar automatically enforces quality gates on git operations:

- **`git commit`**: Triggers **pre-commit hook** running `lint-staged` (`eslint --fix` and `prettier --write`).
- **`git push`**: Triggers **pre-push hook** enforcing the 4 Sovereign Gates (`checksum:verify`, `lint`, `test`, `build`).

For advanced troubleshooting and branch protection configuration, refer to:

- 📘 [Local Setup & Operations Runbook](docs/runbooks/local_setup.md)
- ❄️ [Snowflake & Cortex AI Setup Runbook](docs/runbooks/snowflake_setup.md)
- ☁️ [Hosting Directly on Snowflake (SPCS & Streamlit)](docs/runbooks/hosting_on_snowflake.md)
- 🚀 [Multi-Cloud Hosting & Deployment Runbook](docs/runbooks/deployment_and_hosting.md)
- 🛡️ [GitHub Branch Protection Runbook](docs/runbooks/branch_protection.md)

## 🛡️ GCC Sovereignty & Key Principles

1. **Zero Cross-Border Data Egress**: All clinical records, vector embeddings, and LLM inference calls remain strictly inside sovereign in-country cloud regions (`UAE-CENTRAL-1` or `KSA-CENTRAL-1`).
2. **Deterministic Tri-Fold Hybrid Retrieval (HybridRAG)**:
   - **VectorRAG**: Dense semantic search (`bge-large-en` 768-dim) + lexical BM25 over clinical note chunks.
   - **GraphRAG**: NetworkX traversal of SNOMED CT and LOINC concept ontologies to prevent semantic drift.
   - **Text2SQL**: Relational queries on Snowflake/PostgreSQL for exact numeric metrics, lab trends, and financial totals.
3. **Verbatim Citation Anchors**: Every assertion is bound to immutable, verifiable citation anchors `[CIT-xxx]` resolving directly to FHIR resources (`Observation/obs-89104#valueQuantity`, `Discharge_Summary/note-22104#span_120-145`, etc.).
4. **Bilingual Arabic & English**: Native RTL/LTR switching and Arabic typography tailored for GCC clinicians and administrators.
5. **Regional HIE Gateways**: Compliant integration with Saudi NPHIES, Abu Dhabi Malaffi, Dubai NABIDH, and UAE Federal Riayati.
