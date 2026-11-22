import sys
import os

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Rohit Portfolio Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.api_route("/", methods=["GET", "OPTIONS"])
@app.api_route("/health", methods=["GET", "OPTIONS"])
@app.api_route("/api/health", methods=["GET", "OPTIONS"])
async def health():
    return {
        "status": "healthy",
        "owner": "Rohit Kumar Mandal",
        "system": "macOS Sequoia Portfolio AI",
        "openrouter_configured": bool(os.getenv("OPENROUTER_API_KEY"))
    }

handler = app
__all__ = ["app", "handler"]
