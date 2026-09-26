import hashlib
import hmac
from .config import settings

def compute_sha256(data: str) -> str:
    """Compute SHA-256 hash for audit logs and DLQ quarantine verification"""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()

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
