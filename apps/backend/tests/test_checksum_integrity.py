import pytest
from app.core.security import (
    compute_sha256,
    compute_sha256_checksum,
    compute_payload_checksum,
    verify_checksum,
    generate_record_integrity_header,
    compute_hmac_signature
)

def test_compute_sha256_checksum():
    data = "Hospyar Sovereign Healthcare Patient 360"
    checksum1 = compute_sha256_checksum(data)
    checksum2 = compute_sha256_checksum(data.encode("utf-8"))
    
    assert len(checksum1) == 64
    assert checksum1 == checksum2
    assert checksum1 == compute_sha256(data)

def test_canonical_payload_checksum():
    # Key order must not affect the computed checksum
    payload_a = {"patient_id": "PAT-001", "vital": "Glucose", "value": 142}
    payload_b = {"value": 142, "vital": "Glucose", "patient_id": "PAT-001"}
    
    hash_a = compute_payload_checksum(payload_a)
    hash_b = compute_payload_checksum(payload_b)
    
    assert hash_a == hash_b
    assert len(hash_a) == 64

def test_verify_checksum_success_and_tamper_detection():
    data = "Observation/obs-89104#valueQuantity"
    valid_checksum = compute_sha256_checksum(data)
    
    assert verify_checksum(data, valid_checksum) is True
    
    # Tampered content must fail
    tampered_data = "Observation/obs-89104#valueQuantityTampered"
    assert verify_checksum(tampered_data, valid_checksum) is False
    assert verify_checksum(data, "0000000000000000000000000000000000000000000000000000000000000000") is False

def test_generate_record_integrity_header():
    payload = {"encounter_id": "ENC-100", "diagnosis": "Hypertension"}
    header = generate_record_integrity_header("REC-999", payload)
    
    assert header["record_id"] == "REC-999"
    assert header["algorithm"] == "SHA-256"
    assert len(header["checksum"]) == 64
    assert len(header["hmac_signature"]) == 64
    assert header["sovereign_boundary"] == "UAE-CENTRAL-1"
