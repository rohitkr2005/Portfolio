import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"🍎 Starting Rohit Kumar Mandal's macOS Desktop Portfolio on http://localhost:{port}")
    print("Press Ctrl+C to stop.")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
