#!/usr/bin/env python3
"""Build graphify outputs from the Be Global Pro YouTube corpus.

This deterministic extractor is used when no cloud LLM credentials are
available and local Ollama cannot reliably produce graphify JSON for long
Spanish transcripts.
"""

from __future__ import annotations

import json
import math
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from graphify.analyze import god_nodes, suggest_questions, surprising_connections
from graphify.benchmark import run_benchmark
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.detect import detect, save_manifest
from graphify.export import to_graphml, to_html, to_json
from graphify.report import generate


ROOT = Path(".").resolve()
SOURCE_DIR = Path("raw/youtube/beglobalpro")
CORPUS_DIR = SOURCE_DIR / "graph_corpus"
OUT_DIR = Path("graphify-out")


CONCEPTS: list[dict[str, Any]] = [
    {"id": "concept_ecommerce", "label": "Ecommerce", "kind": "domain", "keywords": ["ecommerce", "e-commerce", "comercio electronico", "tienda en linea", "tienda online", "negocio digital"]},
    {"id": "concept_dropshipping", "label": "Dropshipping", "kind": "business_model", "keywords": ["dropshipping", "drop shipping", "dropshipping express"]},
    {"id": "concept_shopify", "label": "Shopify", "kind": "platform", "keywords": ["shopify", "plantilla", "tema", "pagina de producto", "tienda en linea"]},
    {"id": "concept_mercado_libre", "label": "Mercado Libre", "kind": "platform", "keywords": ["mercado libre", "mercadolibre", "mercado pago"]},
    {"id": "concept_amazon", "label": "Amazon", "kind": "platform", "keywords": ["amazon", "amazon ads"]},
    {"id": "concept_redes_sociales", "label": "Redes Sociales", "kind": "channel", "keywords": ["redes sociales", "instagram", "facebook", "tiktok", "reels", "publicaciones"]},
    {"id": "concept_meta_ads", "label": "Meta Ads", "kind": "ads", "keywords": ["meta ads", "facebook ads", "campana publicitaria", "campanas", "ads", "pixel", "business manager", "publicos similares"]},
    {"id": "concept_contenido_organico", "label": "Contenido Organico", "kind": "marketing", "keywords": ["contenido", "contenido organico", "crear videos", "videos virales", "reels", "publicaciones", "guiones"]},
    {"id": "concept_canva", "label": "Canva", "kind": "tool", "keywords": ["canva", "diseno", "diseñar", "imagenes"]},
    {"id": "concept_capcut", "label": "CapCut", "kind": "tool", "keywords": ["capcut", "editar videos", "edicion"]},
    {"id": "concept_ia", "label": "Inteligencia Artificial", "kind": "tool", "keywords": ["ia", "inteligencia artificial", "chatgpt", "imagenes con ia", "videos con ia"]},
    {"id": "concept_producto_ganador", "label": "Producto Ganador", "kind": "offer", "keywords": ["producto ganador", "seleccion de productos", "analisis de producto", "productos tendencia", "que vender"]},
    {"id": "concept_precio", "label": "Precio y Rentabilidad", "kind": "finance", "keywords": ["precio", "rentabilidad", "poner el precio", "margen", "ganancia", "costos"]},
    {"id": "concept_ticket_promedio", "label": "Ticket Promedio", "kind": "sales", "keywords": ["ticket promedio", "ticket de venta", "ticket alto", "ticket medio", "ticket bajo"]},
    {"id": "concept_upsell", "label": "Upsell", "kind": "sales", "keywords": ["upsell", "opsel", "obsell", "version premium", "premium"]},
    {"id": "concept_cross_sell", "label": "Cross-sell", "kind": "sales", "keywords": ["cross-sell", "crossell", "cross sell", "producto complementario", "complementarios"]},
    {"id": "concept_valor_anadido", "label": "Valor Anadido", "kind": "sales", "keywords": ["valor anadido", "valor añadido", "bono", "recetario", "garantia", "certificacion", "membresia", "suscripcion"]},
    {"id": "concept_combos_bundles", "label": "Combos y Bundles", "kind": "offer", "keywords": ["combo", "combos", "bundle", "bundles", "paquete", "paquetes"]},
    {"id": "concept_chat_selling", "label": "Chat Selling", "kind": "sales", "keywords": ["chat selling", "whatsapp", "mensajeria", "vender por mensaje", "seguimiento", "ventas directas"]},
    {"id": "concept_customer_journey", "label": "Camino del Cliente", "kind": "sales", "keywords": ["camino del cliente", "cliente", "atraer", "cerrar ventas", "conversion"]},
    {"id": "concept_funnel", "label": "Funnel de Ventas", "kind": "marketing", "keywords": ["funnel", "embudo", "conversion"]},
    {"id": "concept_copywriting", "label": "Copywriting", "kind": "marketing", "keywords": ["copywriting", "copy", "copys", "persuadir", "descripcion que vende", "descripciones que venden"]},
    {"id": "concept_branding", "label": "Marca y Branding", "kind": "brand", "keywords": ["marca", "branding", "logo", "marca personal", "narrativa"]},
    {"id": "concept_confianza", "label": "Confianza en Tienda", "kind": "conversion", "keywords": ["confianza", "testimonios", "garantia", "certificacion", "seguridad"]},
    {"id": "concept_pasarelas_pago", "label": "Pasarelas de Pago", "kind": "operations", "keywords": ["pasarela", "pasarelas de pago", "mercado pago", "pago"]},
    {"id": "concept_logistica", "label": "Logistica y Envio", "kind": "operations", "keywords": ["skydrop", "envios", "logistica", "proveedores", "importa", "importaciones"]},
    {"id": "concept_contabilidad", "label": "Contabilidad", "kind": "finance", "keywords": ["contabilidad", "fiscal", "hacienda", "registro fiscal", "finanzas", "ingresos", "egresos"]},
    {"id": "concept_temporadas", "label": "Ventas de Temporada", "kind": "marketing", "keywords": ["temporada", "navidena", "san valentin", "dia de las madres", "hot sale", "hotsale"]},
    {"id": "concept_onboarding", "label": "Onboarding y Socios Nuevos", "kind": "program", "keywords": ["socios nuevos", "induccion", "bienvenida", "bootcamp", "abc del ecommerce", "desde cero"]},
    {"id": "concept_be_global_pro", "label": "Sistema Be Global Pro", "kind": "program", "keywords": ["be global pro", "beglobalpro", "sistema be global pro", "academia"]},
]


TAXONOMY_EDGES = [
    ("concept_be_global_pro", "concept_ecommerce", "teaches"),
    ("concept_ecommerce", "concept_dropshipping", "includes"),
    ("concept_ecommerce", "concept_shopify", "uses"),
    ("concept_ecommerce", "concept_mercado_libre", "uses"),
    ("concept_ecommerce", "concept_amazon", "uses"),
    ("concept_ecommerce", "concept_redes_sociales", "uses"),
    ("concept_shopify", "concept_pasarelas_pago", "requires"),
    ("concept_shopify", "concept_ticket_promedio", "enables"),
    ("concept_ticket_promedio", "concept_upsell", "increases_with"),
    ("concept_ticket_promedio", "concept_cross_sell", "increases_with"),
    ("concept_ticket_promedio", "concept_valor_anadido", "increases_with"),
    ("concept_valor_anadido", "concept_combos_bundles", "packages_as"),
    ("concept_producto_ganador", "concept_precio", "depends_on"),
    ("concept_contenido_organico", "concept_redes_sociales", "distributed_on"),
    ("concept_contenido_organico", "concept_canva", "created_with"),
    ("concept_contenido_organico", "concept_capcut", "edited_with"),
    ("concept_contenido_organico", "concept_ia", "accelerated_by"),
    ("concept_meta_ads", "concept_redes_sociales", "runs_on"),
    ("concept_customer_journey", "concept_funnel", "modeled_by"),
    ("concept_customer_journey", "concept_chat_selling", "closed_by"),
    ("concept_copywriting", "concept_confianza", "supports"),
    ("concept_branding", "concept_confianza", "supports"),
    ("concept_contabilidad", "concept_precio", "informs"),
    ("concept_logistica", "concept_dropshipping", "supports"),
]


THEME_KEYWORDS = {
    "Shopify y tienda en linea": ["shopify", "tienda en linea", "plantilla", "pagina de producto"],
    "Marketplaces": ["mercado libre", "amazon", "marketplace", "mercado pago"],
    "Publicidad pagada": ["ads", "campana", "facebook ads", "pixel", "business manager"],
    "Contenido y creatividad": ["contenido", "canva", "capcut", "videos", "reels", "imagenes"],
    "Producto y oferta": ["producto", "precio", "ticket", "upsell", "cross", "combo", "bundle"],
    "Operaciones y finanzas": ["contabilidad", "fiscal", "pasarela", "skydrop", "envio", "proveedor"],
    "Marca y ventas": ["marca", "branding", "copy", "whatsapp", "cliente", "funnel", "confianza"],
    "Onboarding Be Global Pro": ["socios nuevos", "induccion", "bienvenida", "bootcamp", "abc del ecommerce"],
}


def slug(value: str) -> str:
    text = value.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")[:90] or "node"


def relpath(path: str | Path | None) -> str:
    if not path:
        return str(CORPUS_DIR / "channel_inventory.md")
    p = Path(path)
    if not p.is_absolute():
        return str(p)
    try:
        return str(p.relative_to(ROOT))
    except ValueError:
        return str(p)


def load_manifest() -> dict[str, Any]:
    return json.loads((SOURCE_DIR / "manifest" / "videos.json").read_text(encoding="utf-8"))


def read_video_text(video: dict[str, Any]) -> str:
    path = Path(video.get("markdown_path", ""))
    graph_path = CORPUS_DIR / "transcripts" / path.name
    chunks = [video.get("title", ""), video.get("source_url", "")]
    if graph_path.exists():
        chunks.append(graph_path.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(chunks).lower()


def add_node(nodes: dict[str, dict[str, Any]], node: dict[str, Any]) -> None:
    nodes.setdefault(node["id"], node)


def edge(
    source: str,
    target: str,
    relation: str,
    confidence: str,
    score: float,
    source_file: str | Path,
    source_location: str | None = None,
    weight: float | None = None,
) -> dict[str, Any]:
    return {
        "source": source,
        "target": target,
        "relation": relation,
        "confidence": confidence,
        "confidence_score": score,
        "source_file": relpath(source_file),
        "source_location": source_location,
        "weight": weight if weight is not None else score,
    }


def match_keywords(text: str, keywords: list[str]) -> list[str]:
    found = []
    for keyword in keywords:
        if keyword.lower() in text:
            found.append(keyword)
    return found


def choose_theme(text: str) -> str:
    scores = {
        theme: sum(1 for keyword in keywords if keyword in text)
        for theme, keywords in THEME_KEYWORDS.items()
    }
    theme, score = max(scores.items(), key=lambda item: item[1])
    return theme if score else "General Ecommerce"


def build_extraction() -> tuple[dict[str, Any], dict[str, Any]]:
    manifest = load_manifest()
    videos = manifest["videos"]
    nodes: dict[str, dict[str, Any]] = {}
    edges: list[dict[str, Any]] = []
    hyperedges: list[dict[str, Any]] = []

    add_node(
        nodes,
        {
            "id": "channel_be_global_pro",
            "label": "Be Global Pro YouTube Channel",
            "file_type": "document",
            "source_file": relpath(CORPUS_DIR / "channel_inventory.md"),
            "source_location": "channel inventory",
            "source_url": "https://www.youtube.com/@beglobalpro/videos",
            "captured_at": manifest.get("captured_at"),
            "author": "Be Global Pro",
            "contributor": "Codex",
            "node_kind": "channel",
        },
    )

    for concept in CONCEPTS:
        add_node(
            nodes,
            {
                "id": concept["id"],
                "label": concept["label"],
                "file_type": "rationale",
                "source_file": relpath(CORPUS_DIR / "channel_inventory.md"),
                "source_location": "keyword taxonomy",
                "source_url": "https://www.youtube.com/@beglobalpro/videos",
                "captured_at": manifest.get("captured_at"),
                "author": "Be Global Pro",
                "contributor": "Codex",
                "node_kind": concept["kind"],
                "keywords": concept["keywords"],
            },
        )

    for theme in list(THEME_KEYWORDS) + ["General Ecommerce"]:
        add_node(
            nodes,
            {
                "id": f"theme_{slug(theme)}",
                "label": theme,
                "file_type": "rationale",
                "source_file": relpath(CORPUS_DIR / "channel_inventory.md"),
                "source_location": "topic grouping",
                "source_url": "https://www.youtube.com/@beglobalpro/videos",
                "captured_at": manifest.get("captured_at"),
                "author": "Be Global Pro",
                "contributor": "Codex",
                "node_kind": "theme",
            },
        )

    theme_members: dict[str, list[str]] = defaultdict(list)
    concept_members: dict[str, list[str]] = defaultdict(list)
    videos_with_transcript = 0

    for video in videos:
        video_id = video["video_id"]
        node_id = f"video_{video_id}"
        has_transcript = video.get("transcript_chars", 0) > 0
        videos_with_transcript += int(has_transcript)
        source_file = video.get("markdown_path") if has_transcript else CORPUS_DIR / "channel_inventory.md"
        if has_transcript:
            source_file = CORPUS_DIR / "transcripts" / Path(str(source_file)).name
        text = read_video_text(video)
        theme = choose_theme(text)
        theme_id = f"theme_{slug(theme)}"
        theme_members[theme_id].append(node_id)

        add_node(
            nodes,
            {
                "id": node_id,
                "label": video.get("title") or video_id,
                "file_type": "document",
                "source_file": relpath(source_file),
                "source_location": "title+transcript" if has_transcript else "channel inventory title",
                "source_url": video.get("source_url"),
                "captured_at": manifest.get("captured_at"),
                "author": video.get("author") or "Be Global Pro",
                "contributor": "Codex",
                "node_kind": "video",
                "video_id": video_id,
                "published_at": video.get("published_at"),
                "duration_seconds": video.get("duration_seconds"),
                "transcript_chars": video.get("transcript_chars", 0),
            },
        )
        edges.append(edge("channel_be_global_pro", node_id, "references", "EXTRACTED", 1.0, source_file, "channel listing"))
        edges.append(edge(node_id, theme_id, "conceptually_related_to", "EXTRACTED", 1.0, source_file, f"theme: {theme}"))

        for concept in CONCEPTS:
            found = match_keywords(text, concept["keywords"])
            if not found:
                continue
            concept_members[concept["id"]].append(node_id)
            location = "title/transcript keyword: " + ", ".join(found[:4])
            score = 1.0 if has_transcript else 0.9
            edges.append(edge(node_id, concept["id"], "references", "EXTRACTED", score, source_file, location))

    for source, target, label in TAXONOMY_EDGES:
        edges.append(
            edge(
                source,
                target,
                "conceptually_related_to",
                "INFERRED",
                0.82,
                CORPUS_DIR / "channel_inventory.md",
                f"taxonomy relation: {label}",
                0.82,
            )
        )

    for theme_id, members in theme_members.items():
        if len(members) >= 3:
            hyperedges.append(
                {
                    "id": f"hyperedge_{theme_id}",
                    "label": f"{nodes[theme_id]['label']} video group",
                    "nodes": [theme_id] + members[:20],
                    "relation": "participate_in",
                    "confidence": "EXTRACTED",
                    "confidence_score": 1.0,
                    "source_file": relpath(CORPUS_DIR / "channel_inventory.md"),
                }
            )

    for concept_id, members in concept_members.items():
        if len(members) < 2:
            continue
        for a, b in zip(members[:8], members[1:9]):
            edges.append(
                edge(
                    a,
                    b,
                    "semantically_similar_to",
                    "INFERRED",
                    0.68,
                    CORPUS_DIR / "channel_inventory.md",
                    f"shared concept: {nodes[concept_id]['label']}",
                    0.5,
                )
            )

    extraction = {
        "nodes": list(nodes.values()),
        "edges": edges,
        "hyperedges": hyperedges,
        "input_tokens": 0,
        "output_tokens": 0,
        "metadata": {
            "extractor": "deterministic_youtube_keyword_graph",
            "videos_total": len(videos),
            "videos_with_transcript": videos_with_transcript,
            "built_at": datetime.now(timezone.utc).isoformat(),
        },
    }
    stats = {
        "videos_total": len(videos),
        "videos_with_transcript": videos_with_transcript,
        "videos_without_transcript": len(videos) - videos_with_transcript,
        "nodes": len(extraction["nodes"]),
        "edges": len(extraction["edges"]),
        "hyperedges": len(extraction["hyperedges"]),
    }
    return extraction, stats


def community_labels(G: Any, communities: dict[int, list[str]]) -> dict[int, str]:
    labels: dict[int, str] = {}
    for cid, members in communities.items():
        node_labels = [G.nodes[n].get("label", n) for n in members]
        kind_counts = Counter(G.nodes[n].get("node_kind", "") for n in members)
        conceptish = [
            G.nodes[n].get("label", n)
            for n in members
            if G.nodes[n].get("node_kind") in {"theme", "platform", "sales", "marketing", "operations", "finance", "offer", "business_model", "program", "brand"}
        ]
        if conceptish:
            labels[cid] = conceptish[0][:42]
            continue
        if kind_counts.get("channel"):
            labels[cid] = "Channel Overview"
            continue
        words = Counter()
        for label in node_labels:
            for word in re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{4,}", label.lower()):
                if word not in {"clase", "global", "expertos", "como", "para", "desde", "parte"}:
                    words[word] += 1
        labels[cid] = " ".join(word.title() for word, _ in words.most_common(3)) or f"Community {cid}"
    return labels


def graphml_safe_copy(G: Any) -> Any:
    H = G.copy()
    for _, attrs in H.nodes(data=True):
        for key, value in list(attrs.items()):
            if isinstance(value, (list, dict)):
                attrs[key] = json.dumps(value, ensure_ascii=False)
            elif value is None:
                attrs[key] = ""
    for _, _, attrs in H.edges(data=True):
        for key, value in list(attrs.items()):
            if isinstance(value, (list, dict)):
                attrs[key] = json.dumps(value, ensure_ascii=False)
            elif value is None:
                attrs[key] = ""
    for key, value in list(H.graph.items()):
        if isinstance(value, (list, dict)):
            H.graph[key] = json.dumps(value, ensure_ascii=False)
        elif value is None:
            H.graph[key] = ""
    return H


def write_outputs() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    detection = detect(CORPUS_DIR)
    Path(".graphify_detect.json").write_text(json.dumps(detection, indent=2), encoding="utf-8")
    extraction, stats = build_extraction()
    Path(".graphify_extract.json").write_text(json.dumps(extraction, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "extraction.json").write_text(json.dumps(extraction, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "youtube_ingest_summary.json").write_text(json.dumps(stats, indent=2, ensure_ascii=False), encoding="utf-8")

    G = build_from_json(extraction, root=ROOT)
    communities = cluster(G)
    cohesion = score_all(G, communities)
    labels = community_labels(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    questions = suggest_questions(G, communities, labels)
    tokens = {"input": extraction.get("input_tokens", 0), "output": extraction.get("output_tokens", 0)}

    report = generate(
        G,
        communities,
        cohesion,
        labels,
        gods,
        surprises,
        detection,
        tokens,
        str(CORPUS_DIR),
        suggested_questions=questions,
    )
    (OUT_DIR / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")
    to_json(G, communities, str(OUT_DIR / "graph.json"), force=True)
    to_html(G, communities, str(OUT_DIR / "graph.html"), community_labels=labels)
    to_graphml(graphml_safe_copy(G), communities, str(OUT_DIR / "graph.graphml"))

    analysis = {
        "communities": {str(k): v for k, v in communities.items()},
        "cohesion": {str(k): v for k, v in cohesion.items()},
        "labels": {str(k): v for k, v in labels.items()},
        "gods": gods,
        "surprises": surprises,
        "questions": questions,
        "stats": stats,
    }
    (OUT_DIR / "analysis.json").write_text(json.dumps(analysis, indent=2, ensure_ascii=False), encoding="utf-8")
    save_manifest(detection["files"])

    if detection.get("total_words", 0) > 5000:
        benchmark = run_benchmark(str(OUT_DIR / "graph.json"), corpus_words=detection["total_words"])
        (OUT_DIR / "benchmark.json").write_text(json.dumps(benchmark, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities")
    print(json.dumps(stats, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    write_outputs()
