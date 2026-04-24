import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from core.config import validate_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Validate configuration on startup
try:
    validate_config()
except RuntimeError as e:
    logger.critical(f"Server failed to start: {e}")
    # In a real production app we might exit, but here we'll just log
    # exit(1) 

from core.database import init_db
from routers import meeting, signaling, calendar, auth, notifications

# Initialize Database
init_db()

app = FastAPI(
    title="Shnoor Meetings Backend",
    description="Backend Signaling & Chat server for Shnoor Meetings (WebRTC)",
    version="1.0.0"
)

# CORS configuration
from core.config import FRONTEND_URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meeting.router)
app.include_router(signaling.router)
app.include_router(calendar.router)
app.include_router(auth.router)
app.include_router(notifications.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Shnoor Meetings API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
