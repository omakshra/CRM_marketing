from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./winback_crm.db"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"


settings = Settings()
