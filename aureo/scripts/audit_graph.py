"""Audita la ramificación del grafo Graphify de Be Global con la regla 3-13.

Uso: python3 aureo/scripts/audit_graph.py [ruta/graph.json] [ruta/salida.json]
"""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "aureo"))

from aureo import branching_audit  # noqa: E402


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "graphify-out" / "graph.json"
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "aureo" / "out" / "graph_branching_audit.json"
    g = json.loads(src.read_text())
    by_comm = Counter(str(n.get("community", "?")) for n in g["nodes"])
    degree = Counter()
    for e in g.get("links", []):
        degree[e.get("source")] += 1
        degree[e.get("target")] += 1
    # Etiqueta de cada comunidad: el nodo más conectado dentro de ella.
    labels = {}
    for n in g["nodes"]:
        c = str(n.get("community", "?"))
        if c not in labels or degree[n["id"]] > degree[labels[c][0]]:
            labels[c] = (n["id"], n.get("label"))
    tree = {f"comunidad {c} · {labels[c][1]}": cnt for c, cnt in by_comm.items()}
    report = branching_audit(tree)
    rows = []
    for r in report:
        d = r.__dict__.copy()
        # Una comunidad es un proxy plano (agrupa cursos y lecciones); solo
        # las que superan 21 nodos requieren partición inmediata.
        d["severidad"] = "alta" if r.children > 21 else ("media" if r.verdict == "split" else "ninguna")
        rows.append(d)
    summary = Counter(r.verdict for r in report)
    out = {"fuente": str(src), "regla": "3-13 hijos por nodo", "resumen": dict(summary), "nodos": rows}
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"{len(rows)} comunidades · {dict(summary)}")
    for r in report:
        flag = {"ok": "  ", "split": "✂ ", "merge": "⊕ "}[r.verdict]
        extra = f" → partir en {r.suggested_parts}" if r.verdict == "split" else ""
        sev = " [alta]" if r.children > 21 else ""
        print(f"{flag}{r.node}: {r.children} nodos{extra}{sev}")
    print(f"guardado en {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
