import os
from dotenv import load_dotenv
from supabase import create_client, Client

# load_dotenv() reads the .env file and makes those values available
# to our Python code via os.getenv() below. Without this line, .env
# would just sit there unused.
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY")

# create_client builds one reusable connection object we can import
# anywhere else in our backend to talk to Supabase (query tables,
# check auth, etc.)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)