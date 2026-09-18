"""Record reproducible local QA, unchanged legacy baseline and known blockers.

No network/service credentials; only subprocesses of the local app, tests and Git.
Generated artifacts are mechanical output, not manual assertions of acceptance.
"""
import ast
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time

HERE = Path(__file__).resolve().parents[1]
ROOT = HERE.parents[1]
OUT = HERE / "qa/latest"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def source_inventory():
    candidates = [HERE / "workspace.py", HERE / "telegram_initdata.py", HERE / "test_workspace.py", HERE / "test_telegram.py", HERE / "test_link.py", HERE / "test_session.py", HERE / "test_unlink.py", HERE / "playwright.config.cjs", HERE / "package.json", HERE / "package-lock.json", HERE / "requirements.txt", HERE / "requirements.lock.txt"]
    candidates += list((HERE / "static").glob("*"))
    candidates += list((HERE / "tests").glob("*.cjs"))
    candidates += list((HERE / "tools").glob("*.py")) + list((HERE / "tools").glob("*.cjs"))
    candidates += [ROOT / "beglobal/membership-bridge/bridge.py", ROOT / "SPECS/contracts/openapi.json", ROOT / "SPECS/contracts/ui-card.schema.json"]
    return {str(p.relative_to(ROOT)): digest(p.read_bytes()) for p in sorted(candidates) if p.is_file()}


def command(label, args, cwd):
    start = time.monotonic()
    result = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=180)
    filename = f"{label}.txt"
    (OUT / filename).write_text(result.stdout + result.stderr)
    return {"command": args, "cwd": str(cwd), "exit_code": result.returncode, "seconds": round(time.monotonic() - start, 3), "output": filename, "result": "PASS" if result.returncode == 0 else "FAIL"}


def legacy_baseline():
    relative = "beglobal/miniapps/api/main.py"
    local = (ROOT / relative).read_bytes()
    tracked = subprocess.run(["git", "show", f"HEAD:{relative}"], cwd=ROOT, capture_output=True, check=True).stdout
    revision = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    seen, duplicates = set(), []
    for node in ast.walk(ast.parse(local)):
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        for dec in node.decorator_list:
            if isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute) and isinstance(dec.func.value, ast.Name) and dec.func.value.id == "app" and dec.func.attr in {"get", "post", "put", "patch", "delete"} and dec.args and isinstance(dec.args[0], ast.Constant):
                key = (dec.func.attr, dec.args[0].value)
                if key in seen:
                    duplicates.append({"method": key[0], "path": key[1]})
                seen.add(key)
    return {"head": revision, "path": relative, "file_sha256": digest(local), "head_file_sha256": digest(tracked), "unchanged": local == tracked, "unique_routes": len(seen), "duplicate_decorators": duplicates,
            "interpretation": "Existing SPEC_AGENTS legacy baseline only; never imported by the demo. Duplicate routes block integration into that legacy service, not the isolated synthetic app."}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    before = source_inventory()
    python = str(HERE / ".venv/bin/python")
    results = {
        "contracts": command("contracts", [python, "-c", "import json; from openapi_spec_validator import validate; from jsonschema import Draft202012Validator; s=json.load(open('SPECS/contracts/openapi.json')); validate(s); Draft202012Validator.check_schema(json.load(open('SPECS/contracts/ui-card.schema.json'))); print('PASS: formal OpenAPI 3.0.3 and typed UI schema; runtime response examples covered separately by backend tests')"], ROOT),
        "backend": command("backend", [python, "-m", "unittest", "-v", "test_workspace.py", "test_telegram.py", "test_link.py", "test_session.py", "test_unlink.py"], HERE),
        "bridge": command("bridge", [python, "-m", "unittest", "discover", "-s", str(ROOT / "beglobal/membership-bridge"), "-p", "test_*.py", "-v"], ROOT),
        "test_review": command("test-review", ["node", "tools/review-tests.cjs"], HERE),
        "browser": command("browser", ["npm", "run", "test:ui"], HERE),
    }
    # Preserve the global failure as a failure; do not relax the uniqueness check.
    global_specs = command("specs-worktree", [python, "SPECS/qa/validate_specs.py"], ROOT)
    baseline = legacy_baseline()
    after = source_inventory()
    stable = before == after
    local_pass = stable and all(r["result"] == "PASS" for r in results.values())
    revision = digest(json.dumps(after, sort_keys=True, separators=(",", ":")).encode())
    report = {"recorded_at": datetime.now(timezone.utc).isoformat(), "scope": "SP-005 local Telegram unlink with fresh HMAC, not product acceptance or production",
              "local_status": "PASS" if local_pass else "FAIL", "source_revision": revision, "source_files": after,
              "source_stable_during_run": stable, "suites": results, "legacy_baseline": baseline,
              "global_specs_worktree": global_specs,
              "integration_gate": "BLOCKED_EXISTING_LEGACY_DUPLICATES" if baseline["duplicate_decorators"] else "NOT_AUTHORIZED",
              "product_acceptance": "PENDING_ROGER_REVIEW", "external_spend_usd": 0,
              "no_claims": ["Real Telegram/web identity", "Real BeGlobal membership platform", "Private knowledge retrieval", "Third-party connectors", "Performance/load SLA", "Production deployment"]}
    (OUT / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    (OUT / "legacy-baseline.json").write_text(json.dumps(baseline, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({k: v for k, v in report.items() if k != "source_files"}, indent=2, ensure_ascii=False))
    # This exit code is ONLY the local demo gate. global_specs_worktree remains
    # explicitly FAIL in the report; never use this command as a release gate.
    return 0 if local_pass else 1


if __name__ == "__main__":
    raise SystemExit(main())
