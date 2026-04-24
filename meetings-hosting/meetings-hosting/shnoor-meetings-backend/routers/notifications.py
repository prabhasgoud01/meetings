from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

# SMTP Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", ""),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@shnoor.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME="Shnoor Meetings",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

class InviteRequest(BaseModel):
    email: EmailStr
    meeting_link: str

@router.post("/send-invite")
async def send_invite(request: InviteRequest, background_tasks: BackgroundTasks):
    # Check if SMTP is configured
    if not conf.MAIL_USERNAME or not conf.MAIL_PASSWORD:
        # For development, we'll just log it
        print(f"DEBUG: Email invitation would be sent to {request.email} with link {request.meeting_link}")
        return {"message": "Email invitation simulated (SMTP not configured)"}

    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
                <h2 style="color: #2563eb;">Shnoor Meeting Invitation</h2>
                <p>Hello,</p>
                <p>You have been invited to join a video meeting on Shnoor Meetings.</p>
                <div style="margin: 30px 0; text-align: center;">
                    <a href="{request.meeting_link}" 
                       style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Join Meeting
                    </a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #666; font-size: 14px;">{request.meeting_link}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">
                    This is an automated message from Shnoor International LLC.
                </p>
            </div>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Shnoor Meeting Invitation",
        recipients=[request.email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_mail, message)
    
    return {"message": "Invitation sent successfully"}
