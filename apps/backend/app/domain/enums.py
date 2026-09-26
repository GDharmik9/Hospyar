from enum import Enum

class RouteEnum(str, Enum):
    VECTOR_RAG = "VectorRAG"
    GRAPH_RAG = "GraphRAG"
    TEXT_2_SQL = "Text2SQL"

class UserRole(str, Enum):
    CLINICIAN = "CLINICIAN"
    CLAIMS_AUDITOR = "CLAIMS_AUDITOR"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"
    RESEARCHER = "RESEARCHER"

class CitationPointerType(str, Enum):
    FHIR_POINTER = "FHIR_POINTER"
    SQL_KEY = "SQL_KEY"
    TEXT_SPAN = "TEXT_SPAN"
    ONTOLOGY_NODE = "ONTOLOGY_NODE"

class HIESystem(str, Enum):
    NPHIES = "NPHIES"
    MALAFFI = "MALAFFI"
    NABIDH = "NABIDH"
    RIAYATI = "RIAYATI"

class ClaimStatus(str, Enum):
    AUTHORIZED = "AUTHORIZED"
    PENDING_REVIEW = "PENDING_REVIEW"
    REJECTED_DISCREPANCY = "REJECTED_DISCREPANCY"
    MISSING_EVIDENCE = "MISSING_EVIDENCE"

class SeverityLevel(str, Enum):
    NORMAL = "NORMAL"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"
