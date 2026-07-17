from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
# Make sure your main app file exposes your initialized supabase client
from main import supabase 

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

# Pydantic schemas for payload validation
class AuthSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(credentials: AuthSchema):
    try:
        # Registers user directly into Supabase's auth.users system
        response = supabase.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password
        })
        if not response.user:
            raise HTTPException(status_code=400, detail="Signup failed.")
        return {"message": "Account forged successfully!", "user_id": response.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(credentials: AuthSchema):
    try:
        # Authenticates email/password against Supabase auth database
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        if not response.session:
            raise HTTPException(status_code=401, detail="Authentication failed.")
        
        # Returns the JWT access token back to your frontend localStorage
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password.")