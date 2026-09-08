#!/usr/bin/env python3
"""Validate portable public-assistant assets without dependencies or network."""
import json
import re
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    docs = root / "docs/beglobalasistente"
    profile = root / "hermes/beglobalasistente"
    names = (
        "README.md", "BASE_CONOCIMIENTO_VAPI.txt", "FIRST_MESSAGE.txt",
        "SYSTEM_PROMPT_VAPI.txt", "CONFIGURAR_VAPI.md", "catalogo-comercial.json",
        "FUENTES.md", "PRUEBAS.md", "ACTUALIZAR_VPS.md", "TAREA_HERMES_VPS.md",
    )
    files = [docs / name for name in names]
    files += [profile / name for name in ("SOUL.md", "PROFILE.md", "PERMISSIONS.md")]
    errors = []
    for file in files:
        if not file.is_file() or not file.read_text(encoding="utf-8").strip():
            errors.append(f"Missing or empty: {file.relative_to(root)}")
            continue
        content = file.read_text(encoding="utf-8")
        for pattern in (r"/Users/[^\s]+", r"https?://[^\s]+\.m3u8", r"sk-[A-Za-z0-9_-]{20,}", r"gh[pousr]_[A-Za-z0-9]{20,}"):
            if re.search(pattern, content):
                errors.append(f"Possible private material: {file.relative_to(root)}")
        if file.suffix == ".md":
            for target in re.findall(r"\]\(([^)]+)\)", content):
                if "://" not in target and not target.startswith("#"):
                    if not (file.parent / target.split("#")[0]).exists():
                        errors.append(f"Broken link in {file.name}: {target}")
    try:
        catalog = json.loads((docs / "catalogo-comercial.json").read_text(encoding="utf-8"))
        for collection, required in (("plans", "required_plan_fields"), ("webinars", "required_webinar_fields")):
            for item in catalog[collection]:
                missing = [key for key in catalog[required] if key not in item or item[key] is None or item[key] == ""]
                if missing:
                    errors.append(f"Incomplete {collection} item: {', '.join(missing)}")
        if catalog["membership_url"] != "https://www.beglobalpro.org/membresias":
            errors.append("Unexpected membership destination")
    except (OSError, ValueError, KeyError, TypeError):
        errors.append("Invalid commercial catalog")
    prompt_path = docs / "SYSTEM_PROMPT_VAPI.txt"
    if prompt_path.is_file() and "consultar_conocimiento_beglobal" not in prompt_path.read_text(encoding="utf-8"):
        errors.append("Missing knowledge tool name in Vapi prompt")
    if errors:
        print("\n".join(errors))
        return 1
    print(f"OK: {len(files)} assets, UTF-8, local links, catalog structure and basic private-material scan.")
    print("This validates files only; no live agent, commercial facts or VPS deployment were tested.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
