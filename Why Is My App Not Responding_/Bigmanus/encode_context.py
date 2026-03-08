import json
import os
import gzip
from typing import Dict, Tuple, Callable

# Optional image embedding (PNG text chunks). Guarded import.
try:
    from PIL import Image
    from PIL.PngImagePlugin import PngInfo
    _PIL_AVAILABLE = True
except Exception:
    _PIL_AVAILABLE = False

from io import BytesIO

# Paths (adjust if needed)
TEMP_DIR = os.path.join(os.path.expanduser("~"), "AppData", "Local", "Temp")
SOURCE_FILENAME = "t2csmjpi..py"
FALLBACK_SOURCE_FILENAME = "tmpDFF8.tmp.py"
SOURCE_PATH = os.path.join(TEMP_DIR, SOURCE_FILENAME)
FALLBACK_SOURCE_PATH = os.path.join(TEMP_DIR, FALLBACK_SOURCE_FILENAME)

# Repo-local fallback (current working directory)
REPO_SOURCE_PATH = os.path.join(os.getcwd(), "tmpDFF8.tmp.py")

# Allow override via environment variable
ENV_SOURCE_PATH = os.environ.get("CONTEXT_SOURCE_PATH")

OUTPUT_DIR = os.path.join("Whisper_Deck")
MASTER_OUTPUT = os.path.join(OUTPUT_DIR, "Context_MasterInjection.base64")
PNG_OUTPUT = os.path.join(OUTPUT_DIR, "Context_MasterInjection.png")

# Default placeholders to demonstrate replacement; extend as needed
DEFAULT_PLACEHOLDERS: Dict[str, str] = {
    "${USER_NAME}": "Charles Kendrick",
    "${USER_LOCATION}": "Maricopa, AZ",
}

# Toggle gzip before Base64 (smaller payload when JSON is large)
ENABLE_GZIP = True

# Choose smallest envelope automatically among strategies
AUTO_SELECT_SMALLEST = True

# Image payload selection: 'auto' | 'json' | 'envelope'
IMAGE_EMBED_MODE = "auto"


def ensure_output_dir():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)


def resolve_source_path() -> str:
    # Env override first
    if ENV_SOURCE_PATH and os.path.exists(ENV_SOURCE_PATH):
        return ENV_SOURCE_PATH
    # Repo-local file next
    if os.path.exists(REPO_SOURCE_PATH):
        return REPO_SOURCE_PATH
    # Preferred source in Temp
    if os.path.exists(SOURCE_PATH):
        return SOURCE_PATH
    # Fallback temp file seen in context
    if os.path.exists(FALLBACK_SOURCE_PATH):
        return FALLBACK_SOURCE_PATH
    raise FileNotFoundError(
        (
            "No source file found. Checked: "
            f"{REPO_SOURCE_PATH}, {SOURCE_PATH} and {FALLBACK_SOURCE_PATH}. "
            "Set CONTEXT_SOURCE_PATH to an existing file path to override."
        )
    )


def read_source_text(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def extract_json_text(raw: str, src_path: str) -> str:
    """
    Extract the root JSON object from a mixed file by matching braces.
    Handles strings and escapes to avoid counting braces inside strings.
    """
    start = raw.find("{")
    if start == -1:
        preview = raw[:200].replace("\n", " ")
        raise ValueError(
            f"Unable to locate opening brace in source text from '{src_path}'. "
            f"First 200 chars: '{preview}'"
        )

    depth = 0
    in_string = False
    escape = False
    end = None

    for i in range(start, len(raw)):