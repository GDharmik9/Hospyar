from fastapi import APIRouter, Depends, HTTPException, status
from ..dto.models import Patient360HeaderDTO, VitalObservationDTO, ConditionDTO, RiskProfileDTO
from ..dependencies.auth import get_current_user
from ..dependencies.db import get_snowflake_client
from ...services.snowflake_client import SnowflakeClientService

router = APIRouter(prefix="/api/v1/patient360", tags=["Patient 360 Spine"])

@router.get("/{patient_id}", response_model=Patient360HeaderDTO)
def get_patient_360(
    patient_id: str,
    user: dict = Depends(get_current_user),
    db: SnowflakeClientService = Depends(get_snowflake_client)
):
    patient = db.get_patient_header(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found in sovereign registry."
        )

    vitals_raw = db.get_patient_vitals(patient_id)
    conditions_raw = db.get_patient_conditions(patient_id)

    vitals = [VitalObservationDTO(**v) for v in vitals_raw]
    conditions = [ConditionDTO(**c) for c in conditions_raw]
    risk_score = RiskProfileDTO(**patient["risk_score"])

    return Patient360HeaderDTO(
        patient_id=patient["patient_id"],
        national_id_hash=patient["national_id_hash"],
        full_name=patient["full_name"],
        full_name_ar=patient["full_name_ar"],
        gender=patient["gender"],
        birth_date=patient["birth_date"],
        age=patient["age"],
        blood_type=patient["blood_type"],
        primary_language=patient["primary_language"],
        regional_hie_id=patient["regional_hie_id"],
        insurance_provider=patient["insurance_provider"],
        policy_number=patient["policy_number"],
        active_encounter_id=patient.get("active_encounter_id"),
        admission_date=patient.get("admission_date"),
        vitals=vitals,
        conditions=conditions,
        risk_score=risk_score
    )
