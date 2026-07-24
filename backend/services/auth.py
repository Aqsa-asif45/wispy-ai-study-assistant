from fastapi import Header, HTTPException

from db import supabase


async def get_current_user(authorization: str = Header(None)):
    """
    Reads the "Authorization: Bearer <token>" header the frontend sends,
    and asks Supabase to check whether that token belongs to a real,
    logged-in user.

    Any endpoint that adds `current_user = Depends(get_current_user)`
    as a parameter becomes a *protected* route - FastAPI runs this
    function first, and if it raises an error, the endpoint's own code
    never even runs.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header. Include 'Authorization: Bearer <token>'.",
        )

    token = authorization.split(" ", 1)[1]

    try:
        user_response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    return user_response.user
