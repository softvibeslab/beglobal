#!/usr/bin/env python3
"""Configura Telegram por perfil Be Global sin imprimir ni reutilizar tokens."""

from __future__ import annotations

import getpass
import json
import os
import re
import shutil
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path


MASTER_ENV = Path("/root/.hermes/profiles/beglobal-pro/.env")
REGISTRY = Path("/srv/beglobal/config/beglobal-profile-registry.json")
PROFILES = (
    ("corporate", "beglobal-corporate", "Corporate"),
    ("team", "beglobal-team", "Team"),
    ("member", "beglobal-member", "Member"),
)
TELEGRAM_KEYS = (
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_ALLOWED_USERS",
    "TELEGRAM_HOME_CHANNEL",
)
SAFE_ENV_VALUE = re.compile(r"^[A-Za-z0-9_@,.:/+=-]+$")


def parse_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key.strip()] = value
    return values


def validate_bot(token: str) -> dict[str, object]:
    url = f"https://api.telegram.org/bot{token}/getMe"
    try:
        with urllib.request.urlopen(url, timeout=15) as response:
            payload = json.load(response)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise ValueError(f"Telegram no pudo validar el token: {exc}") from exc
    if not payload.get("ok") or not isinstance(payload.get("result"), dict):
        raise ValueError("Telegram rechazó el token.")
    result = payload["result"]
    return {
        "id": result.get("id"),
        "username": result.get("username"),
        "name": result.get("first_name"),
    }


def prompt_value(label: str, default: str) -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    value = value or default
    if not value:
        raise ValueError(f"Falta {label}.")
    if "\n" in value or "\r" in value or not SAFE_ENV_VALUE.fullmatch(value):
        raise ValueError(f"{label} contiene caracteres no permitidos.")
    return value


def replace_env_values(path: Path, replacements: dict[str, str]) -> Path | None:
    existing_lines = (
        path.read_text(encoding="utf-8").splitlines() if path.exists() else []
    )
    retained: list[str] = []
    replaced = set()
    for line in existing_lines:
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and "=" in stripped:
            key = stripped.split("=", 1)[0].strip()
            if key in replacements:
                retained.append(f"{key}={replacements[key]}")
                replaced.add(key)
                continue
        retained.append(line)
    if retained and retained[-1] != "":
        retained.append("")
    for key in TELEGRAM_KEYS:
        if key not in replaced:
            retained.append(f"{key}={replacements[key]}")
    retained.append("")

    backup: Path | None = None
    if path.exists() and path.stat().st_size:
        stamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
        backup = path.with_name(f".env.bak-{stamp}")
        shutil.copy2(path, backup)
        backup.chmod(0o600)

    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary_name = tempfile.mkstemp(prefix=".env.", dir=path.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write("\n".join(retained))
        temporary.chmod(0o600)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    path.chmod(0o600)
    return backup


def update_registry(configured: dict[str, dict[str, object]]) -> None:
    if not REGISTRY.exists():
        return
    payload = json.loads(REGISTRY.read_text(encoding="utf-8"))
    for profile in payload.get("profiles", []):
        profile_id = profile.get("id")
        if profile_id not in configured:
            continue
        telegram = profile.setdefault("telegram", {})
        telegram["status"] = "configured_not_started"
        telegram["bot"] = configured[profile_id]["bot"]
        telegram["allowed_users_configured"] = True
        telegram["home_channel_configured"] = True

    fd, temporary_name = tempfile.mkstemp(prefix=".registry.", dir=REGISTRY.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
        temporary.chmod(0o600)
        temporary.replace(REGISTRY)
    finally:
        temporary.unlink(missing_ok=True)
    REGISTRY.chmod(0o600)


def main() -> int:
    if os.geteuid() != 0:
        print("Ejecuta este configurador como root.", file=sys.stderr)
        return 1

    master_values = parse_env(MASTER_ENV)
    master_token = master_values.get("TELEGRAM_BOT_TOKEN", "")
    master_bot = validate_bot(master_token) if master_token else {}
    default_allowed = master_values.get("TELEGRAM_ALLOWED_USERS", "")
    default_home = master_values.get("TELEGRAM_HOME_CHANNEL", "")

    print("Configuración segura de Telegram — Be Global")
    if master_bot:
        print(
            "Master conservado: "
            f"@{master_bot.get('username')} (ID {master_bot.get('id')})"
        )
    print("Los tokens no se mostrarán ni se guardarán en el historial.")

    configured: dict[str, dict[str, object]] = {}
    seen_bot_ids = {master_bot.get("id")} if master_bot else set()

    for profile_id, hermes_profile, display_name in PROFILES:
        print(f"\n{display_name} ({hermes_profile})")
        token = getpass.getpass("Token de BotFather: ").strip()
        if not token:
            raise ValueError(f"Falta el token de {display_name}.")
        bot = validate_bot(token)
        bot_id = bot.get("id")
        if bot_id in seen_bot_ids:
            raise ValueError(
                f"@{bot.get('username')} ya está asignado a otro perfil."
            )
        seen_bot_ids.add(bot_id)
        print(f"Validado: @{bot.get('username')} — {bot.get('name')}")

        allowed_users = prompt_value(
            "IDs de usuarios permitidos, separados por coma", default_allowed
        )
        home_channel = prompt_value(
            "ID del chat o canal principal", default_home or allowed_users.split(",")[0]
        )
        configured[profile_id] = {
            "hermes_profile": hermes_profile,
            "bot": bot,
            "token": token,
            "allowed_users": allowed_users,
            "home_channel": home_channel,
        }

    print("\nResumen validado:")
    for profile_id, _, display_name in PROFILES:
        bot = configured[profile_id]["bot"]
        print(f"- {display_name}: @{bot.get('username')} (ID {bot.get('id')})")
    confirmation = input("Escribe ACTIVAR para guardar la configuración: ").strip()
    if confirmation != "ACTIVAR":
        print("Cancelado. No se escribió ningún token.")
        return 2

    for profile_id, hermes_profile, _ in PROFILES:
        entry = configured[profile_id]
        env_path = Path("/root/.hermes/profiles") / hermes_profile / ".env"
        replace_env_values(
            env_path,
            {
                "TELEGRAM_BOT_TOKEN": str(entry["token"]),
                "TELEGRAM_ALLOWED_USERS": str(entry["allowed_users"]),
                "TELEGRAM_HOME_CHANNEL": str(entry["home_channel"]),
            },
        )
        entry.pop("token", None)

    update_registry(configured)
    print("\nConfiguración guardada con permisos 0600.")
    print("Los gateways siguen detenidos hasta ejecutar las pruebas de seguridad.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (KeyboardInterrupt, EOFError):
        print("\nCancelado. No se completó la configuración.", file=sys.stderr)
        raise SystemExit(130)
    except ValueError as exc:
        print(f"\nError: {exc}", file=sys.stderr)
        raise SystemExit(1)
