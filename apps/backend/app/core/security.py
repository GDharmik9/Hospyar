import hashlib
import hmac
import json
from typing import Any, Union
from .config import settings

def compute_sha256(data: str) -> str:
    """Compute SHA-256 hash for audit logs and DLQ quarantine verification"""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()

def compute_sha256_checksum(content: Union[str, bytes]) -> str:
    """Compute deterministic SHA-256 checksum for data records and clinical payloads"""
    if isinstance(content, str):
        content = content.encode("utf-8")
    return hashlib.sha256(content).hexdigest()

def compute_payload_checksum(payload: Any) -> str:
    """
    Compute canonical SHA-256 checksum of arbitrary JSON payloads or dicts.
    Uses sorted keys and compact serialization to ensure deterministic hashing.
    """
    canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()

def verify_checksum(content: Union[str, bytes], expected_checksum: str) -> bool:
    """
    Constant-time comparison to verify SHA-256 checksum without timing attacks.
    """
    actual_checksum = compute_sha256_checksum(content)
    return hmac.compare_digest(actual_checksum, expected_checksum)

def generate_record_integrity_header(record_id: str, payload: Any) -> dict:
    """
    Generates sovereign cryptographic integrity metadata for FHIR & clinical records.
    Complies with UAE PDPL Federal Decree-Law No. 45 & Saudi Arabia PDPL audit guidelines.
    """
    checksum = compute_payload_checksum(payload)
    signature = compute_hmac_signature(f"{record_id}:{checksum}")
    return {
        "record_id": record_id,
        "algorithm": "SHA-256",
        "checksum": checksum,
        "hmac_signature": signature,
        "sovereign_boundary": "UAE-CENTRAL-1"
    }

def compute_hmac_signature(message: str) -> str:
    """Generate sovereign HMAC signature for tamper-evident audit records"""
    return hmac.new(
        settings.AUDIT_SALT.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

def mask_national_id(national_id: str) -> str:
    """Mask Emirates ID / Saudi National ID for non-PII display"""
    if len(national_id) < 8:
        return "****"
    return f"{national_id[:3]}-****-****-{national_id[-3:]}"
