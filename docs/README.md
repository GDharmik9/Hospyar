# Hospyar Engineering Documentation

Welcome to the **Hospyar** documentation hub. Hospyar is an enterprise-grade, multi-modal AI copilot delivering a real-time **Patient & Member 360 profile** engineered specifically for **GCC healthcare sovereignty** (UAE PDPL Federal Decree-Law No. 45, KSA PDPL, ADHICS, NPHIES, Malaffi, NABIDH, Riayati).

---

## Documentation Structure

```
docs/
├── architecture/          # High-level, low-level, data flow, and MIMIC pipeline designs
│   ├── Hospyar_Monorepo_Master_Architecture.md  # Monorepo, Turborepo & Clean Architecture Guide
│   ├── Hospyar_System_Architecture.md           # End-to-end System Architecture & In-Country Cloud Spec
│   ├── Hospyar_HLD_High_Level_Design.md         # High Level Design (HLD) & Micro-workflows
│   ├── Hospyar_LLD_Low_Level_Design.md          # Low Level Design (LLD), Component Specs, Class Hierarchies
│   ├── Hospyar_Data_Flow_Diagram_DFD.md         # DFD Level 0, 1 & 2 for FHIR Ingestion & Tri-Fold RAG
│   ├── Hospyar_Sequence_and_Flow_Charts.md      # UML Sequence diagrams for HybridRAG & Claim Audits
│   ├── Hospyar_Use_Case_User_Diagrams.md        # Clinical & Payer Persona workflows & use-cases
│   └── Multimodal Data Processing Pipeline for the MIMIC-IV Dataset.md # Vector & tabular ingest spec
├── adr/                   # Architecture Decision Records
│   └── ADR-001_Turborepo_Clean_Architecture.md  # Monorepo selection, Python clean architecture
├── api/                   # API Specifications & Contracts
│   └── README.md                                # FastAPI endpoints, OpenAPI contracts, and DTO schemas
└── runbooks/              # Developer & Ops Runbooks
    └── local_setup.md                           # Local environment bootstrapping, testing, & debugging
```

---

## Key Architectural Principles

1. **Zero Cross-Border Egress**: All PHI/PII, vector search, and LLM inference strictly run within sovereign cloud boundaries (`UAE-CENTRAL-1` / `KSA-CENTRAL-1`).
2. **Deterministic Tri-Fold Hybrid Retrieval**:
   - **VectorRAG**: Dense semantic search (`bge-large-en`) + BM25 lexical ranking.
   - **GraphRAG**: NetworkX traversal of SNOMED CT and LOINC concept ontologies.
   - **Text2SQL**: Relational queries on Snowflake/PostgreSQL for exact numeric indicators.
3. **Verbatim Citation Anchors**: Every clinical assertion carries immutable citations `[CIT-xxx]` resolving directly to FHIR resources (`Observation/obs-89104#valueQuantity`, `Discharge_Summary/note-22104#span_120-145`, etc.).
4. **GCC HIE Compliance**: Native support for Saudi NPHIES, Abu Dhabi Malaffi, Dubai NABIDH, and UAE Federal Riayati.
