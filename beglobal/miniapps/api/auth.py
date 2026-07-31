"""Validación de Telegram WebApp initData por perfil.

Cada perfil (member/team/corporate) tiene su propio bot. El initData que envía
la Mini App se valida con HMAC contra el token del bot de ese perfil y contra
la allowlist de user IDs — el mismo modelo de aislamiento del gateway Hermes.
"""
import hashlib
import hmac
import json
import os
import time
from urllib.parse import parse_qsl

PROFILES = ("member", "team", "corporate")
MAX_AGE_SECONDS = int(os.environ.get("INITDATA_MAX_AGE", "3600"))


class AuthError(Exception):
    pass


def _bot_token(profile: str) -> str:
    token = os.environ.get(f"{profile.upper()}_BOT_TOKEN", "")
    if not token:
        raise AuthError(f"Bot token no configurado para el perfil {profile}")
    return token


def _allowlist(profile: str) -> set[int]:
    raw = os.environ.get(f"{profile.upper()}_ALLOWED_IDS", "")
    return {int(x) for x in raw.replace(" ", "").split(",") if x}


def verify_init_data(profile: str, init_data: str) -> dict:
    """Valida initData y regresa el usuario de Telegram. Lanza AuthError."""
    if profile not in PROFILES:
        raise AuthError("Perfil desconocido")

    if os.environ.get("DEV_BYPASS") == "1":
        # SOLO desarrollo local. Nunca activar en el VPS.
        return {"id": 1, "first_name": "Dev", "username": "dev"}

    if not init_data:
        raise AuthError("initData ausente")

    pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    their_hash = pairs.pop("hash", None)
    if not their_hash:
        raise AuthError("initData sin hash")

    data_check = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
    secret = hmac.new(b"WebAppData", _bot_token(profile).encode(), hashlib.sha256).digest()
    calc = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(calc, their_hash):
        raise AuthError("Firma de initData inválida")

    auth_date = int(pairs.get("auth_date", "0"))
    if auth_date <= 0 or time.time() - auth_date > MAX_AGE_SECONDS:
        raise AuthError("initData expirado; vuelve a abrir la Mini App")

    try:
        user = json.loads(pairs.get("user", "{}"))
    except json.JSONDecodeError:
        raise AuthError("Usuario ilegible en initData")
    if not user.get("id"):
        raise AuthError("initData sin usuario")

    allowed = _allowlist(profile)
    if not allowed or int(user["id"]) not in allowed:
        raise AuthError("Usuario no autorizado para este perfil")

    return user
