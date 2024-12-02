# File: backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from pydantic import BaseModel
import uvicorn
import json
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid

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
    sessions_dir: Path = Path(__file__).parent / "sessions"
    templates_dir: Path = Path(__file__).parent / "templates"

settings = Settings()

# Create required directories
settings.sessions_dir.mkdir(exist_ok=True)
settings.templates_dir.mkdir(exist_ok=True)

class Session(BaseModel):
    id: str
    title: str
    createdAt: str
    lastModified: str
    status: str
    input: List[str]
    suggestions: List[str]
    output: str
    progress: int

class CreateSessionRequest(BaseModel):
    title: str

app = FastAPI(title="Speech Processor API")

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

@app.get("/sessions", response_model=List[Session])
async def list_sessions():
    sessions = []
    for session_file in settings.sessions_dir.glob("*.json"):
        with open(session_file) as f:
            sessions.append(json.load(f))
    return sorted(sessions, key=lambda x: x["createdAt"], reverse=True)

@app.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session_path = settings.sessions_dir / f"{session_id}.json"
    if not session_path.exists():
        raise HTTPException(status_code=404, detail="Session not found")
    
    with open(session_path) as f:
        return json.load(f)

@app.post("/sessions", response_model=Session)
async def create_session(request: CreateSessionRequest):
    # Generate unique session ID
    session_id = f"session-{str(uuid.uuid4())[:8]}"
    
    # Get current timestamp
    current_time = datetime.utcnow().isoformat()
    
    # Create new session object
    new_session = {
        "id": session_id,
        "title": request.title,
        "createdAt": current_time,
        "lastModified": current_time,
        "status": "in_progress",
        "input": [],
        "suggestions": [],
        "output": "",
        "progress": 0
    }
    
    # Save session to file
    session_path = settings.sessions_dir / f"{session_id}.json"
    with open(session_path, "w") as f:
        json.dump(new_session, f, indent=2)
    
    return new_session

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True
    )