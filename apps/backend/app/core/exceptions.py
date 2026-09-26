class HospyarBaseException(Exception):
    """Base domain exception for Hospyar system"""
    def __init__(self, message: str, code: str = "HOSPYAR_ERR"):
        self.message = message
        self.code = code
        super().__init__(self.message)

class FHIRValidationError(HospyarBaseException):
    """Raised when an incoming FHIR payload violates HL7 FHIR R4 schema rules"""
    def __init__(self, message: str, payload_id: str = ""):
        super().__init__(message, code="FHIR_SCHEMA_VALIDATION_ERROR")
        self.payload_id = payload_id

class CitationMismatchError(HospyarBaseException):
    """Raised when an AI generated citation anchor does not verifiably exist in source documents"""
    def __init__(self, anchor_id: str, source_ref: str):
        super().__init__(f"Citation anchor {anchor_id} could not be resolved at {source_ref}", code="CITATION_ANCHOR_UNVERIFIED")

class UnauthorizedRoleAccessError(HospyarBaseException):
    """Raised when an RBAC policy prevents a role from accessing clinical or financial data"""
    def __init__(self, role: str, resource: str):
        super().__init__(f"Role {role} is forbidden from accessing resource {resource}", code="RBAC_CLEARANCE_DENIED")

class DLQQuarantineError(HospyarBaseException):
    """Raised when a corrupted payload is quarantined to the Dead-Letter Queue"""
    def __init__(self, sha256_hash: str):
        super().__init__(f"Payload quarantined to DLQ with SHA-256 hash: {sha256_hash}", code="PAYLOAD_QUARANTINED")
