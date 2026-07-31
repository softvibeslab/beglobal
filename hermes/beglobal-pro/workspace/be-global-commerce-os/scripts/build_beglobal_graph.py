#!/usr/bin/env python3
"""Build a lightweight Graphify-compatible knowledge graph for Be Global Commerce OS.

This is a deterministic fallback for markdown KBs when Graphify semantic LLM
extraction cannot run because no LLM API key is configured. It writes the same
raw extraction shape Graphify accepts: {nodes, edges, hyperedges, input_tokens,
output_tokens}.
"""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "graphify-out"
KB_DIRS = [ROOT / "kb", ROOT / "expert-research"]

CORE_CONCEPTS = {
    "Be Global Commerce OS": ["be global commerce os", "sistema inteligente de ecommerce"],
    "Academia Be Global Pro": ["academia", "formación", "módulo", "alumno"],
    "Agentes IA": ["agente", "agentes", "ia", "chatbot"],
    "CRM Be Global": ["crm", "pipeline", "contacto", "lead", "data"],
    "Tiendas privadas": ["tienda privada", "tiendas privadas", "storefront", "catálogo", "catalogo"],
    "Telegram Ofertas Premium MX": ["telegram", "ofertas premium mx", "canal de ofertas"],
    "Marketplace conversacional": ["marketplace", "conversacional", "recomendaciones"],
    "Piloto 30–45 días": ["piloto", "30–45", "30-45", "mvp"],
    "Producto / Ofertas": ["producto", "productos", "ofertas", "curaduría", "curaduria"],
    "Reporting / Insights": ["dashboard", "métricas", "metricas", "reporting", "insights", "kpi"],
    "Diagnóstico": ["diagnóstico", "diagnostico", "calificado", "recomienda ruta"],
    "Follow-up comercial": ["follow-up", "seguimiento", "objeciones", "lead caliente"],
    "Guardrails": ["no prometer", "riesgos", "guardrails", "garantías", "garantias"],
}

AGENT_NAMES = [
    "Agente Allan",
    "Agente de Diagnóstico",
    "Agente Comercial / Follow-up",
    "Agente Academia",
    "Agente Producto / Ofertas",
    "Agente Telegram Premium MX",
    "Agente Store Setup",
    "Agente Comunidad/Soporte",
    "Agente Reporting/Insights",
    "Agente Orquestador Be Global",
]

STEP_NODES = [
    "1. Empezar desde cero",
    "2. Encontrar productos",
    "3. Construir tienda",
    "4. Lanzar",
    "5. Empezar a vender online",
    "6. Optimizar y escalar",
]


def slug(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9áéíóúñü]+", "_", s)
    return re.sub(r"_+", "_", s).strip("_") or "node"


def add_node(nodes, seen, label, file_type="concept", source_file="", summary="", kind="concept"):
    nid = slug(label)
    if nid not in seen:
        node = {"id": nid, "label": label, "file_type": file_type, "kind": kind}
        if source_file:
            node["source_file"] = source_file
        if summary:
            node["summary"] = summary[:500]
        nodes.append(node)
        seen.add(nid)
    return nid


def add_edge(edges, source, target, relation, source_file="", confidence="EXTRACTED", note=""):
    if source == target:
        return
    edge = {"source": source, "target": target, "relation": relation, "confidence": confidence}
    if source_file:
        edge["source_file"] = source_file
    if note:
        edge["note"] = note[:300]
    edges.append(edge)


def heading_summary(text: str, start: int, end: int) -> str:
    chunk = "\n".join(text.splitlines()[start:end])
    chunk = re.sub(r"\s+", " ", chunk).strip()
    return chunk[:420]


def main():
    nodes, edges, seen = [], [], set()
    root_id = add_node(nodes, seen, "Be Global Commerce OS", source_file=".", summary="Academia + agentes IA + CRM + tiendas privadas + canal de ofertas + marketplace conversacional.")

    # Core concept nodes
    for label in CORE_CONCEPTS:
        cid = add_node(nodes, seen, label)
        if cid != root_id:
            add_edge(edges, root_id, cid, "contains")

    # Orchestrator and agents
    orch = add_node(nodes, seen, "Agente Orquestador Be Global", summary="Guía al usuario por el paso a paso, diagnostica fase, delega al subagente correcto y registra siguiente acción.", kind="agent")
    add_edge(edges, orch, root_id, "orchestrates")
    for agent in AGENT_NAMES:
        aid = add_node(nodes, seen, agent, kind="agent")
        add_edge(edges, orch, aid, "routes_to")
        add_edge(edges, aid, slug("Agentes IA"), "belongs_to")

    # Instagram carousel step flow
    prev = None
    for step in STEP_NODES:
        sid = add_node(nodes, seen, step, summary="Paso del carrusel Be Global Pro: cómo empezar, encontrar productos, construir tienda, lanzar, vender, optimizar/escalar.", kind="step")
        add_edge(edges, orch, sid, "guides_step")
        if prev:
            add_edge(edges, prev, sid, "next_step")
        prev = sid

    # Document and heading nodes
    for base in KB_DIRS:
        for path in sorted(base.rglob("*.md")):
            rel = str(path.relative_to(ROOT))
            text = path.read_text(encoding="utf-8", errors="ignore")
            title_match = re.search(r"^#\s+(.+)$", text, re.M)
            title = title_match.group(1).strip() if title_match else path.stem
            doc_id = add_node(nodes, seen, rel, file_type="document", source_file=rel, summary=title, kind="document")
            add_edge(edges, root_id, doc_id, "documented_in", rel)

            lines = text.splitlines()
            headings = []
            for i, line in enumerate(lines):
                m = re.match(r"^(#{2,4})\s+(.+)$", line)
                if m:
                    headings.append((i, len(m.group(1)), m.group(2).strip()))
            for idx, (line_no, level, heading) in enumerate(headings):
                end = headings[idx + 1][0] if idx + 1 < len(headings) else len(lines)
                hid = add_node(nodes, seen, f"{title} / {heading}", file_type="concept", source_file=rel, summary=heading_summary(text, line_no, end), kind="section")
                add_edge(edges, doc_id, hid, "has_section", rel)

            lower = text.lower()
            for concept, terms in CORE_CONCEPTS.items():
                count = sum(lower.count(t) for t in terms)
                if count:
                    cid = slug(concept)
                    add_edge(edges, doc_id, cid, "mentions", rel, note=f"{count} matches")

            for agent in AGENT_NAMES:
                if agent.lower().replace("/", " ") in lower or agent.lower() in lower:
                    add_edge(edges, doc_id, slug(agent), "describes_agent", rel)

    # Explicit architecture edges
    explicit = [
        ("Instagram/contenido", "Agente de Diagnóstico", "attracts_to"),
        ("Agente de Diagnóstico", "CRM Be Global", "writes_profile_to"),
        ("CRM Be Global", "Academia Be Global Pro", "recommends_route_to"),
        ("CRM Be Global", "Tiendas privadas", "assigns_catalog_to"),
        ("Telegram Ofertas Premium MX", "Producto / Ofertas", "tests_intent_for"),
        ("Producto / Ofertas", "Marketplace conversacional", "feeds"),
        ("Reporting / Insights", "CRM Be Global", "closes_learning_loop_with"),
        ("Guardrails", "Agente Orquestador Be Global", "constrains"),
        ("Piloto 30–45 días", "Be Global Commerce OS", "validates"),
    ]
    for a, b, rel in explicit:
        aid = add_node(nodes, seen, a)
        bid = add_node(nodes, seen, b)
        add_edge(edges, aid, bid, rel, confidence="INFERRED")

    # Deduplicate edges
    uniq = {}
    for e in edges:
        key = (e["source"], e["target"], e.get("relation"), e.get("source_file", ""))
        uniq[key] = e
    data = {"nodes": nodes, "edges": list(uniq.values()), "hyperedges": [], "input_tokens": 0, "output_tokens": 0}
    OUT.mkdir(exist_ok=True)
    (OUT / "graph.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT/'graph.json'} — {len(nodes)} nodes, {len(uniq)} edges")

if __name__ == "__main__":
    main()
