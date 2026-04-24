import os
import logging
from dotenv import load_dotenv

# Load .env file
load_dotenv()

logger = logging.getLogger(__name__)

# Single source of truth for configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day
ALLOWED_DOMAIN = "shnoor.com"

def mask_secret(secret: str) -> str:
    if not secret: return "None"
    if len(secret) <= 10: return "***"
    return f"{secret[:5]}...{secret[-5:]}"

def validate_config():
    """Validates that all required configuration is present."""
    missing = []
    if not GOOGLE_CLIENT_ID: missing.append("GOOGLE_CLIENT_ID")
    if not GOOGLE_CLIENT_SECRET: missing.append("GOOGLE_CLIENT_SECRET")
    
    if missing:
        error_msg = f"CRITICAL CONFIG ERROR: Missing environment variables: {', '.join(missing)}"
        logger.error(error_msg)
        raise RuntimeError(error_msg)
    
    logger.info("Configuration validated successfully.")
    logger.info(f"Using Client ID: {mask_secret(GOOGLE_CLIENT_ID)}")
    logger.info(f"Using Redirect URI: {GOOGLE_REDIRECT_URI}")
