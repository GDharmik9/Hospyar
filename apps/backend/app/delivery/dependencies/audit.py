from ...core.logging import AuditLogger, audit_logger

def get_audit_logger() -> AuditLogger:
    return audit_logger
