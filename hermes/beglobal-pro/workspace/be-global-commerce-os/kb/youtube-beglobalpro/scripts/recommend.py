#!/usr/bin/env python3
import json, re, sys, pathlib
BASE=pathlib.Path(__file__).resolve().parents[1]
INDEX=BASE/'video_index.jsonl'
items=[json.loads(l) for l in open(INDEX,encoding='utf-8')]
phase_terms={
 'F1_entender_modelo':['desde cero','empezar','iniciar','no sé','nuevo','ecommerce','dropshipping'],
 'F2_producto_nicho':['producto','nicho','tendencia','margen','ganancia','qué vender','ticket'],
 'F3_proveedor_margen':['proveedor','importar','mayoreo','inventario','cajas'],
 'F4_tienda_canal':['shopify','tienda','mercado libre','amazon','pasarela','pagos','subir productos','página de producto'],
 'F5_contenido_lanzamiento':['contenido','reels','video','viral','instagram','tiktok','canva','ia','imagen','carrusel'],
 'F6_ventas_cierre':['ventas','vender','cliente','confianza','ticket','oferta','cierre'],
 'F7_ads_tracking':['ads','pixel','campaña','anuncios','publicidad','meta'],
 'F8_optimizacion_escala':['optimizar','escalar','más ventas','temporada','hot sale','buen fin'],
 'F0_mentalidad':['miedo','excusa','acción','grabarme']
}

# 7 recursos base curados por Roger GV. Si el alumno toca uno de estos temas,
# conviene recomendar primero el video base antes de ir a videos más específicos.
core_topic_boosts = [
    (['dropshipping','modelo'], 'TLL47W4-2MI'),
    (['mercado libre','publicar en mercado','subir productos mercado'], 'VifyDQq_Kso'),
    (['shopify'], '9_KVpHvTtCw'),
    (['canales','canal de venta','dónde vender','donde vender'], 'YpFMT0Dtoa4'),
    (['contabilidad','finanzas','impuestos','gastos'], '-0ewXu18s7s'),
    (['reels','publicaciones','posts','contenido'], 'Y5B553dbYxo'),
    (['temporada','hot sale','buen fin'], 'M98f4XAD_Ks'),
]

def score(q,it):
    q=q.lower(); title=it['title'].lower(); s=0
    for word in re.findall(r'[\wáéíóúñ]+',q):
        if len(word)>3 and word in title: s+=3
        if len(word)>3 and word in (it.get('summary','')+' '+it.get('purpose','')+' '+it.get('watch_when','')).lower(): s+=1
    for ph,terms in phase_terms.items():
        if any(t in q for t in terms) and ph in it['phases']: s+=8
    for terms, video_id in core_topic_boosts:
        if it.get('id') == video_id and any(t in q for t in terms):
            s += 15
    if it.get('playlist_id')=='manual_beglobal_core': s+=3
    if it.get('playlist_id')=='PLB2yHEZRRHUbcs8oYALuFlXlpe8HCgA7n': s+=2
    if it['kind']=='video': s+=1
    s+=it.get('recommendation_score',1)
    return s

q=' '.join(sys.argv[1:]).strip()
if not q:
    print('Uso: recommend.py "usuario quiere crear tienda Shopify"'); sys.exit(1)
rank=sorted(((score(q,it),it) for it in items), reverse=True, key=lambda x:x[0])[:5]
for s,it in rank:
    print(f"[{s}] {it['title']}\n  {it['url']}\n  fases: {', '.join(it['phases'])} | intención: {', '.join(it['intents'])}")
    if it.get('summary'):
        print(f"  resumen: {it['summary']}")
    if it.get('purpose'):
        print(f"  propósito: {it['purpose']}")
    if it.get('next_task'):
        print(f"  tarea posterior: {it['next_task']}")
    print()
