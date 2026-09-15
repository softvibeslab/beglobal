# SP-002 · Entrega en revisión (prototipo local)

**Estado: cerrado.** Aceptación de producto registrada el 2026-09-15T16:07:00-05:00. Ver [CIERRE](CIERRE.md). Producción: NEEDS WORK.

## Abrir y revisar

[Demo en esta computadora](http://127.0.0.1:18765/) · [README](../../../beglobal/member-workspace/README.md).

1. Generar initData fixture para 900001 y abrir: Lucía, caducidad 15 min.
2. Cerrar sesión: el perfil desaparece; no es membresía vencida.
3. Generar para 900002 y abrir: Diego. Un userId extra en el JSON no elige al miembro.
4. Reutilizar el mismo initData: replay denegado.
5. Recorrer selector de escenario, aislamiento y teclado como en SP-001.

## Resultado del objetivo

HMAC de initData sintético intercambiado por sesión corta opaca ligada al mapeo servidor. Firma, bot, caducidad, replay y campos extra no conceden acceso.

Fuente evaluada: `0e6e09530645247eb950da34388f9c1c063b783d256774b02f4f30a21d557a54`. Plan aprobado: `4c93f0f0074345e893337f086e421dda5aa6e55fa17b12fa87a4291fa7271d22`.

| Historia | Evidencia | Resultado técnico | Decisión de Roger |
|---|---|---|---|
| BG-006 | [Cuatro criterios](evidencias/BG-006.md) | PASS local | Aceptada ([fuente](evidencias/ACEPTACION-20260915.md)) |

[Revisión técnica](REVISION-TECNICA.md): 43 backend, 22 navegador. Sin bot real ni producción.

## Control y costo

- 5 puntos comprometidos, **5 aceptados** al cierre. Nuevos cargos: 0 USD.
- Fuera de alcance: BG-007, BG-036, Hostinger, chat premium, bot real.
