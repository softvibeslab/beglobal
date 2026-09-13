"""Synthetic Telegram WebApp initData checks. Not a live bot or Mini App host.

Uses the documented HMAC construction with a fixture token that is never a
production BotFather secret. Callers must still authenticate via this module
before opening a workspace session.
"""
from __future__ import annotations

import hashlib
import hmac
import json
from urllib.parse import parse_qsl, urlencode

# Clearly fake; length/shape only needs to exercise HMAC. Never a live token.
FIXTURE_BOT_TOKEN = "000000:SP002-FIXTURE-NOT-A-REAL-BOT"
FIXTURE_BOT_ID = "000000"
MAX_AGE_SECONDS = 3600
TELEGRAM_TO_PERSONA = {900001: "lucia", 900002: "diego"}


class InitDataError(Exception):
    def __init__(self, code: str):
        self.code = code
        super().__init__(code)


def _secret_key(bot_token: str) -> bytes:
    return hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()


def sign_pairs(pairs: dict[str, str], bot_token: str = FIXTURE_BOT_TOKEN) -> str:
    data_check = "\n".join(f"{key}={pairs[key]}" for key in sorted(pairs) if key != "hash")
    return hmac.new(_secret_key(bot_token), data_check.encode(), hashlib.sha256).hexdigest()


def build_init_data(*, telegram_id: int, auth_date: int, bot_token: str = FIXTURE_BOT_TOKEN,
                    extra: dict[str, str] | None = None) -> str:
    user = json.dumps({"id": telegram_id, "first_name": "Fixture", "username": f"tg{telegram_id}"}, separators=(",", ":"))
    pairs = {"auth_date": str(auth_date), "query_id": "AAEfixture", "user": user}
    if extra:
        pairs.update(extra)
    pairs["hash"] = sign_pairs(pairs, bot_token)
    return urlencode(pairs)


def verify_init_data(init_data: object, *, now: int, bot_token: str = FIXTURE_BOT_TOKEN,
                     seen: set[str] | None = None) -> tuple[int, str]:
    if not isinstance(init_data, str) or not 1 <= len(init_data) <= 2048:
        raise InitDataError("INITDATA_INVALID")
    digest = hashlib.sha256(init_data.encode()).hexdigest()
    if seen is not None and digest in seen:
        raise InitDataError("INITDATA_REPLAY")
    pairs = dict(parse_qsl(init_data, keep_blank_values=True, strict_parsing=False))
    their_hash = pairs.pop("hash", "")
    if not their_hash or any(ord(c) < 32 for c in their_hash):
        raise InitDataError("INITDATA_UNSIGNED")
    expected = sign_pairs(pairs, bot_token)
    try:
        if not hmac.compare_digest(expected, their_hash):
            raise InitDataError("INITDATA_BAD_SIGNATURE")
    except (TypeError, ValueError) as exc:
        raise InitDataError("INITDATA_BAD_SIGNATURE") from exc
    try:
        auth_date = int(pairs.get("auth_date", "0"))
    except (TypeError, ValueError):
        raise InitDataError("INITDATA_STALE")
    if auth_date <= 0 or now - auth_date > MAX_AGE_SECONDS or auth_date > now + 30:
        raise InitDataError("INITDATA_STALE")
    try:
        user = json.loads(pairs.get("user", "{}"))
    except json.JSONDecodeError as exc:
        raise InitDataError("INITDATA_INVALID") from exc
    if not isinstance(user, dict) or type(user.get("id")) is not int:
        raise InitDataError("INITDATA_INVALID")
    persona = TELEGRAM_TO_PERSONA.get(user["id"])
    if persona is None:
        raise InitDataError("MEMBER_LINK_REQUIRED")
    if seen is not None:
        seen.add(digest)
    return user["id"], persona
