from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import supabase, SUPABASE_URL
from routers import documents


# This creates the actual web application object.
# Think of "app" as the whole backend server we're building.
app = FastAPI(title="Wispy API")

# CORS = Cross-Origin Resource Sharing.
# Browsers block a website from calling a backend on a *different* address
# unless the backend explicitly allows it. Our frontend runs on
# localhost:5173, our backend on localhost:8000 - different addresses -
# so without this, the browser would refuse to let them talk to each other.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # our Vite frontend's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(documents.router)

# The @app.get("/") line is a "decorator" - it tells FastAPI:
# "when someone visits the root URL with a GET request, run this function"
@app.get("/")
def read_root():
    return {"message": "Wispy backend is running 🐾"}

@app.get("/test-db")
def test_db():
    # This just asks Supabase "what auth settings does this project have"
    # - a lightweight call that proves the URL + key are valid,
    # without needing any tables to exist yet.
    try:
        response = supabase.auth.get_session()
        return {"status": "connected", "supabase_url": SUPABASE_URL}
    except Exception as e:
        return {"status": "error", "detail": str(e)}