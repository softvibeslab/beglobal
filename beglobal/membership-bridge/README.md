# Puente de membresías · BeGlobal

Biblioteca Python 3.10+ sin dependencias externas, desacoplada de la API real de BeGlobal. Autoridad confirmada por Roger: su plataforma. Implementación local de la frontera y reglas fail-closed; **no conectada ni desplegada**.

## Ya construido

- Interfaz `MembershipProvider`, mapeo de identidad `IdentityMapping`, snapshot normalizado y decisión de acceso académico.
- Provider deshabilitado por defecto; fixtures rechazados en staging/producción.
- Timeout acotado, datos/tipos/identidad/frescura/vigencia validados y errores sanitizados.
- Sin caché positiva ni fallback que conceda PRO al fallar; verificación por llamada, segura entre miembros concurrentes.
- Pruebas sintéticas de contrato y fallo. No se lee `.env`, no se abre DB ni se consume red al importar.

```sh
python3 -m unittest discover -s beglobal/membership-bridge -p 'test_*.py' -v
```

## Por conectar

Implementar el adaptador real que obtiene/valida datos desde BeGlobal y los transforma a `MembershipSnapshot`, y el resolver de enlaces verificados desde la base canónica. Se inyectan en `MembershipBridge(mapping, provider, environment=...)`; no editar el resto del dominio de misiones, planes o frontend. El provider de desarrollo usa estado `development`; `production_verified` sólo se configura tras evidencia de conformance y autorización del despliegue, nunca desde requests.

`check(person_id)` debe invocarse **después** de autenticar al usuario. La librería no expone HTTP ni decide roles, planes, negocios o permisos de un asset. `can_read_pro=True` sólo acredita el componente académico hasta `valid_until`; la política completa sigue siendo obligatoria y debe reconsultar ante revocaciones. No cachear más allá de ese plazo ni inferir que la decisión es un token portable.

Pendientes de la plataforma: endpoint/TLS, auth y custodia de credenciales, ID estable, estados/fechas, rate limits, sandbox, formato/firma de eventos, orden/reconciliación y observabilidad. El adapter debe usar I/O asíncrono cancelable y timeout; una llamada bloqueante de tercero no se vuelve segura por este wrapper. Si entrega datos cacheados, debe preservar `observed_at` real y bajas conocidas.

No se implementa receptor genérico de webhooks con firma inventada, base de identidades real, servidor productivo ni caché distribuida. Esos componentes dependen del contrato de BeGlobal. Ver [SPEC del puente](../../SPECS/18-puente-plataforma-beglobal.md).
