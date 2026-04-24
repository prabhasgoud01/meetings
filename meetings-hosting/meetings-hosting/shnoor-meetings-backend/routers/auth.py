import httpx
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from core.database import get_db_connection
from core.config import (
    GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET, 
    GOOGLE_REDIRECT_URI, 
    FRONTEND_URL, 
    JWT_SECRET, 
    JWT_ALGORITHM, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ENVIRONMENT,
    mask_secret
)

# Consolidated router
router = APIRouter(tags=["Authentication"])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_user_from_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

@router.get("/google/login")
async def google_login():
    print(f"DEBUG: Triggering Google Login redirect")
    print(f"DEBUG: Using Redirect URI: {GOOGLE_REDIRECT_URI}")
    print(f"DEBUG: Using Client ID: {mask_secret(GOOGLE_CLIENT_ID)}")
    
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID is not configured")
    
    scope = "openid email profile"
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={scope}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    return RedirectResponse(url=google_auth_url)

@router.get("/auth/google/callback")
async def google_callback(code: str, response: Response):
    # 1. Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(token_url, data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        
        if token_resp.status_code != 200:
            print(f"ERROR: Google Token Exchange failed: {token_resp.text}")
            return RedirectResponse(url=f"{FRONTEND_URL}/login?error=Failed to exchange code: {token_resp.status_code}")
            
        tokens = token_resp.json()
        id_token_str = tokens.get("id_token")

        try:
            # 2. Verify ID Token
            id_info = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                GOOGLE_CLIENT_ID
            )

            # 3. Extract user info
            email = id_info.get("email")
            name = id_info.get("name")
            picture = id_info.get("picture")

            # 4. Generate JWT
            user_data = {
                "sub": email,
                "name": name,
                "email": email,
                "picture": picture
            }
            token = create_access_token(user_data)

            # 5. Set HTTP-only Cookie
            redirect = RedirectResponse(url=f"{FRONTEND_URL}/dashboard")
            redirect.set_cookie(
                key="session_token",
                value=token,
                httponly=True,
                max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                samesite="none" if ENVIRONMENT == "production" else "lax",
                secure=True if ENVIRONMENT == "production" else False
            )
            return redirect

        except ValueError as e:
            return RedirectResponse(url=f"{FRONTEND_URL}/login?error=Invalid token: {str(e)}")

@router.post("/api/auth/login")
async def login(data: dict, response: Response):
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    user_data = {
        "sub": email,
        "name": email.split("@")[0].capitalize(),
        "email": email,
        "picture": None
    }
    token = create_access_token(user_data)
    
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none" if ENVIRONMENT == "production" else "lax",
        secure=True if ENVIRONMENT == "production" else False
    )
    return user_data

@router.post("/api/auth/signup")
async def signup(data: dict, response: Response):
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    
    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="Name, email and password required")

    user_data = {
        "sub": email,
        "name": name,
        "email": email,
        "picture": None
    }
    token = create_access_token(user_data)
    
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none" if ENVIRONMENT == "production" else "lax",
        secure=True if ENVIRONMENT == "production" else False
    )
    return user_data

@router.get("/api/auth/me")
async def get_me(request: Request):
    token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user

@router.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("session_token")
    return {"message": "Logged out"}
