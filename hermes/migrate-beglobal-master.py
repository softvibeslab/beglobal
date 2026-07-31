#!/usr/bin/env python3
"""Migra el bot Master de beglobal-pro al orquestador con rollback."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path


SOURCE_PROFILE = "beglobal-pro"
TARGET_PROFILE = "beglobal-orchestrator"
SOURCE_HOME = Path("/root/.hermes/profiles") / SOURCE_PROFILE
TARGET_HOME = Path("/root/.hermes/profiles") / TARGET_PROFILE
SOURCE_UNIT = f"hermes-gateway-{SOURCE_PROFILE}.service"
TARGET_UNIT = f"hermes-gateway-{TARGET_PROFILE}.service"
TARGET_WRAPPER = Path("/root/.local/bin") / TARGET_PROFILE
REGISTRY = Path("/srv/beglobal/config/beglobal-profile-registry.json")
BACKUP_ROOT = Path("/srv/beglobal/backups")
TELEGRAM_KEYS = (
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_ALLOWED_USERS",
    "TELEGRAM_HOME_CHANNEL",
    "TELEGRAM_HOME_CHANNEL_THREAD_ID",
    "TELEGRAM_PROXY",
)


def run(
    *args: str,
    check: bool = True,
    input_text: str | None = None,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        check=check,
        text=True,
        input=input_text,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )


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


def bot_identity(token: str) -> dict[str, object]:
    payload: dict[str, object] | None = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(
                f"https://api.telegram.org/bot{token}/getMe", timeout=15
            ) as response:
                payload = json.load(response)
            break
        except urllib.error.HTTPError as exc:
            if exc.code != 429 or attempt == 2:
                raise
            retry_after = 10
            try:
                error_payload = json.loads(exc.read().decode("utf-8"))
                retry_after = int(
                    error_payload.get("parameters", {}).get("retry_after", retry_after)
                )
            except (ValueError, TypeError, json.JSONDecodeError):
                pass
            wait_seconds = min(max(retry_after, 1), 30)
            print(
                f"Telegram pidió esperar {wait_seconds}s antes de revalidar el bot."
            )
            time.sleep(wait_seconds)
    if payload is None:
        raise RuntimeError("Telegram no devolvió identidad para el bot Master.")
    if not payload.get("ok"):
        raise RuntimeError("Telegram rechazó el token del Master.")
    result = payload["result"]
    return {
        "id": result.get("id"),
        "username": result.get("username"),
        "name": result.get("first_name"),
    }


def write_target_env(values: dict[str, str]) -> None:
    current_lines = (
        TARGET_HOME.joinpath(".env").read_text(encoding="utf-8").splitlines()
        if TARGET_HOME.joinpath(".env").exists()
        else []
    )
    retained = [
        line
        for line in current_lines
        if not (
            line.strip()
            and not line.lstrip().startswith("#")
            and "=" in line
            and line.split("=", 1)[0].strip() in TELEGRAM_KEYS
        )
    ]
    if retained and retained[-1] != "":
        retained.append("")
    for key in TELEGRAM_KEYS:
        if values.get(key):
            retained.append(f"{key}={values[key]}")
    retained.append("")

    fd, temporary_name = tempfile.mkstemp(prefix=".env.", dir=TARGET_HOME)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write("\n".join(retained))
        temporary.chmod(0o600)
        temporary.replace(TARGET_HOME / ".env")
    finally:
        temporary.unlink(missing_ok=True)
    (TARGET_HOME / ".env").chmod(0o600)


def backup_state() -> tuple[Path, bool]:
    stamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    backup_dir = BACKUP_ROOT / f"master-to-orchestrator-{stamp}"
    backup_dir.mkdir(parents=True, mode=0o700)
    shutil.copy2(SOURCE_HOME / ".env", backup_dir / "beglobal-pro.env")
    (backup_dir / "beglobal-pro.env").chmod(0o600)

    target_existed = TARGET_HOME.joinpath(".env").exists()
    if target_existed:
        shutil.copy2(TARGET_HOME / ".env", backup_dir / "orchestrator.env")
        (backup_dir / "orchestrator.env").chmod(0o600)

    source_unit_path = Path("/root/.config/systemd/user") / SOURCE_UNIT
    if source_unit_path.exists():
        shutil.copy2(source_unit_path, backup_dir / SOURCE_UNIT)
        (backup_dir / SOURCE_UNIT).chmod(0o600)
    return backup_dir, target_existed


def restore_target_env(backup_dir: Path, target_existed: bool) -> None:
    backup = backup_dir / "orchestrator.env"
    if target_existed and backup.exists():
        shutil.copy2(backup, TARGET_HOME / ".env")
        (TARGET_HOME / ".env").chmod(0o600)
    elif not target_existed:
        (TARGET_HOME / ".env").unlink(missing_ok=True)


def wait_active(unit: str, timeout: int = 25) -> bool:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        status = run("systemctl", "--user", "is-active", unit, check=False)
        if status.returncode == 0 and status.stdout.strip() == "active":
            return True
        time.sleep(1)
    return False


def update_registry(bot: dict[str, object]) -> None:
    if not REGISTRY.exists():
        return
    payload = json.loads(REGISTRY.read_text(encoding="utf-8"))
    for profile in payload.get("profiles", []):
        if profile.get("id") != "orchestrator":
            continue
        telegram = profile.setdefault("telegram", {})
        telegram["status"] = "running"
        telegram["bot"] = bot

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
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Aplicar la migración; sin esta opción solo muestra el plan.",
    )
    args = parser.parse_args()

    if os.geteuid() != 0:
        raise RuntimeError("Ejecutar como root.")
    if not SOURCE_HOME.joinpath(".env").exists():
        raise RuntimeError("No existe el .env del perfil origen.")
    if not TARGET_HOME.exists() or not TARGET_WRAPPER.exists():
        raise RuntimeError("El perfil orquestador no está instalado.")

    source_values = parse_env(SOURCE_HOME / ".env")
    token = source_values.get("TELEGRAM_BOT_TOKEN", "")
    if not token:
        raise RuntimeError("El perfil origen no tiene token de Telegram.")
    identity = bot_identity(token)
    print(
        f"Bot validado: @{identity.get('username')} "
        f"(ID {identity.get('id')})"
    )
    print(f"Origen: {SOURCE_PROFILE}")
    print(f"Destino: {TARGET_PROFILE}")
    print("Se copiarán únicamente variables TELEGRAM_* permitidas.")
    print("El origen se conservará respaldado para rollback.")
    if not args.apply:
        print("Dry run correcto. Usa --apply para ejecutar.")
        return 0

    backup_dir, target_existed = backup_state()
    print(f"Respaldo: {backup_dir}")
    write_target_env(source_values)

    try:
        run("systemctl", "--user", "stop", SOURCE_UNIT)
        run(
            str(TARGET_WRAPPER),
            "gateway",
            "install",
            "--force",
            input_text="n\ny\n",
        )
        run("systemctl", "--user", "enable", "--now", TARGET_UNIT)
        if not wait_active(TARGET_UNIT):
            raise RuntimeError("El gateway orquestador no quedó activo.")

        state = run(
            "systemctl",
            "--user",
            "show",
            TARGET_UNIT,
            "-p",
            "MainPID",
            "-p",
            "ActiveState",
            "-p",
            "SubState",
        ).stdout
        if "ActiveState=active" not in state or "SubState=running" not in state:
            raise RuntimeError("Systemd no confirmó el gateway orquestador.")

        run("systemctl", "--user", "disable", SOURCE_UNIT)
        update_registry(identity)
        print(f"Gateway activo: {TARGET_UNIT}")
        print(f"Gateway anterior detenido y deshabilitado: {SOURCE_UNIT}")
        return 0
    except Exception:
        run("systemctl", "--user", "disable", "--now", TARGET_UNIT, check=False)
        restore_target_env(backup_dir, target_existed)
        run("systemctl", "--user", "enable", "--now", SOURCE_UNIT, check=False)
        print("Rollback aplicado: el gateway anterior fue restaurado.", file=sys.stderr)
        raise


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)
