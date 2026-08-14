# Modelo operativo

## Responsabilidades

- **Corporate:** aprueba método, permisos, conocimiento, gates y cambios sensibles.
- **Team:** prueba casos, revisa evidencia, registra defectos, da feedback y escala.
- **Member:** completa diagnóstico y una misión; comparte evidencia mínima propia.
- **Orchestrator:** detecta contexto y deriva al perfil correcto; no es superusuario.

## Ciclo de gobierno

```text
Corporate versiona método → Team prueba → Member ejecuta
→ Team documenta evidencia → Corporate decide aprobar, ajustar o detener
```

Las conversaciones y grafos generan señales; no modifican el método automáticamente.

## Gates

1. **Acuerdo:** sponsor, responsables, caso de uso, datos permitidos y criterios.
2. **Estabilización:** suite limpia, API única y riesgos P0 cerrados.
3. **Currículo mínimo:** diagnóstico, una ruta, una misión, recursos y rúbrica aprobados.
4. **Ensayo interno:** cuentas separadas, acceso negativo y flujo completo.
5. **Piloto humano:** 1 Corporate, 1 Team y 1–2 Members con observación controlada.

## Revisión humana obligatoria

- Pagos, reembolsos, reclamos, conflictos y asuntos legales/fiscales.
- Mensajes o publicaciones externas.
- Cambios de rol o permisos.
- Cambios de metodología y conocimiento aprobado.
- Acceso a métricas o datos individuales.

## Criterios de aceptación documentados

- Activación de participantes.
- Onboarding sin ayuda técnica.
- Primer valor en menos de 30 minutos.
- Diagnóstico correcto en casos de prueba.
- Entregable con QA.
- Cero acceso cruzado.
- Cero acción sensible sin aprobación.
- Satisfacción, soporte y costo medidos.

Estos criterios son objetivos documentados, no resultados logrados.

## Restricciones de acceso

Aplicar [matriz de permisos](../../hermes/BEGLOBAL_PERMISSIONS_MATRIX.md): Member solo datos propios; Team solo casos asignados; Corporate usa agregados salvo autorización; secretos nunca pasan por chat ni documentos. `DEV_BYPASS=1` es exclusivamente local.
