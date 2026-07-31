# Perfiles Hermes — Be Global Pro

Este directorio contiene los tres perfiles acordados para el piloto Be Global:

| Perfil | Usuario | Responsabilidad |
|---|---|---|
| `beglobal-corporate` | Propietario o responsable corporativo | Gobernar método, permisos, calidad y métricas |
| `beglobal-team` | Coach, soporte, ventas u operación interna | Probar, operar, documentar y escalar |
| `beglobal-member` | Miembro o socio piloto | Recibir diagnóstico y ejecutar una misión guiada |

`beglobal-pro/` se conserva como fuente de referencia. No debe clonarse como perfil nuevo porque contiene estado de ejecución, sesiones, credenciales, tokens, cachés y memoria histórica.

## Principios compartidos

1. Diagnosticar antes de recomendar.
2. Dar entre una y tres acciones por respuesta.
3. Pedir evidencia: link, captura, producto, margen, copy o conversación.
4. No prometer ventas, ingresos ni productos ganadores.
5. No ejecutar pagos, reembolsos, reclamos o acciones delicadas sin humano.
6. Mantener memoria, credenciales y datos separados por perfil y usuario.
7. Empezar con acceso de lectura o borrador; habilitar escrituras solo después de QA.
8. Telegram es el canal inicial recomendado para el piloto.

## Estado de seguridad

Los perfiles se entregan sin secretos y sin integraciones activas. Sus `config.yaml`:

- habilitan redacción de secretos y PII;
- usan aprobación manual;
- excluyen MCPs mediante `no_mcp`;
- limitan toolsets por rol;
- no contienen IDs de chats ni tokens.

Las conexiones se realizan durante el onboarding de setup mediante OAuth o secretos propios de cada perfil. Nunca se debe copiar:

- `.env`;
- `auth.json`;
- `credentials/`;
- tokens de Google, Telegram o marketplaces;
- `state.db`;
- sesiones, logs, cachés, locks o estado del gateway.

## Activación

Antes de activar un perfil en una instalación Hermes:

1. Revisar `PROFILE.md`, `PERMISSIONS.md` y `SOUL.md`.
2. Completar el onboarding en `workspace/onboarding/`.
3. Crear el perfil limpio en el host destino.
4. Copiar únicamente los archivos declarativos de esta carpeta.
5. Configurar autenticación de modelo y canal de forma independiente.
6. Ejecutar los escenarios de `tests/`.
7. Habilitar integraciones una por una, después de su prueba en lectura o borrador.

## Fuentes

- `beglobal/meetings/Meeting Transcription (9).txt`
- `beglobal/meetings/summary.md`
- `beglobal/meetings/prompt.md`
- `beglobal/dataset/research.md` — actualmente vacío; debe completarse antes de considerarlo evidencia.
- `hermes/beglobal-pro/SOUL.md`
- `hermes/beglobal-pro/skills/beglobal/`
- `hermes/beglobal-pro/workspace/be-global-commerce-os/`

