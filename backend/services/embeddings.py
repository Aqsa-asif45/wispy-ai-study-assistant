from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str):
    """
    Turns a string into a list of 384 numbers (its embedding).
    384 matches the `vector(384)` column type we created in Supabase -
    these two numbers must always match or storage will fail.
    """
    embedding = model.encode(text)
    return embedding.tolist()  # convert from numpy array to a plain Python list