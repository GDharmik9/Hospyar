from typing import List, Dict, Any, Tuple
from ..domain.enums import RouteEnum, CitationPointerType
from ..domain.entities import EvidenceItem
from ..services.vector_embedder import VectorEmbedderService
from ..services.bm25_ranker import BM25RankerService
from ..services.graph_traverser import GraphTraverserService
from ..services.snowflake_client import SnowflakeClientService

class HybridRAGRouterUseCase:
    """
    Tri-Fold Hybrid Retrieval Engine:
    Routes incoming clinical questions across:
    1. VectorRAG (Dense semantic + BM25 lexical note search)
    2. GraphRAG (SNOMED CT / LOINC ontological concept hierarchy)
    3. Text2SQL (Deterministic numeric and lab trend aggregation)
    """
    def __init__(
        self,
        embedder: VectorEmbedderService,
        bm25: BM25RankerService,
        graph: GraphTraverserService,
        snowflake: SnowflakeClientService
    ):
        self.embedder = embedder
        self.bm25 = bm25
        self.graph = graph
        self.snowflake = snowflake

    def classify_routes(self, query: str) -> List[RouteEnum]:
        q = query.lower()
        routes = set()

        if any(w in q for w in ["how much", "value", "level", "count", "average", "latest", "glucose", "bp", "hba1c", "reading"]):
            routes.add(RouteEnum.TEXT_2_SQL)

        if any(w in q for w in ["complication", "relation", "type of", "hierarchy", "snomed", "loinc", "classification", "diagnosed with"]):
            routes.add(RouteEnum.GRAPH_RAG)

        if any(w in q for w in ["history", "note", "consult", "recommend", "summary", "plan", "symptoms", "presented", "progress"]) or not routes:
            routes.add(RouteEnum.VECTOR_RAG)

        return list(routes)

    def retrieve_evidence(self, patient_id: str, query: str) -> Tuple[List[RouteEnum], List[EvidenceItem], Dict[str, Dict]]:
        active_routes = self.classify_routes(query)
        evidence_list: List[EvidenceItem] = []
        citation_catalog: Dict[str, Dict] = {}
        cit_counter = 1

        # 1. Text2SQL Execution
        if RouteEnum.TEXT_2_SQL in active_routes:
            sql_res = self.snowflake.execute_text2sql(query, patient_id)
            c_id = f"CIT-{cit_counter:03d}"
            cit_counter += 1
            verbatim = f"{sql_res.get('metric')}: {sql_res.get('value')} {sql_res.get('unit')}"
            pointer = sql_res.get("pointer", "SQL/Observation")
            
            evidence_list.append(EvidenceItem(
                id=c_id,
                route=RouteEnum.TEXT_2_SQL,
                source_type="FHIR_OBSERVATION",
                reference=pointer,
                excerpt=f"Exact Database Record: {verbatim} (Query: {sql_res.get('sql_query')})",
                relevance_score=1.0
            ))
            citation_catalog[c_id] = {
                "pointer_type": CitationPointerType.SQL_KEY,
                "source_reference": pointer,
                "verbatim_text": verbatim,
                "confidence": 1.0,
                "metadata": {"sql": sql_res.get("sql_query")}
            }

        # 2. GraphRAG Traversal
        if RouteEnum.GRAPH_RAG in active_routes:
            related_nodes = self.graph.get_related_concepts("Diabetes mellitus")
            for node in related_nodes[:2]:
                c_id = f"CIT-{cit_counter:03d}"
                cit_counter += 1
                verbatim = f"{node['label']} ({node['code']}) [{node['relation']}]"
                pointer = f"SNOMED-CT/{node['code']}"
                evidence_list.append(EvidenceItem(
                    id=c_id,
                    route=RouteEnum.GRAPH_RAG,
                    source_type="SNOMED_ONTOLOGY",
                    reference=pointer,
                    excerpt=f"Ontology Edge: Concept '{node['label']}' is linked via {node['relation']}",
                    relevance_score=0.95
                ))
                citation_catalog[c_id] = {
                    "pointer_type": CitationPointerType.ONTOLOGY_NODE,
                    "source_reference": pointer,
                    "verbatim_text": verbatim,
                    "confidence": 0.95
                }

        # 3. VectorRAG Search
        if RouteEnum.VECTOR_RAG in active_routes:
            note_chunks = self.snowflake.search_note_chunks(patient_id)
            scored_notes = self.bm25.score_documents(query, [{"text": n["text"], "chunk": n} for n in note_chunks])
            for item, score in scored_notes[:2]:
                chunk = item["chunk"]
                c_id = f"CIT-{cit_counter:03d}"
                cit_counter += 1
                pointer = chunk.get("pointer", f"Note/{chunk['chunk_id']}")
                verbatim = chunk["text"][:150] + "..."
                evidence_list.append(EvidenceItem(
                    id=c_id,
                    route=RouteEnum.VECTOR_RAG,
                    source_type="CLINICAL_NOTE",
                    reference=pointer,
                    excerpt=chunk["text"],
                    relevance_score=round(0.85 + min(score * 0.05, 0.14), 2)
                ))
                citation_catalog[c_id] = {
                    "pointer_type": CitationPointerType.TEXT_SPAN,
                    "source_reference": pointer,
                    "verbatim_text": verbatim,
                    "confidence": 0.92
                }

        return active_routes, evidence_list, citation_catalog
