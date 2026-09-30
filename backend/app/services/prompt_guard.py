import re

from app.core.constants import MIN_PROMPT_LENGTH

WORD_PATTERN = re.compile(r"[^\W\d_]+")

FILLER_WORDS = frozenset(
    {
        "help",
        "hi",
        "hey",
        "hello",
        "yo",
        "test",
        "testing",
        "ok",
        "okay",
        "thanks",
        "thx",
        "please",
        "asdf",
        "hola",
        "ayuda",
        "bonjour",
        "salut",
        "aide",
        "hallo",
        "hilfe",
    }
)


def needs_clarification(prompt: str) -> bool:
    """True when the prompt is too thin to justify a downstream AI call."""
    text = prompt.strip()
    if len(text) < MIN_PROMPT_LENGTH:
        return True
    words = WORD_PATTERN.findall(text.lower())
    return not words or all(word in FILLER_WORDS for word in words)
