import os
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from app.knowledge import ROHIT_PROFILE_DATA
from app.ai_service import stream_ai_response

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Rohit Kumar Mandal - macOS Portfolio & Ask AI",
    description="macOS Sequoia Desktop Portfolio with real-time streaming AI Assistant",
    version="1.0.0"
)

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None
    apiKey: Optional[str] = None
    model: Optional[str] = None
    streaming: Optional[bool] = True


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "owner": "Rohit Kumar Mandal",
        "system": "macOS Sequoia Portfolio AI",
        "openrouter_configured": bool(os.getenv("OPENROUTER_API_KEY"))
    }


@app.get("/api/profile")
async def get_profile():
    """Return complete structured profile data for the frontend."""
    return JSONResponse(content=ROHIT_PROFILE_DATA)


@app.post("/api/chat")
async def chat_endpoint(payload: ChatRequest):
    """
    Real-time streaming AI endpoint.
    Uses SSE (text/event-stream) and streaming=true.
    """
    return StreamingResponse(
        stream_ai_response(
            query=payload.message,
            history=payload.history,
            api_key=payload.apiKey,
            model=payload.model,
            streaming=payload.streaming if payload.streaming is not None else True
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# Mount public/static assets directory
public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

mount_dir = public_dir if os.path.exists(public_dir) else static_dir
if os.path.exists(mount_dir):
    app.mount("/", StaticFiles(directory=mount_dir, html=True), name="static")
