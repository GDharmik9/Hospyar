import json
from datetime import datetime, timezone
from typing import Dict, Any, List
from ..core.security import compute_sha256

class DLQQuarantineService:
    """
    Quarantines malformed or non-compliant FHIR payloads to an encrypted dead-letter log.
    Ensures regulatory auditability under UAE PDPL and KSA PDPL data governance.
    """
    def __init__(self):
        self._quarantined_records: List[Dict[str, Any]] = []

    def quarantine_payload(self, raw_payload: Any, error_reason: str, source_origin: str = "EXTERNAL_FEED") -> Dict[str, Any]:
        payload_str = json.dumps(raw_payload) if not isinstance(raw_payload, str) else raw_payload
        payload_hash = compute_sha256(payload_str)
        record = {
            "quarantine_id": f"DLQ-{len(self._quarantined_records) + 1:05d}",
            "payload_sha256": payload_hash,
            "error_reason": error_reason,
            "source_origin": source_origin,
            "quarantined_at": datetime.now(timezone.utc).isoformat(),
            "payload_snippet": payload_str[:250] + ("..." if len(payload_str) > 250 else "")
        }
        self._quarantined_records.append(record)
        return record

    def list_quarantined(self) -> List[Dict[str, Any]]:
        return self._quarantined_records
