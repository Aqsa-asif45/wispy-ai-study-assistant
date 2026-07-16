import os
from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks)

    prompt = f"""You are a helpful study assistant. Answer the student's question
using ONLY the context below. If the answer isn't in the context, say
"I don't know based on the provided material" - do not make things up.

Context:
{context}

Question: {question}

Answer:"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=prompt
        )
        return response.text
    except errors.ClientError as e:
        # 429 = rate limit hit (too many requests). Catching this specific
        # case means the app tells the user something sensible instead of
        # crashing with a raw 500 error.
        if e.status_code == 429:
            return "Wispy is a bit overloaded right now (hit the free API limit) - please try again in a minute!"
        raise