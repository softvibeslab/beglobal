#!/usr/bin/env python3
"""Create the graphify-ready corpus from the YouTube ingestion output."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path
from typing import Any


SOURCE_DIR = Path("raw/youtube/beglobalpro")
TARGET_DIR = SOURCE_DIR / "graph_corpus"


def clean_target() -> None:
    if TARGET_DIR.exists():
        shutil.rmtree(TARGET_DIR)
    (TARGET_DIR / "transcripts").mkdir(parents=True, exist_ok=True)


def frontmatter(data: dict[str, Any]) -> str:
    def scalar(value: Any) -> str:
        if value is None:
            return "null"
        if isinstance(value, (int, float)):
            return str(value)
        text = str(value).replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        return f'"{text}"'

    lines = ["---"]
    for key, value in data.items():
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"  - {scalar(item)}")
        else:
            lines.append(f"{key}: {scalar(value)}")
    lines.append("---")
    return "\n".join(lines)


def video_theme(title: str) -> str:
    text = title.lower()
    buckets = [
        ("shopify", "Shopify y tienda en linea"),
        ("mercado libre", "Mercado Libre"),
        ("amazon", "Amazon"),
        ("ads", "Publicidad pagada"),
        ("facebook", "Publicidad y Facebook"),
        ("instagram", "Instagram y redes sociales"),
        ("tiktok", "TikTok y redes sociales"),
        ("canva", "Diseno y creatividad"),
        ("capcut", "Video y edicion"),
        ("contenido", "Contenido organico"),
        ("producto", "Producto y oferta"),
        ("precio", "Precio y rentabilidad"),
        ("ticket", "Ticket promedio y upsell"),
        ("upsell", "Ticket promedio y upsell"),
        ("cross", "Ticket promedio y upsell"),
        ("dropshipping", "Dropshipping"),
        ("contabilidad", "Finanzas y contabilidad"),
        ("fiscal", "Finanzas y contabilidad"),
        ("marca", "Marca y posicionamiento"),
        ("copy", "Copywriting y persuasion"),
        ("whatsapp", "Chat selling"),
        ("mensaje", "Chat selling"),
        ("cliente", "Customer journey y ventas"),
        ("funnel", "Funnel de ventas"),
    ]
    for needle, bucket in buckets:
        if needle in text:
            return bucket
    if re.search(r"\babc\b|desde cero|socios nuevos|bootcamp|induccion", text):
        return "Fundamentos y onboarding"
    return "General"


def write_aggregate_docs(videos: list[dict[str, Any]]) -> None:
    with_tx = [video for video in videos if video.get("transcript_chars", 0) > 0]
    without_tx = [video for video in videos if video.get("transcript_chars", 0) == 0]

    themes: dict[str, list[dict[str, Any]]] = {}
    for video in videos:
        themes.setdefault(video_theme(video.get("title", "")), []).append(video)

    index_lines = [
        frontmatter(
            {
                "source_url": "https://www.youtube.com/@beglobalpro/videos",
                "author": "Be Global Pro",
                "contributor": "Codex",
                "source_file_type": "youtube_channel_index",
                "total_videos": len(videos),
                "videos_with_transcript": len(with_tx),
                "videos_without_transcript": len(without_tx),
            }
        ),
        "",
        "# Be Global Pro Knowledge Base - Channel Index",
        "",
        "This document aggregates the channel inventory so graphify can connect every video, including videos whose public captions were not accessible during ingestion.",
        "",
        "## Coverage",
        "",
        f"- Total videos inventoried: {len(videos)}",
        f"- Videos with transcript captured: {len(with_tx)}",
        f"- Videos without public transcript captured: {len(without_tx)}",
        f"- Transcript characters captured: {sum(video.get('transcript_chars', 0) for video in videos):,}",
        "",
        "## Topic Groups",
        "",
    ]
    for theme, group in sorted(themes.items()):
        index_lines.append(f"### {theme}")
        index_lines.append("")
        for video in group:
            status = "transcript captured" if video.get("transcript_chars", 0) else "metadata only"
            index_lines.append(
                f"- {video.get('title')} ({video.get('video_id')}): {status}. URL: {video.get('source_url')}"
            )
        index_lines.append("")
    (TARGET_DIR / "channel_inventory.md").write_text("\n".join(index_lines), encoding="utf-8")

    audit_lines = [
        frontmatter(
            {
                "source_url": "https://www.youtube.com/@beglobalpro/videos",
                "author": "Be Global Pro",
                "contributor": "Codex",
                "source_file_type": "youtube_ingestion_audit",
            }
        ),
        "",
        "# Transcript Capture Audit",
        "",
        "Videos below were inventoried but did not expose a usable public transcript in this environment.",
        "",
    ]
    for video in without_tx:
        err = (video.get("transcript_error") or "").replace("\n", " ")
        audit_lines.append(f"- {video.get('video_id')} - {video.get('title')} - {err[:220]}")
    (TARGET_DIR / "transcript_audit.md").write_text("\n".join(audit_lines), encoding="utf-8")


def main() -> int:
    manifest = json.loads((SOURCE_DIR / "manifest" / "videos.json").read_text(encoding="utf-8"))
    videos = manifest["videos"]
    clean_target()

    copied = 0
    for video in videos:
        if video.get("transcript_chars", 0) <= 0:
            continue
        src = Path(video["markdown_path"])
        if not src.exists():
            continue
        shutil.copy2(src, TARGET_DIR / "transcripts" / src.name)
        copied += 1

    write_aggregate_docs(videos)
    print(f"Graph corpus: {copied} transcript docs + 2 aggregate docs")
    print(TARGET_DIR)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
