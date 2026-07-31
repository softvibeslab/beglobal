#!/usr/bin/env python3
"""Build a Markdown corpus from the Be Global Pro YouTube channel.

The script prefers YouTube captions/transcripts and falls back to yt-dlp
subtitle downloads. It writes one Markdown file per video so graphify can
extract a clean, auditable knowledge graph from the channel.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yt_dlp

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except Exception:  # pragma: no cover - import failure is reported at runtime
    YouTubeTranscriptApi = None  # type: ignore[assignment]


CHANNEL_URL = "https://www.youtube.com/@beglobalpro/videos"
PILOT_URL = "https://www.youtube.com/watch?v=f5lKVWyaQZw"
OUT_DIR = Path("raw/youtube/beglobalpro")
LANGUAGES = ["es", "es-419", "es-MX", "en"]


@dataclass
class TranscriptResult:
    text: str
    source: str
    language: str | None = None
    error: str | None = None


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def yaml_scalar(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value).replace("\\", "\\\\").replace('"', '\\"')
    text = text.replace("\n", "\\n")
    return f'"{text}"'


def frontmatter(data: dict[str, Any]) -> str:
    lines = ["---"]
    for key, value in data.items():
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"  - {yaml_scalar(item)}")
        else:
            lines.append(f"{key}: {yaml_scalar(value)}")
    lines.append("---")
    return "\n".join(lines)


def clean_markdown_text(value: Any) -> str:
    if not value:
        return ""
    text = str(value).replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def slugify(value: str, fallback: str) -> str:
    value = value.lower()
    value = re.sub(r"https?://", "", value)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value[:80] or fallback


def format_upload_date(value: Any) -> str | None:
    if not value:
        return None
    text = str(value)
    if re.fullmatch(r"\d{8}", text):
        return f"{text[:4]}-{text[4:6]}-{text[6:8]}"
    return text


def video_url(video_id: str) -> str:
    return f"https://www.youtube.com/watch?v={video_id}"


def normalize_entry(entry: dict[str, Any]) -> dict[str, Any] | None:
    video_id = entry.get("id") or entry.get("url")
    if not video_id:
        return None
    if "watch?v=" in str(video_id):
        video_id = str(video_id).split("watch?v=", 1)[1].split("&", 1)[0]
    return {
        "id": str(video_id),
        "url": entry.get("url") or video_url(str(video_id)),
        "title": entry.get("title") or str(video_id),
    }


def extract_channel_index(channel_url: str) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    opts = {
        "quiet": True,
        "no_warnings": True,
        "ignoreerrors": True,
        "extract_flat": "in_playlist",
        "playlistend": None,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(channel_url, download=False)
    if not info:
        raise RuntimeError(f"Could not read channel: {channel_url}")
    entries = []
    seen: set[str] = set()
    for raw in info.get("entries") or []:
        if not raw:
            continue
        entry = normalize_entry(raw)
        if not entry or entry["id"] in seen:
            continue
        seen.add(entry["id"])
        entries.append(entry)
    return info, entries


def extract_video_info(url: str) -> dict[str, Any]:
    opts = {
        "quiet": True,
        "no_warnings": True,
        "ignoreerrors": False,
        "skip_download": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        return ydl.extract_info(url, download=False) or {}


def transcript_api_fetch(video_id: str) -> TranscriptResult:
    if YouTubeTranscriptApi is None:
        return TranscriptResult("", "youtube-transcript-api", error="module not available")
    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id, languages=LANGUAGES)
        snippets = transcript.to_raw_data()
        paragraphs = []
        current: list[str] = []
        last_start = None
        for snippet in snippets:
            text = clean_caption_line(snippet.get("text", ""))
            if not text:
                continue
            start = snippet.get("start")
            if last_start is not None and start is not None and start - last_start > 18 and current:
                paragraphs.append(" ".join(current))
                current = []
            current.append(text)
            last_start = start
        if current:
            paragraphs.append(" ".join(current))
        return TranscriptResult(
            text="\n\n".join(paragraphs).strip(),
            source="youtube-transcript-api",
            language=getattr(transcript, "language_code", None),
        )
    except Exception as exc:
        return TranscriptResult("", "youtube-transcript-api", error=str(exc))


def clean_caption_line(line: str) -> str:
    line = html.unescape(line)
    line = re.sub(r"<[^>]+>", "", line)
    line = line.replace("\ufeff", "")
    line = re.sub(r"\s+", " ", line)
    return line.strip()


def read_vtt(path: Path) -> str:
    lines: list[str] = []
    seen_recent: list[str] = []
    for raw in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw.strip()
        if not line:
            if lines and lines[-1] != "":
                lines.append("")
            continue
        if line.startswith("WEBVTT") or line.startswith("Kind:") or line.startswith("Language:"):
            continue
        if "-->" in line or re.fullmatch(r"\d+", line):
            continue
        line = clean_caption_line(line)
        if not line:
            continue
        if line in seen_recent:
            continue
        lines.append(line)
        seen_recent = (seen_recent + [line])[-5:]
    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def subtitle_fallback(url: str, video_id: str, subtitles_dir: Path) -> TranscriptResult:
    subtitles_dir.mkdir(parents=True, exist_ok=True)
    before = set(subtitles_dir.glob(f"{video_id}*"))
    opts = {
        "quiet": True,
        "no_warnings": True,
        "ignoreerrors": True,
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["es", "es-419", "es.*", "en"],
        "subtitlesformat": "vtt",
        "outtmpl": str(subtitles_dir / "%(id)s.%(ext)s"),
    }
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([url])
    except Exception as exc:
        return TranscriptResult("", "yt-dlp-subtitles", error=str(exc))
    candidates = sorted(set(subtitles_dir.glob(f"{video_id}*")) - before)
    if not candidates:
        candidates = sorted(subtitles_dir.glob(f"{video_id}*.vtt"))
    for candidate in candidates:
        if candidate.suffix.lower() != ".vtt":
            continue
        text = read_vtt(candidate)
        if text:
            return TranscriptResult(text, f"yt-dlp-subtitles:{candidate.name}")
    return TranscriptResult("", "yt-dlp-subtitles", error="no usable subtitle file")


def get_transcript(url: str, video_id: str, subtitles_dir: Path) -> TranscriptResult:
    primary = transcript_api_fetch(video_id)
    if primary.text:
        return primary
    fallback = subtitle_fallback(url, video_id, subtitles_dir)
    if fallback.text:
        if primary.error:
            fallback.error = f"primary failed: {primary.error}"
        return fallback
    return TranscriptResult(
        "",
        "none",
        error=f"{primary.source}: {primary.error}; {fallback.source}: {fallback.error}",
    )


def metadata_subset(info: dict[str, Any], fallback: dict[str, Any]) -> dict[str, Any]:
    video_id = info.get("id") or fallback["id"]
    title = info.get("title") or fallback.get("title") or video_id
    return {
        "source_url": video_url(video_id),
        "captured_at": utc_now(),
        "author": info.get("channel") or info.get("uploader") or "Be Global Pro",
        "contributor": "Codex",
        "channel": info.get("channel") or "Be Global Pro",
        "channel_id": info.get("channel_id"),
        "video_id": video_id,
        "title": title,
        "published_at": format_upload_date(info.get("upload_date") or info.get("timestamp")),
        "duration_seconds": info.get("duration"),
        "view_count": info.get("view_count"),
        "like_count": info.get("like_count"),
        "categories": info.get("categories") or [],
        "tags": (info.get("tags") or [])[:20],
    }


def write_video_markdown(
    info: dict[str, Any],
    fallback: dict[str, Any],
    transcript: TranscriptResult,
    out_dir: Path,
) -> Path:
    meta = metadata_subset(info, fallback)
    meta["caption_source"] = transcript.source
    meta["caption_language"] = transcript.language
    meta["transcript_error"] = transcript.error
    filename = f"{meta['video_id']}-{slugify(meta['title'], meta['video_id'])}.md"
    path = out_dir / "transcripts" / filename
    path.parent.mkdir(parents=True, exist_ok=True)

    description = clean_markdown_text(info.get("description"))
    chapters = info.get("chapters") or []
    chapter_lines = []
    for chapter in chapters:
        start = chapter.get("start_time")
        title = chapter.get("title")
        if title:
            chapter_lines.append(f"- {start}s: {title}")

    body = [
        frontmatter(meta),
        "",
        f"# {meta['title']}",
        "",
        "## Video",
        "",
        f"- URL: {meta['source_url']}",
        f"- Canal: {meta['channel']}",
        f"- Publicado: {meta['published_at'] or 'desconocido'}",
        f"- Duracion: {meta['duration_seconds'] or 'desconocida'} segundos",
        f"- Vistas al capturar: {meta['view_count'] or 'desconocidas'}",
        "",
    ]
    if description:
        body.extend(["## Descripcion", "", description, ""])
    if chapter_lines:
        body.extend(["## Capitulos", "", *chapter_lines, ""])
    if transcript.text:
        body.extend(["## Transcript", "", transcript.text, ""])
    else:
        body.extend(
            [
                "## Transcript",
                "",
                "Transcript no disponible en captions publicas al momento de captura.",
                "",
            ]
        )
    path.write_text("\n".join(body), encoding="utf-8")
    return path


def write_channel_docs(
    channel_info: dict[str, Any],
    videos: list[dict[str, Any]],
    out_dir: Path,
    captured_at: str,
) -> None:
    manifest_dir = out_dir / "manifest"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    (manifest_dir / "videos.json").write_text(
        json.dumps({"captured_at": captured_at, "channel": channel_info, "videos": videos}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    channel_meta = {
        "source_url": CHANNEL_URL,
        "captured_at": captured_at,
        "author": channel_info.get("channel") or channel_info.get("uploader") or "Be Global Pro",
        "contributor": "Codex",
        "channel_id": channel_info.get("channel_id"),
        "title": channel_info.get("title") or "Be Global Pro",
        "playlist_count": channel_info.get("playlist_count"),
        "subscriber_count": channel_info.get("channel_follower_count"),
        "tags": channel_info.get("tags") or [],
    }
    lines = [
        frontmatter(channel_meta),
        "",
        "# Be Global Pro - Indice del canal",
        "",
        clean_markdown_text(channel_info.get("description")),
        "",
        "## Videos capturados",
        "",
    ]
    for idx, video in enumerate(videos, 1):
        status = "transcript" if video.get("transcript_chars", 0) else "sin transcript"
        lines.append(f"{idx}. [{video['title']}]({video['source_url']}) - {status}")
    (out_dir / "channel_index.md").write_text("\n".join(lines), encoding="utf-8")


def load_existing_manifest(out_dir: Path) -> dict[str, Any]:
    path = out_dir / "manifest" / "videos.json"
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--channel-url", default=CHANNEL_URL)
    parser.add_argument("--pilot-url", default=PILOT_URL)
    parser.add_argument("--out-dir", default=str(OUT_DIR))
    parser.add_argument("--limit", type=int, default=0, help="Limit videos for testing; 0 means all.")
    parser.add_argument("--refresh", action="store_true", help="Refetch even when Markdown exists.")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    subtitles_dir = out_dir / "subtitles"
    captured_at = utc_now()

    channel_info, entries = extract_channel_index(args.channel_url)

    pilot_id = args.pilot_url.split("watch?v=", 1)[-1].split("&", 1)[0]
    if pilot_id and all(entry["id"] != pilot_id for entry in entries):
        entries.insert(0, {"id": pilot_id, "url": video_url(pilot_id), "title": pilot_id})

    if args.limit:
        entries = entries[: args.limit]

    previous = load_existing_manifest(out_dir)
    previous_by_id = {video.get("video_id"): video for video in previous.get("videos", [])}
    videos: list[dict[str, Any]] = []

    for index, entry in enumerate(entries, 1):
        video_id = entry["id"]
        existing_path = None
        for candidate in (out_dir / "transcripts").glob(f"{video_id}-*.md"):
            existing_path = candidate
            break
        if existing_path and not args.refresh:
            prior = previous_by_id.get(video_id, {})
            videos.append(
                {
                    **prior,
                    "video_id": video_id,
                    "title": prior.get("title") or entry.get("title") or video_id,
                    "source_url": video_url(video_id),
                    "markdown_path": str(existing_path),
                    "skipped_existing": True,
                    "transcript_chars": prior.get("transcript_chars", 0),
                }
            )
            print(f"[{index}/{len(entries)}] skip existing {video_id}")
            continue

        print(f"[{index}/{len(entries)}] fetch {video_id} {entry.get('title', '')}", flush=True)
        try:
            info = extract_video_info(video_url(video_id))
        except Exception as exc:
            info = {"id": video_id, "title": entry.get("title"), "extract_error": str(exc)}
        transcript = get_transcript(video_url(video_id), video_id, subtitles_dir)
        path = write_video_markdown(info, entry, transcript, out_dir)
        meta = metadata_subset(info, entry)
        videos.append(
            {
                **meta,
                "source_url": video_url(video_id),
                "markdown_path": str(path),
                "caption_source": transcript.source,
                "caption_language": transcript.language,
                "transcript_error": transcript.error,
                "transcript_chars": len(transcript.text),
            }
        )

    write_channel_docs(channel_info, videos, out_dir, captured_at)
    print(f"Wrote {len(videos)} videos to {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
