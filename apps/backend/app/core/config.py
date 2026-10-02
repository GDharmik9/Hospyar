import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "Hospyar Sovereign AI Copilot")
    VERSION: str = os.getenv("VERSION", "1.0.0-PROD")
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Sovereign Cloud & GCC Compliance
    SOVEREIGN_REGION: str = os.getenv("SOVEREIGN_REGION", "UAE-CENTRAL-1")
    REGULATORY_REGIME: str = os.getenv("REGULATORY_REGIME", "UAE_PDPL_LAW_45")
    
    # Snowflake CoCo CLI & Governed Perimeter
    SNOWFLAKE_ACCOUNT: str = os.getenv("SNOWFLAKE_ACCOUNT", "HOSPYAR_GCC_PROD")
    SNOWFLAKE_DATABASE: str = os.getenv("SNOWFLAKE_DATABASE", "HOSPYAR_PATIENT360_DB")
    SNOWFLAKE_SCHEMA: str = os.getenv("SNOWFLAKE_SCHEMA", "PUBLIC")
    SNOWFLAKE_WAREHOUSE: str = os.getenv("SNOWFLAKE_WAREHOUSE", "HOSPYAR_CLINICAL_WH")
    SNOWFLAKE_ROLE: str = os.getenv("SNOWFLAKE_ROLE", "HOSPYAR_CLINICAL_ROLE")
    
    # Cortex AI LLM
    CORTEX_MODEL: str = os.getenv("CORTEX_MODEL", "llama3.3-70b")
    
    # Security & Audit
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "hospyar-sovereign-secret-2026-uae-ksa")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    AUDIT_SALT: str = os.getenv("AUDIT_SALT", "hospyar-sha256-audit-salt")

settings = Settings()
