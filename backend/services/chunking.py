def chunk_text(text: str, chunk_size: int = 1500, overlap: int = 200):
    """
    Splits a long string into overlapping chunks.
    chunk_size and overlap are measured in characters here (~4 chars per token).
    Returns a list of chunk strings.
    """
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        # Move forward by (chunk_size - overlap) instead of chunk_size,
        # so the next chunk repeats the last "overlap" characters -
        # this is what prevents cutting a sentence's meaning in half.
        start += chunk_size - overlap

    return chunks