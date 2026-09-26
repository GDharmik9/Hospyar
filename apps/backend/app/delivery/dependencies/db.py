from ...services.snowflake_client import SnowflakeClientService, snowflake_service

def get_snowflake_client() -> SnowflakeClientService:
    return snowflake_service
