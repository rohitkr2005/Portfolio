import sys
import os

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.knowledge import ROHIT_PROFILE_DATA

app = FastAPI(title="Rohit Portfolio Profile API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.api_route("/", methods=["GET", "OPTIONS"])
@app.api_route("/profile", methods=["GET", "OPTIONS"])
@app.api_route("/api/profile", methods=["GET", "OPTIONS"])
async def profile():
    return JSONResponse(content=ROHIT_PROFILE_DATA)

handler = app
__all__ = ["app", "handler"]
