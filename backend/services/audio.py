import re

from google.genai import types

from services.gemini_client import client as genai_client


def transcribe_audio(audio_bytes: bytes, mime_type: str) -> str:
    """
    Sends an audio file directly to Gemini and asks it to return a
    transcript broken into timestamped segments. Gemini can "listen" to
    audio natively - no separate transcription service (like Whisper)
    is needed, which is why this project stays $0.
    """
    prompt = (
        "Transcribe this audio lecture. Break the transcript into short "
        "segments of roughly 20-40 seconds of speech each. Before every "
        "segment, on its own line, write its start time in this exact "
        "format: [MM:SS]. Then write the spoken text for that segment. "
        "Do not add any commentary, only the timestamps and transcript."
    )

    response = genai_client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=[
            types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
            prompt,
        ],
    )
    return response.text


def parse_timestamped_transcript(raw_text: str):
    """
    Turns Gemini's "[MM:SS]\ntext" formatted transcript into a list of
    (timestamp, text) tuples, e.g. [("00:00", "Welcome to..."), ...].

    Falls back to treating the whole thing as one untimed segment if no
    [MM:SS] markers were found, so a weirdly-formatted response doesn't
    crash the upload.
    """
    pattern = r"\[(\d{1,2}:\d{2})\]"
    parts = re.split(pattern, raw_text)
    # re.split with a capturing group returns alternating
    # [text_before_first_match, match1, text1, match2, text2, ...]
    # so real (timestamp, text) pairs start at index 1.
    segments = []
    for i in range(1, len(parts), 2):
        timestamp = parts[i].strip()
        text = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if text:
            segments.append((timestamp, text))

    if not segments:
        segments = [("00:00", raw_text.strip())]

    return segments
