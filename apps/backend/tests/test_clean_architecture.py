from app.core.config import settings
from app.core.security import compute_sha256, mask_national_id
from app.core.logging import audit_logger
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

def test_core_and_domain():
    assert RouteEnum.VECTOR_RAG.value == "VectorRAG"
    assert UserRole.CLINICIAN.value == "CLINICIAN"
    h = compute_sha256("test")
    assert len(h) == 64
    assert mask_national_id("784-1985-3928172-1").startswith("784-****")
    assert settings.SOVEREIGN_REGION == "UAE-CENTRAL-1"

def test_services():
    embedder = VectorEmbedderService(dimension=64)
    v1 = embedder.generate_embedding("glucose high")
    v2 = embedder.generate_embedding("glucose elevated")
    sim = embedder.cosine_similarity(v1, v2)
    assert 0.0 <= sim <= 1.0

    bm25 = BM25RankerService()
    docs = [{"text": "Patient has severe diabetes and high sugar."}, {"text": "Patient has fracture."}]
    scored = bm25.score_documents("diabetes sugar", docs)
    assert scored[0][0]["text"].startswith("Patient has severe")

    graph = GraphTraverserService()
    related = graph.get_related_concepts("Diabetes mellitus")
    assert len(related) > 0

    citation_parser = CitationParserService()
    anchors = citation_parser.extract_anchor_ids("Fasting glucose high [CIT-001]. Note says [CIT-002].")
    assert "CIT-001" in anchors
    assert "CIT-002" in anchors

def test_use_cases():
    embedder = VectorEmbedderService()
    bm25 = BM25RankerService()
    graph = GraphTraverserService()
    snowflake = SnowflakeClientService()
    parser = CitationParserService()

    router = HybridRAGRouterUseCase(embedder, bm25, graph, snowflake)
    routes, evidence, catalog = router.retrieve_evidence("PAT-78921", "What is the fasting blood glucose?")
    assert RouteEnum.TEXT_2_SQL in routes
    assert len(evidence) > 0

    cortex = CortexOrchestratorUseCase(parser)
    response = cortex.generate_grounded_answer("PAT-78921", "What is the blood glucose?", catalog, routes, evidence)
    assert len(response["citations"]) > 0
    assert "CIT-" in response["generated_answer"]

    aligner = TemporalAlignerUseCase()
    timeline = aligner.align_patient_timeline("PAT-78921", "2026-09-24T08:30:00Z")
    assert len(timeline) == 4

    scrubber = ClaimsScrubberUseCase()
    claim = scrubber.scrub_claim("CLM-90214", "PAT-78921")
    assert claim["status"] == "AUTHORIZED"

    log = audit_logger.record_access_event("CLINICIAN", "DOC-1", "TEST", "PAT-78921", "query", ["CIT-001"], 12.5)
    assert log["block_hash"] is not None
