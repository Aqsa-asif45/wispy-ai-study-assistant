import os
from dotenv import load_dotenv
from supabase import create_client, Client

from google import genai

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
# Using the SECRET key here, not the publishable one - our FastAPI
# backend is a trusted server, so it's allowed to bypass Row Level
# Security for legitimate operations like this upload endpoint.
# This key must NEVER be sent to a browser/frontend - backend only.
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY was not found in environment variables!")

genai_client = genai.Client(api_key=api_key)