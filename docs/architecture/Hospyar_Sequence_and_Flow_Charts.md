# Sequence & Flow Charts Specification: Hospyar AI Copilot

**System Name:** Hospyar Multi-Modal Hybrid Retrieval Copilot  
**Target Domain:** Enterprise Patient & Member 360, GCC Healthcare Governance  
**Version:** 1.0.0-PROD  
**Document Status:** Detailed Workflow & Chronological Interaction Spec  

---

## 1. Sequence Diagram 1: End-to-End HybridRAG Query & Citation Binding

Traces the execution path when a clinician asks: *"What is the patient's HbA1c trend and latest clinical assessment for diabetes control?"*

```mermaid
sequenceDiagram
    autonumber
    actor Clinician as Clinician / Physician
    participant UI as React Native UI
    participant Gateway as API Gateway (RBAC)
    participant Router as Hybrid Query Router
    participant Vector as VectorRAG (Note Chunks)
    participant Graph as GraphRAG (SNOMED/LOINC)
    participant SQL as Text2SQL (Relational DB)
    participant Cortex as Snowflake Cortex AI
    participant Binder as Verbatim Citation Binder

    Clinician ->> UI: Submit Query & Patient ID
    UI ->> Gateway: POST /api/v1/copilot/query (Bearer Token)
    Gateway ->> Gateway: Validate RBAC Policy & User Clearance
    Gateway ->> Router: Dispatch Query Context
    
    par Tri-Fold Retrieval Execution
        Router ->> Vector: Search Note Chunks (bge-large-en + BM25)
        Vector -->> Router: Return Top-k Text Spans + Span Pointers
    and
        Router ->> Graph: Traverse SNOMED Concept (E11 -> T2DM)
        Graph -->> Router: Return Subgraph Concepts & Relationships
    and
        Router ->> SQL: Translate Query to SQL (HbA1c Lab Values)
        SQL ->> SQL: Execute SELECT NUMERIC_VALUE FROM OBSERVATIONS...
        SQL -->> Router: Return Executed Table Results + FHIR Pointers
    end

    Router ->> Cortex: Assemble Context Buffer & Stream Prompt
    Cortex ->> Cortex: Execute SNOWFLAKE.CORTEX.COMPLETE()
    Cortex -->> Binder: Stream Raw LLM Output
    Binder ->> Binder: Verify Verbatim Evidence & Inject Citation Anchors [CIT-xxx]
    Binder ->> UI: Return JSON (Grounded Answer + Citations Array)
    UI ->> Clinician: Render Answer with Interactive Citation Badges
```

---

## 2. Sequence Diagram 2: FHIR ETL Pipeline & DLQ Routing

Traces how incoming FHIR R4 bundles are validated via `fhir.resources` and indexed or quarantined:

```mermaid
sequenceDiagram
    autonumber
    participant Source as Synthea / External EHR
    participant Ingest as Ingestion Worker
    participant Pydantic as fhir.resources Model Parser
    participant Spine as Entity Spine Mapper
    participant RelDB as Snowflake Relational Store
    participant VectorDB as Vector Embedding Index
    participant DLQ as Encrypted Quarantine DLQ

    Source ->> Ingest: Transmit FHIR R4 Bundle JSON
    Ingest ->> Pydantic: Validate Bundle Structure & Schema Types
    
    alt Validation Successful
        Pydantic -->> Spine: Validated FHIR Object Graph
        Spine ->> Spine: Resolve Patient ID & Hospital Admission Spine
        Spine ->> RelDB: INSERT into CLINICAL_OBSERVATIONS & PATIENT_360_HEADER
        Spine ->> VectorDB: Generate bge-large-en Embeddings for Note Chunks
    else Validation Exception / Schema Mismatch
        Pydantic -->> DLQ: Route Payload to Encrypted Quarantine
        DLQ ->> DLQ: Store Payload Hash & Log Audit Event
    end
```

---

## 3. Flowchart 1: Fallback Logic & Insufficient Context Refusal

Ensures Hospyar explicitly declines to answer when retrieved evidence is absent, preventing hallucinations [6, 7]:

```mermaid
flowchart TD
    A[Incoming User Query] --> B{Tri-Fold Hybrid Retrieval}
    B --> C[Retrieve Context Chunks]
    C --> D{Context Buffer Null or Confidence < Threshold?}
    
    D -->|Yes - Insufficient Context| E[Trigger Graceful Refusal Pipeline]
    E --> F[Generate System Decline Message: 'Retrieved evidence is insufficient to answer reliably.']
    F --> G[Suggest Related Covered Topics / Offer Search Expansion]
    
    D -->|No - Grounded Context Available| H[Construct Prompt with Strict Grounding Directive]
    H --> I[Execute LLM Inference]
    I --> J[Verify Every Assertion against Source Pointers]
    J --> K[Attach Verbatim Citation Anchors]
    K --> L[Deliver Final Cited Response]
```

---
*Grounded in HybridRAG and Grounded Q&A Citation Engineering Protocols [2, 6, 7, 8, 11].*
