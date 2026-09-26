from fastapi import APIRouter, Depends, Query
from ..dto.models import ClaimAuditDTO
from ..dependencies.auth import get_current_user
from ...use_cases.claims_scrubber import ClaimsScrubberUseCase

router = APIRouter(prefix="/api/v1/claims", tags=["Claims Audit & NPHIES Scrubber"])

_scrubber = ClaimsScrubberUseCase()

@router.get("/audit", response_model=ClaimAuditDTO)
def audit_claim(
    claim_id: str = Query(default="CLM-90214"),
    patient_id: str = Query(default="PAT-78921"),
    user: dict = Depends(get_current_user)
):
    return _scrubber.scrub_claim(claim_id, patient_id)

@router.post("/scrub", response_model=ClaimAuditDTO)
def scrub_claim_payload(
    claim_id: str,
    patient_id: str,
    user: dict = Depends(get_current_user)
):
    return _scrubber.scrub_claim(claim_id, patient_id)
