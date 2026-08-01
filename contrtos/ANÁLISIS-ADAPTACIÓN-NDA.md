# ANÁLISIS Y ADAPTACIÓN DEL NDA BEGLOBAL

## Resumen Ejecutivo

Se ha adaptado el **NDA de Cemex-Proveedor** (formato español para Open Projects, RFPs, RFIs) al contexto específico de **BeGlobal** (SoftvibesLab), manteniendo la estructura, rigor legal y protecciones de la plantilla original.

---

## ANÁLISIS DEL PROYECTO BEGLOBAL

### Tipo de Proyecto
- **Naturaleza**: Plataforma de conocimiento integrada (monorepo)
- **Stack Tecnológico**: 
  - Next.js 16 + React 19 + TypeScript (frontend)
  - Node.js (backend/APIs)
  - GraphRAG (análisis de grafos)
  - Herramientas de ingesta de datos
  
### Servicios Ofertados
1. **Desarrollo de software** (dashboard, miniapps, plataformas)
2. **Consultoría tecnológica** (arquitectura, diseño de sistemas)
3. **Soluciones de IA/ML** (análisis de grafos, procesamiento de datos)
4. **APIs y integraciones** (sistemas terceros)
5. **Procesamiento de datos** y base de conocimiento

### Ubicación Legal
- **Repositorio**: GitHub (softvibeslab/beglobal)
- **Jurisdicción Original**: México (Monterrey, Nuevo León - Cemex)
- **Jurisdicción Adaptada**: Ciudad de México (neutral, centralizada)

---

## CAMBIOS PRINCIPALES RESPECTO A CEMEX

### 1. **Identificación de Partes**
| Aspecto | Cemex | BeGlobal |
|---------|-------|----------|
| Empresa Principal | Cemex Operaciones México, S.A. de C.V. | BeGlobal (SoftvibesLab) |
| Tipo de Servicios | Soluciones tecnológicas genéricas | Desarrollo, consultoría, APIs, IA/ML |
| Ubicación | Ave. Ricardo Margaín Zozaya, San Pedro Garza García, N.L. | [***] Ciudad de México |

### 2. **Extensión de Definición de Información Confidencial**

#### Adiciones para BeGlobal:
- **APIs y frameworks** específicos del stack tecnológico
- **Código fuente** y arquitecturas de software
- **Estructuras de datos** y esquemas de bases de datos
- **Modelos de aprendizaje automático** (ML models)
- **Algoritmos propietarios** de procesamiento

**Justificación**: BeGlobal es una empresa de software, por lo que el código, arquitecturas y algoritmos son activos más críticos que en servicios genéricos.

### 3. **Obligaciones Técnicas Reforzadas**

#### Cláusula 2(v) - Ingeniería Inversa
```
ORIGINAL (Cemex):
"No realizar actos de ingeniería inversa, ni de descompilación, 
ni de desmantelamiento de ningún código de software y/o aparatos 
de hardware no comercializados"

ADAPTADO (BeGlobal):
"No realizar actos de ingeniería inversa, ni de descompilación, 
ni de desmantelamiento de ningún código de software, arquitecturas, 
APIs y/o aparatos de hardware no comercializados"
```

**Razón**: Refuerza protección de arquitecturas y interfaces de API, críticas en desarrollo de software.

### 4. **Período de Confidencialidad**

**Ambos mantienen**: 5 años post-revelación ✓

---

## ESTRUCTURA CONSERVADA (SAME AS CEMEX)

### Secciones Idénticas:
1. ✓ Definición de Información Confidencial y excepciones (4 excepciones estándar)
2. ✓ Obligaciones principales (5 obligaciones)
3. ✓ Excepciones por orden judicial (requisitos de notificación)
4. ✓ Revelación a empleados/subcontratistas (responsabilidad de la Parte)
5. ✓ Notificación de incumplimiento
6. ✓ Devolución o destrucción de información
7. ✓ Daños por incumplimiento (daño irreparable)
8. ✓ Término: 3 años + 30 días de notificación
9. ✓ Disposiciones generales (propiedad intelectual, enmiendas, cesión, comunicaciones)
10. ✓ Ley Aplicable y Jurisdicción

---

## CAMBIOS JURISDICCIONALES

### Cemex
```
Ley Aplicable: Estado de Nuevo León
Jurisdicción: Tribunales de Monterrey, Nuevo León
```

### BeGlobal
```
Ley Aplicable: Ciudad de México
Jurisdicción: Tribunales de la Ciudad de México
```

**Justificación**: BeGlobal opera desde Ciudad de México. Centraliza jurisdicción, facilita acceso a tribunales especializados en TI/software.

---

## CAMPOS A COMPLETAR [***]

El documento incluye espacios reservados para adaptación específica:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `[***]` Nombre Proveedor | Nombre legal de la otra Parte | Ejemplo Corp, S.A. de C.V. |
| Domicilio Proveedor | Oficina legal del proveedor | Avenida X #123, Mexico City |
| Contacto Proveedor | Representante legal | Juan Pérez García |
| Email Proveedor | Correo de contacto | legal@ejemplo.com |
| Fecha Firma | Día/Mes/Año | 31/07/2026 |
| Domicilio BeGlobal | Oficina legal (completar) | [Pendiente definir] |
| Contacto BeGlobal | Representante legal | Roger [Apellido] |

---

## RECOMENDACIONES ANTES DE USAR

### ✅ Antes de Firmar:

1. **Completar todos los campos [***]** - No dejar espacios en blanco
2. **Validar jurisdicción** - Confirmar que CDMX es aceptable para ambas partes
3. **Revisar Cláusula 5(e)** - Ley Aplicable y Tribunales competentes
4. **Definir contactos** - Actualizar domicilios y emails de BeGlobal
5. **Especificar Proyectos** - En Considerandos, detallar proyectos específicos si aplica

### ⚠️ Ajustes Adicionales Recomendados:

#### Si hay transferencia internacional:
- Agregar cláusula GDPR si proveedor es EU
- Especificar protección de datos personales

#### Si hay servicio en la nube:
- Expandir definición de "Información Confidencial" para incluir:
  - Backup y copias en servidores
  - Logs de acceso
  - Metadatos de transacciones

#### Si hay integración con terceros:
- Revisar Cláusula 2(c) sobre subcontratistas
- Asegurar que proveedores firmen acuerdos similares

---

## COMPARATIVA: CEMEX vs BEGLOBAL

### Similitudes (Mantienen protecciones igual)
- ✓ Período confidencialidad: 5 años
- ✓ Vigencia: 3 años + 30 días notificación
- ✓ Obligaciones core idénticas
- ✓ Excepción por orden judicial
- ✓ Responsabilidad compartida
- ✓ No genera obligación contractual de compra

### Diferencias (Adaptadas a BeGlobal)
| Aspecto | Cemex | BeGlobal |
|---------|-------|----------|
| Tipo Empresa | Manufactura/Servicios | SaaS/Software |
| Activos Protegidos | Generales | APIs, código, arquitecturas |
| Jurisdicción | Monterrey, N.L. | CDMX |
| Contacto | Oscar Balmore Elizondo | [Pendiente] |

---

## USO DEL DOCUMENTO

### Flujo Típico:
1. **Recepción RFI/RFP** → BeGlobal envía este NDA
2. **Revisión Proveedor** → 3-5 días, puede sugerir cambios
3. **Negociación** → Si hay cambios, iterar sobre el documento
4. **Firma** → Ambas partes firman y archivan

### Válido Para:
- ✅ Solicitudes de información (RFI)
- ✅ Solicitudes de propuestas (RFP)
- ✅ Evaluar proveedores
- ✅ Compartir roadmap/especificaciones técnicas
- ✅ Intercambio de arquitecturas/diseños

### NO Válido Para:
- ❌ Contratos de servicio (necesita T&C separado)
- ❌ Relaciones de empleo (necesita acuerdo confidencialidad empleado)
- ❌ Licencias de software (necesita licencia específica)

---

## PRÓXIMOS PASOS

1. **Verificar datos BeGlobal** (domicilio, representante legal, email)
2. **Adaptar a versión Word/PDF** si es requerido (convertir MD → DOCX)
3. **Archivar en contrtos/** como plantilla corporativa
4. **Usar en cada RFI/RFP** con proveedores/clientes
5. **Revisar anualmente** con asesor legal

---

**Documento Generado**: 2026-07-31  
**Basado en**: NDA Cemex-Proveedor (formato en español para Open Projects, RFPs, RFIs)  
**Adaptación**: BeGlobal/SoftvibesLab
