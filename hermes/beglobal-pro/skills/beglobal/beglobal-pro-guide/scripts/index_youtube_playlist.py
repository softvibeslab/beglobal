#!/usr/bin/env python3
"""Index a Be Global Pro YouTube playlist into a local recommender KB.

Usage:
  python scripts/index_youtube_playlist.py PLAYLIST_URL /path/to/kb/youtube-beglobalpro

Creates/updates:
  - playlist_capacitaciones_expertos.jsonl
  - playlist_capacitaciones_expertos.csv
  - playlist_capacitaciones_expertos.md
  - enriches video_index.jsonl when matching IDs exist

Requires yt-dlp on PATH. If transcripts are unavailable, this script still builds a useful
metadata-based index and marks transcript_status as blocked_or_pending.
"""
import csv
import json
import pathlib
import re
import subprocess
import sys
import tempfile


def norm_title(title: str) -> str:
    title = re.sub(r"^[^\wáéíóúÁÉÍÓÚñÑ¿¡]+\s*", "", title or "").strip()
    return re.sub(r"\s*\|\s*Clase.*$", "", title, flags=re.I).strip()


def classify(title: str):
    low = (title or "").lower()
    phases, intents = [], []

    def add(phase, intent):
        if phase not in phases:
            phases.append(phase)
        if intent not in intents:
            intents.append(intent)

    if any(k in low for k in ["desde cero", "primeros pasos", "primeras ventas", "negocio digital", "ecommerce", "dropshipping"]):
        add("F1_entender_modelo", "aprender_desde_cero")
    if any(k in low for k in ["producto", "nicho", "tendencia", "margen", "ganancia", "ticket"]):
        add("F2_producto_nicho", "elegir_o_mejorar_producto")
    if any(k in low for k in ["proveedor", "importar", "importación", "inventario", "mayoreo", "china", "cajas"]):
        add("F3_proveedor_margen", "proveedores_margen")
    if any(k in low for k in ["shopify", "tienda", "página de producto", "mercado libre", "amazon", "pasarela", "pagos", "subir productos", "checkout"]):
        add("F4_tienda_canal", "configurar_tienda_canal")
    if any(k in low for k in ["reels", "videos", "video", "viral", "instagram", "tiktok", "canva", "imágenes", "imagenes", "redes", "carrusel", "marca", "ia", "grabar", "capcut"]):
        add("F5_contenido_lanzamiento", "crear_contenido")
    if any(k in low for k in ["ventas", "vender", "cliente", "confianza", "ticket", "oferta", "cierre", "whatsapp", "dm"]):
        add("F6_ventas_cierre", "ventas_cierre")
    if any(k in low for k in ["ads", "pixel", "campaña", "anuncios", "publicidad", "meta"]):
        add("F7_ads_tracking", "ads_tracking")
    if any(k in low for k in ["temporada", "maximiza", "optimiza", "escala", "aumentar"]):
        add("F8_optimizacion_escala", "optimizar_escalar")
    if any(k in low for k in ["miedo", "grabarte", "mentalidad", "bloqueo"]):
        add("F0_mentalidad", "desbloqueo_mental")
    if not phases:
        add("F6_ventas_cierre", "guia_general")
    return phases, intents


def summary(title: str) -> str:
    clean = norm_title(title)
    low = clean.lower()
    if "parte 2" in low:
        return f"Continuación práctica de “{clean}”, enfocada en aterrizar estructura, elementos y ajustes para mejorar conversión."
    if low.startswith(("cómo", "como")):
        return f"Clase paso a paso sobre {clean[5:].strip()}."
    return f"Clase de apoyo sobre {clean} aplicada a ecommerce/dropshipping."


def purpose(title: str) -> str:
    clean = norm_title(title)
    low = clean.lower()
    if "página de producto" in low:
        return "Guiar al alumno a estructurar una página/ficha de producto que comunique valor, confianza y CTA claro."
    if "ticket" in low:
        return "Ayudar a aumentar el valor promedio por pedido usando oferta, bundles, upsells o mejor presentación de valor."
    if "videos virales" in low or "reels" in low or "publicaciones" in low:
        return "Dar estructura práctica para crear contenido que atraiga atención y lleve a la venta sin empezar desde cero."
    if "confianza" in low:
        return "Mostrar elementos que reducen desconfianza en tienda online y mejoran la decisión de compra."
    if "shopify" in low:
        return "Acompañar configuración o uso de Shopify para que la tienda pueda recibir y presentar productos correctamente."
    if "pixel" in low or "ads" in low or "meta" in low:
        return "Guiar configuración de medición/publicidad para preparar campañas y seguimiento."
    if "ia" in low:
        return "Enseñar uso práctico de IA para crear recursos de ecommerce: imágenes, videos, ideas o contenido."
    if "mercado libre" in low:
        return "Orientar publicación y optimización dentro de Mercado Libre, verificando políticas actuales de la plataforma."
    if "amazon" in low:
        return "Orientar preparación y publicación en Amazon, verificando requisitos y políticas actuales."
    return "Complementar la guía del chat con una clase práctica de Be Global Pro relacionada con la petición del alumno."


def next_task(title: str) -> str:
    low = (title or "").lower()
    if any(k in low for k in ["video", "reels", "carrusel", "instagram", "redes", "imágenes", "imagenes", "ia", "capcut"]):
        return "Crear 1 pieza de contenido y enviarla para revisar gancho, claridad y CTA."
    if "shopify" in low or "tienda" in low:
        return "Hacer el ajuste en la tienda y mandar captura/link para validar."
    if "pixel" in low or "ads" in low:
        return "Verificar configuración en la plataforma actual y mandar captura del estado."
    if "producto" in low:
        return "Aplicar la estructura al producto actual y enviar link/captura para revisión."
    return "Ver la clase, aplicar el primer cambio y regresar con captura/link para continuar."


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        raise SystemExit(2)
    playlist_url, kb_dir = sys.argv[1], pathlib.Path(sys.argv[2])
    kb_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(suffix=".json") as tmp:
        subprocess.run(["yt-dlp", "--flat-playlist", "--dump-single-json", playlist_url], check=True, stdout=tmp)
        tmp.flush()
        data = json.load(open(tmp.name, encoding="utf-8"))

    records = []
    for entry in data.get("entries") or []:
        title = entry.get("title") or ""
        if "private video" in title.lower() or "deleted video" in title.lower():
            continue
        vid = entry.get("id") or entry.get("url")
        phases, intents = classify(title)
        url = entry.get("url") if str(entry.get("url", "")).startswith("http") else f"https://www.youtube.com/watch?v={vid}"
        records.append({
            "playlist_id": data.get("id"),
            "playlist_title": data.get("title"),
            "position": len(records) + 1,
            "id": vid,
            "title": title,
            "url": url,
            "phases": phases,
            "intents": intents,
            "summary": summary(title),
            "purpose": purpose(title),
            "watch_when": f"Recomendar cuando el alumno pida ayuda con: {norm_title(title).lower()}.",
            "next_task": next_task(title),
            "transcript_status": "blocked_or_pending",
            "source_note": "Indexado desde metadata pública de playlist; enriquecer con transcripción cuando esté disponible."
        })

    stem = "playlist_capacitaciones_expertos"
    (kb_dir / f"{stem}.jsonl").write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in records) + "\n", encoding="utf-8")
    with (kb_dir / f"{stem}.csv").open("w", encoding="utf-8", newline="") as f:
        fields = ["position", "id", "title", "url", "phases", "intents", "summary", "purpose", "watch_when", "next_task"]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in records:
            row = {k: r.get(k, "") for k in fields}
            row["phases"] = ";".join(r["phases"])
            row["intents"] = ";".join(r["intents"])
            writer.writerow(row)

    md = ["# Playlist indexada — Capacitaciones en vivo de expertos", "", f"Playlist: {data.get('title')} ({data.get('id')})", f"Total indexado: {len(records)} videos públicos/disponibles.", "", "Uso en chat: recomendar máximo 1–2 videos, pedir que el alumno los vea/aplique, y quedarse en modo espera para recibir evidencia/feedback antes de continuar.", ""]
    for r in records:
        md += [f"## {r['position']}. {r['title']}", f"Link: {r['url']}", f"Fase: {', '.join(r['phases'])}", f"Intención: {', '.join(r['intents'])}", f"Resumen: {r['summary']}", f"Propósito: {r['purpose']}", f"Cuándo recomendarlo: {r['watch_when']}", f"Tarea posterior: {r['next_task']}", ""]
    (kb_dir / f"{stem}.md").write_text("\n".join(md), encoding="utf-8")

    print(f"OK: {len(records)} videos indexados en {kb_dir}")


if __name__ == "__main__":
    main()
