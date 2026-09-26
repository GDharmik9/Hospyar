import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from .security import compute_sha256, compute_hmac_signature

class AuditLogger:
    """
    Cryptographic Append-Only Audit Logger.
    Logs every clinical query, retrieved text span, AI answer, and citation verification
    with SHA-256 hash chains and HMAC signatures for GCC regulatory inspections (DHA, HAAD, SFDA).
    """
    def __init__(self):
        self._audit_chain: List[Dict[str, Any]] = []
        self._last_block_hash: str = "GENESIS_HOSPYAR_SOVEREIGN_LOG"

    def record_access_event(
        self,
        user_role: str,
        user_id: str,
        action: str,
        patient_id: str,
        query: str,
        citation_ids: List[str],
        execution_time_ms: float
    ) -> Dict[str, Any]:
        timestamp = datetime.now(timezone.utc).isoformat()
        event_payload = {
            "index": len(self._audit_chain) + 1,
            "timestamp": timestamp,
            "user_role": user_role,
            "user_id": user_id,
            "action": action,
            "patient_id": patient_id,
            "query_snippet": query[:100],
            "citation_ids": citation_ids,
            "execution_time_ms": execution_time_ms,
            "previous_hash": self._last_block_hash
        }

        serialized = json.dumps(event_payload, sort_keys=True)
        block_hash = compute_sha256(serialized)
        signature = compute_hmac_signature(block_hash)

        audit_entry = {
            **event_payload,
            "block_hash": block_hash,
            "hmac_signature": signature
        }

        self._audit_chain.append(audit_entry)
        self._last_block_hash = block_hash
        return audit_entry

    def get_recent_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self._audit_chain[-limit:]

audit_logger = AuditLogger()
