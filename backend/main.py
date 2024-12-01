from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
import uvicorn
import json
from pathlib import Path

# Load shared config
config_path = Path(__file__).parent.parent / 'config.json'
if not config_path.exists():
    raise FileNotFoundError(f"Config file not found at {config_path}")

with open(config_path) as f:
    try:
        config = json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"Error parsing config.json: {e}")

class Settings(BaseSettings):
    backend_host: str = "localhost"
    backend_port: int = config['ports']['backend']
    frontend_url: str = f"http://localhost:{config['ports']['frontend']}"
    database_url: str = "sqlite:///./speech_processor.db"

settings = Settings()
app = FastAPI(title="Speech Processor API")

print(f"Starting server with settings:")
print(f"Host: {settings.backend_host}")
print(f"Port: {settings.backend_port}")
print(f"Frontend URL: {settings.frontend_url}")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "port": settings.backend_port,
        "frontend_url": settings.frontend_url,
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True
    )