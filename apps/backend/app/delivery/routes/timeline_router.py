from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..dto.models import TimelineEventDTO
from ..dependencies.auth import get_current_user
from ..dependencies.db import get_snowflake_client
from ...services.snowflake_client import SnowflakeClientService
from ...use_cases.temporal_aligner import TemporalAlignerUseCase

router = APIRouter(prefix="/api/v1/timeline", tags=["Longitudinal Temporal Timeline"])

_aligner = TemporalAlignerUseCase()

@router.get("/{patient_id}", response_model=List[TimelineEventDTO])
def get_patient_timeline(
    patient_id: str,
    user: dict = Depends(get_current_user),
    db: SnowflakeClientService = Depends(get_snowflake_client)
):
    patient = db.get_patient_header(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )

    admission_date = patient.get("admission_date", "2026-09-24T08:30:00Z")
    return _aligner.align_patient_timeline(patient_id, admission_date)
