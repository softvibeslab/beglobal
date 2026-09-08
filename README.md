# Be Global PRO · Grafo público

[Abrir la academia y el inventario](https://softvibeslab.github.io/beglobal/) · [Explorar el grafo](https://softvibeslab.github.io/beglobal/graph.html)

Edición pública autorizada por Roger del mapa académico construido con Graphify, corte 2026-09-08. Se publica una copia aislada; las bases y perfiles privados permanecen intactos.

- 50 cursos, 1.181 lecciones, 1.777 nodos, 3.897 conexiones y 4.242 registros de evidencia; 98 comunidades.
- 987 aportes por título INFERRED y 194 AMBIGUOUS: son referencias, no enseñanzas verificadas.
- 94 lecciones tienen ASR en la base privada; 1.087 no cuentan con transcripción local. Se incluyen solo los resúmenes y relaciones existentes, no las transcripciones ni los videos.
- Las aplicaciones a casos de uso y capacidades del agente son propuestas pendientes de revisión Corporate. La autorización de publicación no cambia esta condición ni activa Hermes.

El inventario permite buscar y filtrar referencias. El grafo permite explorar comunidades, nodos, resúmenes y evidencias. Los enlaces oficiales pueden requerir una cuenta de la academia.

## Archivos

- `graph.json`: estructura Graphify compatible con NetworkX, con evidencias agrupadas por conexión.
- `extraction.json`: todos los registros originales, con procedencia saneada.
- `lesson-reference-index.json` y `APORTES_POR_LECCION.csv`: inventario de aportes por lección.
- `APORTES_POR_CURSO.md`: aportes potenciales por curso.
- `sources.html` / `sources.json`: fichas de procedencia con identificadores opacos y referencias oficiales; no revelan rutas internas ni publican fuentes completas.
- `PUBLICATION.json`: alcance, recuentos y hashes de los archivos exportados.

No se incluyen credenciales, cookies, URLs de reproducción, videos, transcripciones completas, adjuntos del curso, datos de miembros ni configuraciones del agente. Las fuentes pueden ser históricas; el mapa no sustituye asesoría profesional vigente.

## Uso local y atribución

Descarga esta rama y abre `index.html`; el visor y su biblioteca funcionan sin servicios externos. La navegación a las referencias oficiales sí necesita Internet.

La visualización fue generada con Graphify. La biblioteca incluida es vis-network 9.1.6, bajo sus licencias Apache-2.0/MIT indicadas en el encabezado del archivo. Los contenidos y marcas conservan los derechos de sus respectivos titulares; hacer público el mapa no concede una licencia general sobre los cursos.
