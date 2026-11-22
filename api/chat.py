import sys
import os

# Add root directory to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from typing import List, Dict, Optional
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from app.ai_service import stream_ai_response

app = FastAPI(title="Rohit Portfolio Chat API")

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


@app.api_route("/", methods=["GET", "POST", "OPTIONS"])
@app.api_route("/chat", methods=["GET", "POST", "OPTIONS"])
@app.api_route("/api/chat", methods=["GET", "POST", "OPTIONS"])
async def chat_handler(request: Request):
    if request.method == "OPTIONS":
        return JSONResponse(content={"status": "ok"})
    if request.method == "GET":
        return JSONResponse(content={"status": "chat API active", "method": "POST required"})

    try:
        body = await request.json()
        payload = ChatRequest(**body)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid request payload: {str(e)}"})

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

handler = app
__all__ = ["app", "handler"]
