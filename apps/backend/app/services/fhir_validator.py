from typing import Dict, Any, Tuple
from ..core.exceptions import FHIRValidationError

class FHIRValidatorService:
    """
    Validates incoming HL7 FHIR R4 bundles and resources against structural schema rules.
    Compliant resources proceed to the Patient 360 domain spine; corrupted payloads
    are diverted to the Dead-Letter Queue (DLQ).
    """
    REQUIRED_RESOURCE_FIELDS = {
        "Patient": ["id", "identifier", "gender"],
        "Observation": ["id", "status", "code", "subject"],
        "Condition": ["id", "clinicalStatus", "code", "subject"],
        "Encounter": ["id", "status", "class", "subject"],
        "Claim": ["id", "status", "type", "patient", "provider", "item"]
    }

    def validate_resource(self, resource: Dict[str, Any]) -> Tuple[bool, str]:
        resource_type = resource.get("resourceType")
        if not resource_type:
            return False, "Missing 'resourceType' root attribute"

        if resource_type not in self.REQUIRED_RESOURCE_FIELDS:
            if not resource.get("id"):
                return False, f"Resource {resource_type} lacks primary 'id'"
            return True, "Valid"

        required_keys = self.REQUIRED_RESOURCE_FIELDS[resource_type]
        for key in required_keys:
            if key not in resource:
                return False, f"Missing required FHIR attribute: '{key}' for resourceType '{resource_type}'"

        return True, "Valid"

    def normalize_patient_bundle(self, bundle: Dict[str, Any]) -> Dict[str, Any]:
        if bundle.get("resourceType") != "Bundle":
            valid, msg = self.validate_resource(bundle)
            if not valid:
                raise FHIRValidationError(msg, payload_id=bundle.get("id", "UNKNOWN"))
            return bundle

        entries = bundle.get("entry", [])
        for entry in entries:
            res = entry.get("resource", {})
            if res.get("resourceType") == "Patient":
                valid, msg = self.validate_resource(res)
                if not valid:
                    raise FHIRValidationError(msg, payload_id=res.get("id", "UNKNOWN"))
                return res
        raise FHIRValidationError("No Patient resource found in Bundle entry", payload_id=bundle.get("id", "BUNDLE"))
