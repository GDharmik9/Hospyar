from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from ..dto.models import HIESyncStatusDTO
from ...domain.enums import HIESystem
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/api/v1/hie", tags=["Regional HIE Interoperability"])

@router.get("/status", response_model=List[HIESyncStatusDTO])
def get_hie_status(user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    return [
        HIESyncStatusDTO(
            system=HIESystem.MALAFFI,
            country="AE",
            connection_status="HEALTHY",
            last_sync_timestamp=now,
            records_synchronized=142901,
            compliance_regime="UAE_PDPL_LAW_45",
            latency_ms=18.4
        ),
        HIESyncStatusDTO(
            system=HIESystem.NABIDH,
            country="AE",
            connection_status="HEALTHY",
            last_sync_timestamp=now,
            records_synchronized=89410,
            compliance_regime="UAE_PDPL_LAW_45",
            latency_ms=21.2
        ),
        HIESyncStatusDTO(
            system=HIESystem.NPHIES,
            country="SA",
            connection_status="HEALTHY",
            last_sync_timestamp=now,
            records_synchronized=318900,
            compliance_regime="KSA_PDPL",
            latency_ms=24.5
        ),
        HIESyncStatusDTO(
            system=HIESystem.RIAYATI,
            country="AE",
            connection_status="HEALTHY",
            last_sync_timestamp=now,
            records_synchronized=67200,
            compliance_regime="UAE_PDPL_LAW_45",
            latency_ms=19.8
        )
    ]
