from fastapi import Header, HTTPException, status
from ...domain.enums import UserRole

def get_current_user(
    x_user_role: str = Header(default="CLINICIAN", alias="X-User-Role"),
    x_user_id: str = Header(default="USR-DOC-9021", alias="X-User-Id")
) -> dict:
    try:
        role_enum = UserRole(x_user_role.upper())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Invalid or unrecognized Hospyar user role: {x_user_role}"
        )

    return {
        "user_id": x_user_id,
        "role": role_enum,
        "sovereign_clearance": True
    }
