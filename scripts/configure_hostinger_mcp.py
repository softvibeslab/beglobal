#!/usr/bin/env python3
"""
configure_hostinger_mcp.py — v2
Solicita el token de API de Hostinger de forma segura (getpass o --token)
y lo configura en todos los perfiles beglobal-* disponibles.

Usa pyyaml para parsear/serializar config.yaml correctamente.
"""

import argparse
import os
import stat
import subprocess
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("❌ Requiere pyyaml: pip install pyyaml")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def profiles_base() -> Path:
    """Base de perfiles globales: /root/.hermes/profiles/"""
    return Path("/root/.hermes/profiles")


def per_profile_dir(profile: str) -> Path:
    """Ruta base de la carpeta de un perfil (global)."""
    return profiles_base() / profile


def list_beglobal_profiles() -> list[str]:
    """Devuelve los nombres de perfiles que empiezan con beglobal-."""
    base = profiles_base()
    if not base.is_dir():
        return []
    return sorted(
        entry.name
        for entry in base.iterdir()
        if entry.is_dir() and entry.name.startswith("beglobal-")
    )


def read_env(profile: str) -> dict[str, str]:
    env_file = per_profile_dir(profile) / ".env"
    data: dict[str, str] = {}
    if env_file.is_file():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, value = line.split("=", 1)
                data[key.strip()] = value.strip()
    return data


def write_env(profile: str, data: dict[str, str]) -> None:
    env_file = per_profile_dir(profile) / ".env"
    env_file.parent.mkdir(parents=True, exist_ok=True)
    content = "\n".join(f"{k}={v}" for k, v in data.items()) + "\n"
    env_file.write_text(content, encoding="utf-8")
    env_file.chmod(0o600)


def read_config_yaml(profile: str) -> dict[str, Any]:
    """Lee config.yaml del perfil y retorna el dict completo."""
    config_path = per_profile_dir(profile) / "config.yaml"
    if not config_path.is_file():
        return {}
    text = config_path.read_text(encoding="utf-8")
    data = yaml.safe_load(text)
    if not isinstance(data, dict):
        return {}
    return data


def write_config_yaml(profile: str, data: dict[str, Any]) -> None:
    """Escribe config.yaml del perfil desde un dict."""
    config_path = per_profile_dir(profile) / "config.yaml"
    config_path.parent.mkdir(parents=True, exist_ok=True)
    content = yaml.safe_dump(
        data,
        default_flow_style=False,
        sort_keys=False,
        allow_unicode=True,
        width=120,
    )
    config_path.write_text(content, encoding="utf-8")


def build_hostinger_config() -> dict[str, dict[str, Any]]:
    """Retorna los 5 servidores MCP de Hostinger con estructura correcta."""
    base_args = ["--package=hostinger-api-mcp@latest"]
    servers = {
        "hostinger-hosting": "hostinger-hosting-mcp",
        "hostinger-domains": "hostinger-domains-mcp",
        "hostinger-dns": "hostinger-dns-mcp",
        "hostinger-billing": "hostinger-billing-mcp",
        "hostinger-reach": "hostinger-reach-mcp",
    }
    config: dict[str, dict[str, Any]] = {}
    for name, entry_point in servers.items():
        config[name] = {
            "command": "npx",
            "args": base_args + [entry_point],
            "env": {"HOSTINGER_API_KEY": "${HOSTINGER_API_KEY}"},
            "timeout": 120,
            "connect_timeout": 60,
        }
    return config


def merge_mcp_into_config(
    profile: str, hostinger_config: dict[str, dict[str, Any]]
) -> dict[str, Any]:
    """Mergea los servidores Hostinger en config.yaml existente.

    Retorna dict con:
      - changed: bool
      - content: str (el YAML completo si changed)
    """
    data = read_config_yaml(profile)
    mcp_servers = data.get("mcp_servers", {})
    if not isinstance(mcp_servers, dict):
        mcp_servers = {}
        data["mcp_servers"] = mcp_servers

    changed = False
    # Merge: agregar servidores que no existen
    for name, cfg in hostinger_config.items():
        if name not in mcp_servers:
            mcp_servers[name] = cfg
            changed = True
        else:
            # Si existe pero no tiene la estructura esperada, actualizar
            existing = mcp_servers[name]
            if not isinstance(existing, dict) or "command" not in existing:
                mcp_servers[name] = cfg
                changed = True

    result: dict[str, Any] = {"changed": changed}
    if changed:
        data["mcp_servers"] = mcp_servers
        write_config_yaml(profile, data)
        result["content"] = yaml.safe_dump(
            data, default_flow_style=False, sort_keys=False, allow_unicode=True, width=120
        )
    return result


def set_env_var(profile: str, key: str, value: str) -> bool:
    """Establece una variable en .env si el valor cambia. Retorna True si modificó."""
    data = read_env(profile)
    if key in data and data[key] == value:
        return False
    data[key] = value
    write_env(profile, data)
    return True


def apply_to_profile(profile: str, api_key: str, dry_run: bool = False) -> dict[str, Any]:
    """Aplica la configuración a un perfil. Retorna resumen."""
    result: dict[str, Any] = {
        "profile": profile,
        "env_set": False,
        "env_was_set": False,
        "config_changed": False,
        "config_exists_before": False,
        "errors": [],
    }

    # 1. Guardar token en .env
    try:
        was_set = set_env_var(profile, "HOSTINGER_API_KEY", api_key)
        result["env_set"] = was_set
        result["env_was_set"] = was_set
    except Exception as e:
        result["errors"].append(f"env: {e}")

    # 2. Actualizar config.yaml con MCP servers
    try:
        config_path = per_profile_dir(profile) / "config.yaml"
        result["config_exists_before"] = config_path.is_file()
        hostinger_config = build_hostinger_config()
        merged = merge_mcp_into_config(profile, hostinger_config)
        if merged.get("changed"):
            result["config_changed"] = True
    except Exception as e:
        result["errors"].append(f"config: {e}")

    return result


def restart_gateway(profile: str) -> bool:
    """Reiniciar gateway del perfil si está corriendo. Retorna True si hizo algo."""
    try:
        proc = subprocess.run(
            ["hermes", "profile", "show", profile],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if proc.returncode != 0 or "running" not in proc.stdout.lower():
            return False
    except Exception:
        return False

    try:
        subprocess.run(
            ["hermes", "-p", profile, "gateway", "restart"],
            capture_output=True,
            text=True,
            timeout=60,
        )
        return True
    except Exception:
        return False


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Configura los servidores MCP de Hostinger en perfiles beglobal-*.",
    )
    parser.add_argument("--apply", action="store_true",
                        help="Aplicar sin preguntar perfiles (usa todos los beglobal-*)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Mostrar qué se haría sin modificar archivos ni reiniciar gateways")
    parser.add_argument("--profiles", nargs="+",
                        help="Perfiles específicos a configurar (por defecto: todos los beglobal-*)")
    parser.add_argument("--no-restart", action="store_true",
                        help="No reiniciar gateways luego de configurar")
    parser.add_argument("--token", default=None,
                        help="Token de API de Hostinger (alternativa a getpass interactivo)")
    args = parser.parse_args()

    if args.profiles:
        profiles = sorted(args.profiles)
    else:
        profiles = list_beglobal_profiles()

    if not profiles:
        print("❌ No se encontraron perfiles beglobal-* en /root/.hermes/profiles/")
        sys.exit(1)

    if args.dry_run:
        print("🔍 MODO DRY-RUN — nada se modificará.")
        print()

    print(f"📦 Perfiles a configurar ({len(profiles)}):")
    for p in profiles:
        print(f"   • {p}")
    print()

    if not args.dry_run:
        import getpass
        token = None
        if args.token:
            token = args.token
        else:
            token = getpass.getpass("🔑 Token de API de Hostinger: ")
        if not token.strip():
            print("❌ Token vacío. Abortando.")
            sys.exit(1)
        if len(token) < 8:
            print("⚠️  El token parece muy corto, continúa de todas formas.")
    else:
        token = "<TOKEN_NO_PROVIDIDO_EN_DRY_RUN>"

    print("=" * 60)

    results: list[dict[str, Any]] = []
    for profile in profiles:
        r = apply_to_profile(profile, token, dry_run=args.dry_run)
        results.append(r)

        status_parts = [f"[{profile}]"]
        if args.dry_run:
            status_parts.append("🔍 dry-run")
        if r["env_set"]:
            status_parts.append("✅ token actualizado en .env")
        elif not r["env_was_set"] and not r["errors"]:
            status_parts.append("ℹ️  token ya existía en .env")
        if r["config_changed"]:
            status_parts.append("✅ config.yaml actualizado (mcp_servers)")
        if r["errors"]:
            for e in r["errors"]:
                status_parts.append(f"❌ error: {e}")
        print(" ".join(status_parts))

    print()
    print("=" * 60)
    print("Resumen:")
    print(f"  Perfiles procesados : {len(profiles)}")
    print(f"  .env modificados    : {sum(1 for r in results if r['env_set'])}")
    print(f"  config.yaml modificados: {sum(1 for r in results if r['config_changed'])}")
    errors_total = sum(len(r["errors"]) for r in results)
    print(f"  Errores            : {errors_total}")
    print()

    if not args.dry_run:
        if not args.no_restart:
            print("🔄 Reiniciando gateways...")
            for r in results:
                profile = r["profile"]
                ok = restart_gateway(profile)
                if ok:
                    print(f"   ✅ {profile} gateway reiniciado")
                else:
                    print(f"   ℹ️  {profile} gateway no estaba corriendo o no se pudo reiniciar")
            print()

        print("🔍 Verificando descubrimiento de herramientas MCP...")
        for r in results:
            profile = r["profile"]
            try:
                proc = subprocess.run(
                    ["hermes", "-p", profile, "mcp", "list"],
                    capture_output=True,
                    text=True,
                    timeout=30,
                )
                if proc.returncode == 0:
                    lines = [l for l in proc.stdout.splitlines() if l.strip()]
                    print(f"   {profile}: {len(lines)} servidores/configuraciones MCP")
                    for l in lines[:10]:
                        print(f"      {l}")
                    if len(lines) > 10:
                        print(f"      ... y {len(lines)-10} más")
                else:
                    print(f"   {profile}: no se pudo listar — gateway puede estar detenido")
            except Exception as e:
                print(f"   {profile}: error al verificar — {e}")
        print()

    if args.dry_run:
        print("ℹ️  Ejecuta sin --dry-run para aplicar los cambios reales.")

    if errors_total > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
