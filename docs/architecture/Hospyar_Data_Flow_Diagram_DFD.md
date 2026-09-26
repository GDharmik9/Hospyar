# Data Flow Diagram (DFD) Specification: Hospyar AI Copilot

**System Name:** Hospyar Multi-Modal Hybrid Retrieval Copilot  
**Target Domain:** Enterprise Patient & Member 360, GCC Healthcare Governance  
**Version:** 1.0.0-PROD  
**Document Status:** Complete Multi-Level Data Flow Specification  

---

## 1. Level 0 DFD: System Context Diagram

The Level 0 Context Diagram establishes the global boundary of the Hospyar platform, identifying external data producers and consumers interacting with the system core.

```mermaid
graph TD
    %% External Entities
    E1[Hospital EHR / Synthea]
    E2[MIMIC-IV Note Corpus]
    E3[Attending Clinician]
    E4[Claims Auditor]
    E5[GCC HIE: NPHIES / Malaffi]

    %% System Boundary Process
    P0((0.0 Hospyar Multi-Modal AI Copilot System Core))

    %% Data Stores (External)
    E1 -->|Raw FHIR R4 JSON Bundles| P0
    E2 -->|De-Identified Narrative Notes| P0
    E3 -->|Natural Language Patient Query| P0
    P0 -->|Grounded Answer + Verbatim Citations| E3
    E4 -->|Claim Scrubbing Request| P0
    P0 -->|Claim Audit & Authorization Status| E4
    P0 <-->|mTLS / REST FHIR Interoperability| E5
```

---

## 2. Level 1 DFD: Major Processing Subsystems

Decomposes process `0.0` into five core data transformation modules:

```mermaid
graph TD
    %% Entities
    E1[Hospital Data Sources]
    E2[Clinician / Auditor]
    E3[GCC HIE Platforms]

    %% Processes
    P1((1.0 Ingestion & Schema Validation))
    P2((2.0 Patient 360 Unification))
    P3((3.0 Hybrid Retrieval Execution))
    P4((4.0 Grounded Synthesis & Citation))
    P5((5.0 Regional HIE Interoperability))

    %% Data Stores
    D1[(D1: Snowflake FHIR Relational Tables)]
    D2[(D2: Vector Store - Note Embeddings)]
    D3[(D3: Knowledge Graph - SNOMED/LOINC)]
    D4[(D4: Encrypted DLQ Quarantine)]
    D5[(D5: Immutable Audit Logs)]

    %% Data Flows
    E1 -->|Raw Payload| P1
    P1 -->|Schema Violation| D4
    P1 -->|Valid FHIR Objects| P2
    P2 -->|Structured Data| D1
    P2 -->|Text Chunk Vectors| D2
    P2 -->|Medical Concepts| D3

    E2 -->|User Query| P3
    P3 <-->|Exact SQL Query| D1
    P3 <-->|Vector Cosine Search| D2
    P3 <-->|Graph Traversal| D3

    P3 -->|Retrieved Context Buffer| P4
    P4 -->|Grounded Answer + Citations| E2
    P4 -->|Log Interaction| D5

    E2 -->|Scrubbed Claim| P5
    P5 <-->|FHIR API Sync| E3
    P5 <-->|Verify Records| D1
```

---

## 3. Level 2 DFD: Detailed Breakdown of Subsystem 3.0 (Hybrid Retrieval)

Detailed data transformations inside the **Deterministic Hybrid Retrieval Subsystem**:

```mermaid
graph TD
    E1[User Query Context] --> P3_1((3.1 Intent & Route Classifier))
    
    P3_1 -->|Qualitative Request| P3_2((3.2 Vector Search & BM25 Ranker))
    P3_1 -->|Ontological Request| P3_3((3.3 Knowledge Graph Traverser))
    P3_1 -->|Exact Metric Request| P3_4((3.4 Text2SQL / FHIRPath Parser))

    D2[(D2: Note Chunks Store)] <-->|Cosine + BM25 Matching| P3_2
    D3[(D3: SNOMED/LOINC Graph)] <-->|Child Node Traversal| P3_3
    D1[(D1: Relational FHIR Tables)] <-->|SQL Execution| P3_4

    P3_2 -->|Top-k Text Spans| P3_5((3.5 Evidence Context Assembly))
    P3_3 -->|Subgraph Taxonomy| P3_5
    P3_4 -->|Exact Relational Figures| P3_5

    P3_5 -->|Unified Context Buffer| Out[Prompt Buffer to Cortex LLM]
```

---
*Grounded in Multi-Modal Pipeline, FHIR ETL, and HybridRAG Architectural Specs [1, 2, 5, 8, 11, 13].*
