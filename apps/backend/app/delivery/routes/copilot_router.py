from fastapi import APIRouter, Depends
from ..dto.models import QueryRequestDTO, QueryResponseDTO
from ..dependencies.auth import get_current_user
from ..dependencies.db import get_snowflake_client
from ..dependencies.audit import get_audit_logger
from ...services.vector_embedder import VectorEmbedderService
from ...services.bm25_ranker import BM25RankerService
from ...services.graph_traverser import GraphTraverserService
from ...services.citation_parser import CitationParserService
from ...services.snowflake_client import SnowflakeClientService
from ...use_cases.hybrid_rag_router import HybridRAGRouterUseCase
from ...use_cases.cortex_orchestrator import CortexOrchestratorUseCase
from ...core.logging import AuditLogger

router = APIRouter(prefix="/api/v1/copilot", tags=["Deterministic HybridRAG Copilot"])

_embedder = VectorEmbedderService()
_bm25 = BM25RankerService()
_graph = GraphTraverserService()
_citation_parser = CitationParserService()
_cortex = CortexOrchestratorUseCase(_citation_parser)

@router.post("/query", response_model=QueryResponseDTO)
def query_copilot(
    payload: QueryRequestDTO,
    user: dict = Depends(get_current_user),
    db: SnowflakeClientService = Depends(get_snowflake_client),
    audit: AuditLogger = Depends(get_audit_logger)
):
    rag_router = HybridRAGRouterUseCase(_embedder, _bm25, _graph, db)
    
    active_routes, evidence_items, citation_catalog = rag_router.retrieve_evidence(
        patient_id=payload.patient_id,
        query=payload.query_text
    )

    response_dict = _cortex.generate_grounded_answer(
        patient_id=payload.patient_id,
        query=payload.query_text,
        evidence_catalog=citation_catalog,
        active_routes=active_routes,
        evidence_items=evidence_items,
        locale=payload.locale
    )

    # Cryptographic append-only audit event
    audit.record_access_event(
        user_role=user["role"].value,
        user_id=user["user_id"],
        action="HYBRID_RAG_COPILOT_QUERY",
        patient_id=payload.patient_id,
        query=payload.query_text,
        citation_ids=[c.citation_id for c in response_dict["citations"]],
        execution_time_ms=response_dict["execution_time_ms"]
    )

    return QueryResponseDTO(**response_dict)
