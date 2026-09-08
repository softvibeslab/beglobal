#!/usr/bin/env python3
"""Build and query the federated Be Global corporate knowledge graph.

The builder uses only the Python standard library. It merges the existing
Commerce OS and YouTube graphs, then adds a catalog of first-party project
sources with explicit precedence and provenance.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


COMMERCE_ROOT = Path("hermes/beglobal-pro/workspace/be-global-commerce-os")
COMMERCE_GRAPH = COMMERCE_ROOT / "graphify-out/graph.json"
YOUTUBE_GRAPH = Path("graphify-out/graph.json")
TEXT_EXTENSIONS = {".md", ".txt", ".py", ".ts", ".tsx", ".js", ".html", ".css", ".json", ".jsonl", ".csv", ".yaml", ".yml"}
EXCLUDED_PARTS = {".git", ".next", "node_modules", "__pycache__", "logs", "sessions", "cache"}
EXCLUDED_NAMES = {".env", "auth.json", "state.db", "gateway_state.json"}
CANONICAL_SOURCES = [
    "beglobal/meetings/summary.md",
    "beglobal/meetings/prompt.md",
    "hermes/beglobal-corporate/SOUL.md",
    "hermes/beglobal-corporate/PERMISSIONS.md",
    "hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/01_METODOLOGIA.md",
    "hermes/beglobal-pro/skills/beglobal/beglobal-pro-guide/references/04_FAQ_GUARDRAILS.md",
    "hermes/beglobal-pro/workspace/be-global-commerce-os/kb/01_master_brief.md",
    "hermes/beglobal-pro/workspace/be-global-commerce-os/kb/08_mvp_pilot_charter.md",
    "hermes/beglobal-pro/workspace/be-global-commerce-os/kb/09_risks_guardrails.md",
    "beglobal/meetings/Meeting Transcription (9).txt",
]


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def source_priority(path: str) -> int:
    if path in CANONICAL_SOURCES[:2]:
        return 1
    if path in CANONICAL_SOURCES[2:6] or "/beglobal-corporate/" in path:
        return 2
    if "/be-global-commerce-os/kb/" in path or "/expert-research/" in path:
        return 3
    if "transcript" in path.lower() or "/graph_corpus/" in path:
        return 4
    return 5


def source_domain(path: str) -> str:
    if path.startswith("beglobal/meetings/"):
        return "decisiones-y-reuniones"
    if "/beglobal-corporate/" in path or path.startswith("hermes/BEGLOBAL_"):
        return "gobernanza-corporativa"
    if "/be-global-commerce-os/" in path:
        return "commerce-os"
    if "/beglobal-pro-guide/" in path:
        return "metodologia-operativa"
    if path.startswith("raw/youtube/"):
        return "youtube-y-capacitacion"
    if path.startswith("beglobal/dashboard/") or path.startswith("beglobal/miniapps/"):
        return "producto-y-aplicaciones"
    return "proyecto"


def include_source(path: str) -> bool:
    p = Path(path)
    if p.suffix.lower() not in TEXT_EXTENSIONS:
        return False
    if p.name in EXCLUDED_NAMES or any(part in EXCLUDED_PARTS for part in p.parts):
        return False
    if any(part.startswith(".env") for part in p.parts):
        return False
    allowed = (
        path.startswith("beglobal/"),
        path.startswith("hermes/BEGLOBAL_"),
        path.startswith("hermes/VPS_DEPLOYMENT_STATUS.md"),
        path.startswith("hermes/beglobal-corporate/"),
        path.startswith("hermes/beglobal-team/"),
        path.startswith("hermes/beglobal-member/"),
        path.startswith("hermes/beglobal-orchestrator/"),
        path == "hermes/beglobal-pro/SOUL.md",
        path.startswith("hermes/beglobal-pro/skills/beglobal/"),
        path.startswith("hermes/beglobal-pro/workspace/be-global-commerce-os/"),
        path.startswith("raw/youtube/beglobalpro/graph_corpus/"),
        path.startswith("scripts/"),
        path in {"README.md", "graphify-out/GRAPH_REPORT.md", "graphify-out/analysis.json"},
    )
    return any(allowed)


def tracked_sources(root: Path) -> list[Path]:
    output = subprocess.run(
        ["git", "ls-files", "-z"], cwd=root, check=True, capture_output=True
    ).stdout.decode("utf-8", errors="replace")
    paths = []
    for rel in sorted(item for item in output.split("\0") if item):
        path = root / rel
        if include_source(rel) and path.is_file() and path.stat().st_size <= 2_000_000:
            paths.append(path)
    return paths


def title_and_summary(path: Path) -> tuple[str, str]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    heading = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    title = heading.group(1).strip() if heading else path.stem.replace("_", " ")
    body = re.sub(r"[`#>*_|\[\]()]", " ", text)
    summary = re.sub(r"\s+", " ", body).strip()[:600]
    return title, summary


def catalog_sources(root: Path) -> list[dict[str, Any]]:
    sources = []
    for path in tracked_sources(root):
        rel = path.relative_to(root).as_posix()
        title, summary = title_and_summary(path)
        raw = path.read_bytes()
        sources.append(
            {
                "path": rel,
                "title": title,
                "summary": summary,
                "domain": source_domain(rel),
                "priority": source_priority(rel),
                "bytes": len(raw),
                "sha256": hashlib.sha256(raw).hexdigest(),
            }
        )
    return sources


def load_graph(path: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return data.get("nodes", []), data.get("edges", data.get("links", [])), data.get("hyperedges", [])


def federate_graph(root: Path, sources: list[dict[str, Any]]) -> dict[str, Any]:
    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, Any]] = []
    hyperedges: list[dict[str, Any]] = []
    labels: dict[str, list[str]] = {}

    graph_specs = [
        ("commerce", root / COMMERCE_GRAPH, COMMERCE_ROOT.as_posix()),
        ("youtube", root / YOUTUBE_GRAPH, ""),
    ]
    for namespace, path, source_prefix in graph_specs:
        raw_nodes, raw_edges, raw_hyperedges = load_graph(path)
        for raw in raw_nodes:
            node = dict(raw)
            old_id = str(node["id"])
            node["id"] = f"{namespace}:{old_id}"
            node["graph"] = namespace
            source_file = str(node.get("source_file", ""))
            if source_prefix and source_file and source_file != "." and not source_file.startswith(source_prefix):
                node["source_file"] = f"{source_prefix}/{source_file}"
            node["priority"] = source_priority(str(node.get("source_file", "")))
            nodes.append(node)
            labels.setdefault(normalize(str(node.get("label", ""))), []).append(node["id"])
        for raw in raw_edges:
            edge = dict(raw)
            edge["source"] = f"{namespace}:{edge['source']}"
            edge["target"] = f"{namespace}:{edge['target']}"
            source_file = str(edge.get("source_file", ""))
            if source_prefix and source_file and not source_file.startswith(source_prefix):
                edge["source_file"] = f"{source_prefix}/{source_file}"
            edge["graph"] = namespace
            edges.append(edge)
        for raw in raw_hyperedges:
            item = dict(raw)
            item["id"] = f"{namespace}:{item.get('id', len(hyperedges))}"
            item["nodes"] = [f"{namespace}:{node_id}" for node_id in item.get("nodes", [])]
            item["graph"] = namespace
            hyperedges.append(item)

    profile_id = "corporate:beglobal-corporate"
    nodes.append(
        {
            "id": profile_id,
            "label": "Perfil corporativo Be Global",
            "kind": "profile",
            "summary": "Gobierna metodología, permisos, calidad, métricas, riesgos y decisiones del piloto Be Global Pro.",
            "source_file": "hermes/beglobal-corporate/PROFILE.md",
            "priority": 2,
            "graph": "corporate",
        }
    )
    domain_ids: dict[str, str] = {}
    for source in sources:
        domain = source["domain"]
        domain_id = domain_ids.setdefault(domain, f"domain:{domain}")
        if not any(node["id"] == domain_id for node in nodes):
            nodes.append({"id": domain_id, "label": domain.replace("-", " ").title(), "kind": "domain", "graph": "project"})
            edges.append({"source": profile_id, "target": domain_id, "relation": "governs", "confidence": "EXTRACTED", "graph": "project"})
        doc_id = f"project:{source['path']}"
        nodes.append(
            {
                "id": doc_id,
                "label": source["title"],
                "kind": "document",
                "source_file": source["path"],
                "summary": source["summary"],
                "domain": domain,
                "priority": source["priority"],
                "sha256": source["sha256"],
                "graph": "project",
            }
        )
        edges.append({"source": domain_id, "target": doc_id, "relation": "documented_in", "source_file": source["path"], "confidence": "EXTRACTED", "graph": "project"})
        if source["path"] in CANONICAL_SOURCES:
            edges.append({"source": profile_id, "target": doc_id, "relation": "uses_canonical_source", "source_file": source["path"], "confidence": "EXTRACTED", "graph": "project"})

    for ids in labels.values():
        if len(ids) > 1:
            anchor = ids[0]
            for other in ids[1:]:
                edges.append({"source": anchor, "target": other, "relation": "same_entity_as", "confidence": "EXTRACTED", "graph": "federation"})

    nodes.sort(key=lambda item: item["id"])
    edges.sort(key=lambda item: (str(item.get("source")), str(item.get("target")), str(item.get("relation")), str(item.get("source_file", ""))))
    hyperedges.sort(key=lambda item: item["id"])
    return {
        "metadata": {
            "name": "Be Global Corporate Federated Knowledge Graph",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source_graphs": [COMMERCE_GRAPH.as_posix(), YOUTUBE_GRAPH.as_posix()],
            "precedence": "1 decisiones aprobadas; 2 gobierno/metodología; 3 Commerce OS; 4 evidencia/transcripciones; 5 implementación",
        },
        "nodes": nodes,
        "edges": edges,
        "hyperedges": hyperedges,
    }


def query(graph_path: Path, text: str, limit: int = 10) -> list[dict[str, Any]]:
    graph = json.loads(graph_path.read_text(encoding="utf-8"))
    terms = [term for term in normalize(text).split() if len(term) > 1]
    phrase = normalize(text)
    scored = []
    for node in graph.get("nodes", []):
        haystack = normalize(" ".join(str(node.get(field, "")) for field in ("label", "summary", "source_file", "domain")))
        score = sum(haystack.count(term) for term in terms)
        if phrase and phrase in haystack:
            score += 8
        priority = int(node.get("priority", 5) or 5)
        if score:
            score += max(0, 6 - priority) * 0.25
            scored.append((score, priority, str(node.get("label", "")), node))
    scored.sort(key=lambda item: (-item[0], item[1], item[2]))
    return [item[3] | {"score": item[0]} for item in scored[:limit]]


def write_knowledge_map(out: Path, graph: dict[str, Any], sources: list[dict[str, Any]]) -> None:
    domains: dict[str, int] = {}
    for source in sources:
        domains[source["domain"]] = domains.get(source["domain"], 0) + 1
    lines = [
        "# Mapa de conocimiento corporativo Be Global",
        "",
        "Esta base federa el grafo de Commerce OS, el grafo de YouTube y las fuentes propias del proyecto. No sustituye la fuente: cada respuesta sensible debe citar `source_file` y respetar precedencia.",
        "",
        "## Cobertura",
        "",
        f"- {len(graph['nodes'])} nodos",
        f"- {len(graph['edges'])} relaciones",
        f"- {len(graph['hyperedges'])} hiperrelaciones",
        f"- {len(sources)} fuentes catalogadas con SHA-256",
        "",
        "## Dominios",
        "",
    ]
    lines.extend(f"- `{domain}`: {count} fuentes" for domain, count in sorted(domains.items()))
    lines.extend(["", "## Fuentes canónicas y precedencia", ""])
    for path in CANONICAL_SOURCES:
        lines.append(f"- P{source_priority(path)} `{path}`")
    lines.extend(
        [
            "",
            "## Protocolo de consulta",
            "",
            "1. Para gobierno, método, precio, permisos, riesgo o piloto: consulta primero las fuentes P1–P2.",
            "2. Para arquitectura, CRM, agentes, marketplace o operación: consulta Commerce OS P3.",
            "3. Para capacitación o evidencia histórica: consulta YouTube/transcripciones P4 y etiqueta inferencias.",
            "4. Cita siempre el `source_file`; no presentes una relación `INFERRED` como hecho aprobado.",
            "5. Si las fuentes chocan, gana la de menor número de prioridad y, dentro del mismo nivel, la decisión aprobada más reciente.",
            "",
            "## Archivos",
            "",
            "- `knowledge_graph.json`: grafo federado completo.",
            "- `source_catalog.json`: inventario, dominio, prioridad y hash de cada fuente.",
            "- `query_graph.py`: búsqueda local determinista del grafo.",
        ]
    )
    (out / "KNOWLEDGE_MAP.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_query_wrapper(out: Path) -> None:
    wrapper = '''#!/usr/bin/env python3
import importlib.util
import json
import sys
from pathlib import Path

builder = Path(__file__).resolve().parents[4] / "scripts" / "build_corporate_knowledge.py"
if not builder.exists():
    builder = Path("/root/beblogal/beglobal/scripts/build_corporate_knowledge.py")
spec = importlib.util.spec_from_file_location("build_corporate_knowledge", builder)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
question = " ".join(sys.argv[1:]).strip()
if not question:
    raise SystemExit("uso: query_graph.py <pregunta>")
results = module.query(Path(__file__).with_name("knowledge_graph.json"), question)
print(json.dumps(results, ensure_ascii=False, indent=2))
'''
    path = out / "query_graph.py"
    path.write_text(wrapper, encoding="utf-8")
    path.chmod(0o755)


def build(root: Path, out: Path) -> dict[str, int]:
    root = root.resolve()
    out.mkdir(parents=True, exist_ok=True)
    sources = catalog_sources(root)
    graph = federate_graph(root, sources)
    (out / "knowledge_graph.json").write_text(json.dumps(graph, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    catalog = {
        "metadata": {"generated_at": graph["metadata"]["generated_at"], "root": str(root), "source_count": len(sources)},
        "sources": sources,
    }
    (out / "source_catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_knowledge_map(out, graph, sources)
    write_query_wrapper(out)
    return {"nodes": len(graph["nodes"]), "edges": len(graph["edges"]), "hyperedges": len(graph["hyperedges"]), "sources": len(sources)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--out", type=Path, default=Path("hermes/beglobal-corporate/workspace/knowledge"))
    parser.add_argument("--sync-profile", type=Path)
    parser.add_argument("--query")
    args = parser.parse_args()
    out = args.out if args.out.is_absolute() else args.root / args.out
    stats = build(args.root, out)
    if args.sync_profile:
        target = args.sync_profile / "workspace" / "knowledge"
        target.mkdir(parents=True, exist_ok=True)
        for path in out.iterdir():
            if path.is_file():
                shutil.copy2(path, target / path.name)
    if args.query:
        print(json.dumps(query(out / "knowledge_graph.json", args.query), ensure_ascii=False, indent=2))
    else:
        print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
