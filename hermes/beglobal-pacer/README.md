# Be Global Pacer

Perfil Hermes derivado del proyecto Áureo (`../../aureo/`) para Be Global Pro. Creado el 2026-09-08 en la fase 0 del plan. No se activó, desplegó ni conectó a un bot.

Perfil de ritmo y seguimiento para Be Global Pro: vigila la actividad de miembros asignados, prepara recordatorios con cadencia 1-2-3-5-8-13 días, detecta misiones mal calibradas y escala riesgo de abandono a Team. No envía mensajes por su cuenta.

## Inicio rápido

1. Leer `PROFILE.md`, `SOUL.md` y `PERMISSIONS.md`.
2. Completar el onboarding en `workspace/onboarding/`.
3. Ejecutar los escenarios de `tests/`.
4. Mantener MCPs desactivados.
5. Verificar que `aureo/` está disponible y sus pruebas pasan: `cd aureo && python3 -m unittest discover tests`.

## Estado inicial

- Sin bot o chat autorizado.
- Sin MCPs.
- Sin secretos.
- Memoria limpia.
- Aprobación manual.
- Todas las reglas Áureo que aplica son heurísticas INFERRED en validación.
