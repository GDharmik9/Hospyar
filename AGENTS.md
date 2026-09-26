# AGENTS.md: Developer & AI Assistant Guidelines for Hospyar

## Project Overview
Hospyar is an enterprise-grade multi-modal AI copilot delivering a real-time **Patient and Member 360 profile** tailored for **Gulf Cooperation Council (GCC) healthcare governance** (UAE PDPL Federal Decree-Law No. 45, KSA PDPL, ADHICS, and regional HIEs: NPHIES, Malaffi, NABIDH, Riayati).

---

## Architectural Principles

### 1. Zero Cross-Border Egress
- All clinical notes, FHIR payloads, vector embeddings, and LLM inference calls must remain strictly within sovereign cloud boundaries (`UAE-CENTRAL-1` or `KSA-CENTRAL-1`).
- Never introduce third-party cloud APIs that transmit patient PHI/PII out of region.

### 2. Deterministic Tri-Fold Hybrid Retrieval (HybridRAG)
Hospyar routes user questions using three deterministic paths:
- **VectorRAG**: Dense semantic search (`bge-large-en` 768-dim) + lexical BM25 over note chunks.
- **GraphRAG**: NetworkX traversal of SNOMED CT and LOINC concept hierarchies to prevent semantic drift.
- **Text2SQL**: Direct relational query execution for exact numeric metrics, lab trends, and totals to guarantee zero hallucination.

### 3. Verbatim Citation Anchors
- Every AI-generated output assertion MUST be bound to a source anchor `[CIT-xxx]`.
- Pointers must resolve to immutable locations:
  - `Observation/obs-89104#valueQuantity`
  - `Discharge_Summary/note-22104#span_120-145`
  - `SNOMED-CT/44054006`

---

## Codebase Organization & Best Practices

### Backend (`apps/backend/app`) — Clean Architecture / Hexagonal
Follow this exact layered separation:
- `core/`: Application settings, custom exceptions, security primitives, and audit logging.
- `domain/`: Business entities (`PatientProfile`, `VitalObservation`, `Citation`), enums (`RouteEnum`, `UserRole`, `HIESystem`), value objects. No external library imports here.
- `services/`: External adapters and infrastructure interfaces (`VectorEmbedderService`, `BM25RankerService`, `GraphTraverserService`, `FHIRValidatorService`, `SnowflakeClientService`, `DLQQuarantineService`).
- `use_cases/`: Core application workflows (`HybridRAGRouterUseCase`, `CortexOrchestratorUseCase`, `TemporalAlignerUseCase`, `ClaimsScrubberUseCase`).
- `delivery/`: HTTP presentation layer:
  - `routes/`: FastAPI APIRouter controllers.
  - `dto/`: Pydantic request and response models.
  - `dependencies/`: FastAPI dependency injection (`auth.py`, `db.py`, `audit.py`, `locale.py`).

### Frontend (`apps/web` & `packages/ui`) — Atomic Design
- `packages/ui/src/atoms/`: Pure stateless primitives (`Button`, `Badge`, `CitationAnchorBadge`, `Input`, `Spinner`, `SeverityPill`).
- `packages/ui/src/molecules/`: Composed components (`VitalMetricCard`, `RouteBadgeGroup`, `LanguageSwitcher`, `ChatMessageBubble`).
- `packages/ui/src/organisms/`: Feature components (`Patient360Header`, `CopilotChatPanel`, `TriFoldRetrievalInspector`, `LongitudinalTimeline`, `ClaimsScrubberTable`, `EvidenceCitationDrawer`).
- `apps/web/src/pages/`: Views mapped to user workflows (`Patient360Page`, `CopilotChatPage`, `LongitudinalTimelinePage`, `ClaimsAuditPage`, `HIESyncPage`).
- `apps/web/src/hooks/`: Custom state and query hooks.
- **Bilingual RTL/LTR**: Always test Arabic text rendering (`dir="rtl"`) alongside English (`dir="ltr"`).

---

## Build & Test Commands
```bash
# Install all dependencies across workspaces
pnpm install

# Build all packages via Turborepo
pnpm run build

# Run automated test suites
pnpm run test

# Start local dev server
pnpm run dev
```
