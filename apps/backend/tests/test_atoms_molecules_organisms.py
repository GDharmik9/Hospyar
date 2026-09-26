from app.core.config import settings
from app.core.security import compute_sha256, mask_national_id
from app.domain.enums import RouteEnum, UserRole, CitationPointerType
from app.services.vector_embedder import VectorEmbedderService
from app.services.bm25_ranker import BM25RankerService
from app.services.graph_traverser import GraphTraverserService
from app.services.citation_parser import CitationParserService
from app.services.snowflake_client import SnowflakeClientService
from app.use_cases.hybrid_rag_router import HybridRAGRouterUseCase
from app.use_cases.cortex_orchestrator import CortexOrchestratorUseCase
from app.use_cases.temporal_aligner import TemporalAlignerUseCase
from app.use_cases.claims_scrubber import ClaimsScrubberUseCase
from app.core.logging import audit_logger

def test_legacy_shim():
    assert RouteEnum.VECTOR_RAG.value == "VectorRAG"
    assert UserRole.CLINICIAN.value == "CLINICIAN"
