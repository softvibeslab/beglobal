#!/usr/bin/env python3
"""Local, dependency-free Scrum control. Never approves, starts or deploys a sprint.

--render only regenerates derived Markdown and a validation report.
Manual planning/status changes remain explicit edits of the source JSON + evidence.
"""

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTROL = ROOT / "SCRUM"
STORY_STATES = {"proposed", "ready", "committed", "in_progress", "blocked", "in_review", "done"}
SPRINT_STATES = {"proposed", "approved", "active", "in_review", "closed", "cancelled"}
STORY_PLANNING_FIELDS = (
    "id", "epic", "title", "type", "narrative", "points", "priority", "scores",
    "requirements", "specs", "dependencies", "gates", "scope", "assignment",
)
SPRINT_RUNTIME_FIELDS = {"status", "approval", "changes", "history", "review"}


def read_sources():
    return (
        json.loads((CONTROL / "backlog.json").read_text()),
        json.loads((CONTROL / "sprints.json").read_text())["sprints"],
    )


def story_value(backlog, story, key):
    return story.get(key, backlog["story_defaults"].get(key))


def assignment(backlog, story):
    return {**backlog["assignment_defaults"], **story.get("assignment", {})}


def planning_payload(backlog, sprint):
    """Freeze scope, ACs, owners, limits and working agreement, not execution state."""
    selected = {s["id"]: s for s in backlog["stories"]}
    stories = []
    for sid in sprint["stories"]:
        story = selected[sid]
        item = {key: story[key] for key in STORY_PLANNING_FIELDS if key in story}
        item["acceptance_criteria"] = story["acceptance_criteria"]
        item["tasks"] = [
            {key: task[key] for key in ("id", "title", "owner")}
            for task in story.get("tasks", [])
        ]
        stories.append(item)
    supporting = [
        "METODOLOGIA.md", "OPERACION.md", "sprints/SP-001/ARRANQUE.md",
    ]
    # Later sprints use their own intake file, never silently SP-001's.
    supporting[2] = f"sprints/{sprint['id']}/ARRANQUE.md"
    return {
        "schema_version": "1.0",
        "sprint": {k: v for k, v in sprint.items() if k not in SPRINT_RUNTIME_FIELDS},
        "assignments": backlog["assignment_defaults"],
        "stories": stories,
        "working_agreement_sha256": {
            name: hashlib.sha256((CONTROL / name).read_bytes()).hexdigest()
            for name in supporting
        },
    }


def canonical_hash(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def plan_hash(backlog, sprint):
    return canonical_hash(planning_payload(backlog, sprint))


def score(story):
    value, impact, risk = story["scores"]
    ease = {1: 5, 2: 4, 3: 3, 5: 2, 8: 1}[story["points"]]
    return round(.40 * value + .30 * impact + .15 * risk + .15 * ease, 2)


def local_file(reference):
    if not isinstance(reference, str) or not reference.strip():
        return False
    path = (CONTROL / reference.split("#", 1)[0]).resolve()
    return path.is_relative_to(ROOT) and path.is_file()


def aware_timestamp(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else None
    except ValueError:
        return None


def validate(backlog, sprints):
    errors, notes = [], []
    checks = 0

    def check(condition, message):
        nonlocal checks
        checks += 1
        if not condition:
            errors.append(message)

    stories = backlog.get("stories", [])
    index = {s["id"]: s for s in stories}
    epic_ids = {e["id"] for e in backlog["epics"]}
    check(len(index) == len(stories), "IDs de historia duplicados")
    check(len(epic_ids) == len(backlog["epics"]), "IDs de épica duplicados")
    requirement_text = (ROOT / "SPECS/15-requisitos-y-pruebas.md").read_text()
    requirements = set(re.findall(r"^\| (R-\d{2}) \|", requirement_text, re.M))
    decisions = set(re.findall(r"^\| (D-\d{2}) \|", (ROOT / "SPECS/16-decisiones.md").read_text(), re.M))
    intake_ids = {item["id"] for sp in sprints for item in sp["intake"]}
    covered = set()
    task_ids = set()
    selected_by = {}
    sprint_index = {sp["id"]: sp for sp in sprints}
    check(len(sprint_index) == len(sprints), "IDs de sprint duplicados")

    for sp in sprints:
        sid = sp["id"]
        archived = sp["status"] in {"closed", "cancelled"}
        check(bool(re.fullmatch(r"SP-\d{3}", sid)), f"{sid}: ID inválido")
        check(sp["status"] in SPRINT_STATES, f"{sid}: estado inválido")
        check(len(sp["stories"]) == len(set(sp["stories"])), f"{sid}: historias duplicadas")
        for story_id in sp["stories"]:
            check(story_id in index, f"{sid}: historia inexistente {story_id}")
            if sp["status"] not in {"closed", "cancelled"}:
                check(story_id not in selected_by, f"{story_id}: en más de un sprint abierto")
                selected_by[story_id] = sid
        valid_ids = [x for x in sp["stories"] if x in index]
        points = sum(index[x]["points"] for x in valid_ids)
        if archived and local_file((sp.get("approval") or {}).get("baseline")):
            try:
                saved = json.loads((CONTROL / sp["approval"]["baseline"]).read_text())
                points = sum(s["points"] for s in saved["stories"])
            except (OSError, ValueError, KeyError):
                check(False, f"{sid}: snapshot histórico inválido")
        capacity = sp["capacity_points"]
        check(isinstance(capacity, (int, float)) and capacity > 0, f"{sid}: capacidad inválida")
        ratio = sp["max_commitment_ratio"]
        check(0 < ratio <= .85, f"{sid}: margen de capacidad no conservado")
        check(points <= capacity * ratio, f"{sid}: puntos superan el sobre con margen")
        check(bool(sp["capacity_basis"]), f"{sid}: falta declarar origen de capacidad")
        check(sp["budget"]["external_spend_limit"] >= 0, f"{sid}: presupuesto inválido")
        check(sp["timebox"]["proposed_business_days"] > 0, f"{sid}: ventana propuesta inválida")
        approved = sp.get("approval")
        frozen_state = sp["status"] != "proposed"
        if frozen_state:
            check(bool(approved), f"{sid}: estado {sp['status']} sin aprobación")
            for item in sp["intake"]:
                check(item["status"] == "resolved" and bool(item.get("answer")) and local_file(item.get("evidence")), f"{sid}/{item['id']}: insumo sin resolver/evidencia")
            start = aware_timestamp(sp["timebox"].get("start_at"))
            end = aware_timestamp(sp["timebox"].get("end_at"))
            review = aware_timestamp(sp["timebox"].get("review_at"))
            check(bool(start and end and review and start < end <= review), f"{sid}: fechas/zona/orden sin definir")
            for story_id in ([] if archived else valid_ids):
                story = index[story_id]
                check(local_file(story_value(backlog, story, "ready_evidence")), f"{story_id}: compromiso sin evidencia DoR")
                for dep in story["dependencies"]:
                    check(dep in sp["stories"] or index.get(dep, {}).get("status") == "done", f"{story_id}: dependencia {dep} fuera del sprint sin terminar")
                check(story["status"] not in {"proposed", "ready"}, f"{story_id}: sprint aprobado sin registrar compromiso/estado")
            check(bool(sp.get("history")), f"{sid}: falta historial de transición")
        if approved:
            check(sp["status"] != "proposed", f"{sid}: aprobación registrada pero estado aún proposed")
            check(approved.get("approved_by") == sp["product_reviewer"], f"{sid}: aprobador no coincide con PO designado")
            check(bool(aware_timestamp(approved.get("approved_at"))), f"{sid}: fecha de aprobación inválida")
            check(local_file(approved.get("source")), f"{sid}: falta fuente local sanitizada de aprobación real")
            try:
                if not archived:
                    expected_hash = plan_hash(backlog, sp)
                    check(approved.get("plan_sha256") == expected_hash, f"{sid}: alcance/criterios/límites difieren de la aprobación")
                baseline = approved.get("baseline")
                check(local_file(baseline), f"{sid}: falta snapshot baseline aprobado")
                if local_file(baseline):
                    snapshot = json.loads((CONTROL / baseline).read_text())
                    check(canonical_hash(snapshot) == approved.get("plan_sha256"), f"{sid}: baseline no corresponde a la aprobación")
                    check(snapshot.get("sprint") == {k: v for k, v in sp.items() if k not in SPRINT_RUNTIME_FIELDS}, f"{sid}: registro de sprint y baseline difieren")
            except (KeyError, OSError, ValueError) as exc:
                check(False, f"{sid}: no se pudo validar aprobación: {type(exc).__name__}")
        else:
            notes.append(f"{sid}: NO APROBADO; {sum(i['status'] != 'resolved' for i in sp['intake'])} insumos pendientes; no iniciar ejecución.")
        if sp["status"] == "closed":
            check(local_file(sp.get("review")), f"{sid}: cierre sin revisión/carryover documentado")
        if sp["status"] == "cancelled":
            check(local_file(sp.get("review")), f"{sid}: cancelación sin decisión del PO documentada")
        for name in ("ARRANQUE.md",):
            check((CONTROL / "sprints" / sid / name).is_file(), f"{sid}: falta {name}")

    for story in stories:
        sid = story["id"]
        check(bool(re.fullmatch(r"BG-\d{3}", sid)), f"{sid}: ID inválido")
        check(story["epic"] in epic_ids, f"{sid}: épica inexistente")
        check(story["status"] in STORY_STATES, f"{sid}: estado inválido")
        check(story["points"] in {1, 2, 3, 5, 8}, f"{sid}: dividir/reestimar historia fuera de Fibonacci ≤8")
        check(story["narrative"].startswith("Como ") and " quiero " in story["narrative"] and " para " in story["narrative"], f"{sid}: narrativa sin persona/capacidad/beneficio")
        check(bool(story.get("scope")), f"{sid}: alcance/exclusiones ausentes")
        check(len(story["scores"]) == 3 and all(isinstance(x, int) and 1 <= x <= 5 for x in story["scores"]), f"{sid}: factores de prioridad inválidos")
        acs = story["acceptance_criteria"]
        minimum = 3 if story["points"] <= 2 else 5 if story["points"] == 8 else 4
        check(len(acs) >= minimum, f"{sid}: faltan criterios según tamaño")
        check(len(acs) == len(set(acs)), f"{sid}: criterios repetidos")
        for num, ac in enumerate(acs, 1):
            check(ac.startswith(("Dado", "Dada")) and ", cuando " in ac and ", entonces " in ac, f"{sid}-AC{num}: usar Dado/Cuando/Entonces")
        check(bool(story["requirements"]), f"{sid}: sin requisito trazado")
        for req in story["requirements"]:
            check(req in requirements, f"{sid}: requisito {req} inexistente")
            covered.add(req)
        for spec in story["specs"]:
            check((ROOT / "SPECS" / spec).is_file(), f"{sid}: SPEC inexistente {spec}")
        for dep in story["dependencies"]:
            check(dep in index and dep != sid, f"{sid}: dependencia inválida {dep}")
        for gate in story["gates"]:
            check(gate in decisions or gate in intake_ids, f"{sid}: gate inexistente {gate}")
        owners = assignment(backlog, story)
        check(bool(owners["executor"] and owners["product_reviewer"]), f"{sid}: sin responsables propuestos")
        for task in story.get("tasks", []):
            check(task["id"] not in task_ids and task["id"].startswith(sid + "-T"), f"{sid}: ID de tarea duplicado/incorrecto")
            task_ids.add(task["id"])
            check(bool(task["owner"] and task["title"]), f"{task['id']}: falta dueño/título")
            check(task["status"] in STORY_STATES, f"{task['id']}: estado inválido")
            if story["status"] == "proposed":
                check(task["status"] == "proposed", f"{task['id']}: ejecución bajo historia no preparada")
        if story["status"] != "proposed":
            check(local_file(story_value(backlog, story, "ready_evidence")), f"{sid}: falta evidencia Ready")
            history = story_value(backlog, story, "history")
            check(bool(history), f"{sid}: falta historial de transición")
            if history:
                for event in history:
                    check(bool(aware_timestamp(event.get("at"))) and event.get("to") in STORY_STATES and local_file(event.get("evidence")), f"{sid}: evento incompleto")
                check(history[-1].get("to") == story["status"], f"{sid}: último evento y estado difieren")
        if story["status"] in {"committed", "in_progress", "blocked", "in_review", "done"}:
            sprint_id = selected_by.get(sid)
            completed_sp = [sp for sp in sprints if sid in sp["stories"] and sp["status"] in {"closed", "cancelled"} and sp.get("approval")]
            approved_sp = sprint_index.get(sprint_id, {})
            check(bool(approved_sp.get("approval") or completed_sp), f"{sid}: trabajo ejecutado sin sprint aprobado")
            check(owners["status"] == "confirmed", f"{sid}: asignación sin confirmar")
        if story["status"] == "blocked":
            check(local_file(story_value(backlog, story, "blocker")), f"{sid}: bloqueo sin registro")
        if story["status"] in {"in_review", "done"}:
            evidence = story_value(backlog, story, "evidence")
            revision = story.get("delivery_revision")
            check(bool(revision), f"{sid}: falta versión de entrega revisada")
            for num, _ in enumerate(acs, 1):
                acid = f"{sid}-AC{num}"
                matches = [ev for ev in evidence if ev.get("ac") == acid]
                check(any(ev.get("result") == "PASS" and local_file(ev.get("path")) and revision and ev.get("revision") == revision and ev.get("environment") and aware_timestamp(ev.get("at")) for ev in matches), f"{sid}: falta evidencia PASS versionada para {acid}")
            check(local_file(story.get("technical_review")), f"{sid}: falta revisión técnica identificada")
            check(all(task["status"] == "done" for task in story.get("tasks", [])), f"{sid}: tareas sin terminar al entrar a revisión")
        if story["status"] == "done":
            acceptance = story_value(backlog, story, "acceptance") or {}
            check(acceptance.get("by") == owners["product_reviewer"] and local_file(acceptance.get("source")) and bool(aware_timestamp(acceptance.get("at"))), f"{sid}: Done sin aceptación explícita del PO")
            check(bool(acceptance.get("revision")), f"{sid}: aceptación sin versión de entrega")
            check(bool(story.get("delivery_revision")) and acceptance.get("revision") == story.get("delivery_revision"), f"{sid}: versión aceptada y entrega difieren")

    check(covered == requirements, f"Requisitos sin cubrir o desconocidos: {sorted(covered ^ requirements)}")
    visited, active = set(), set()

    def visit(sid):
        if sid in active:
            check(False, f"Ciclo de dependencias en {sid}")
            return
        if sid in visited or sid not in index:
            return
        active.add(sid)
        for dep in index[sid]["dependencies"]:
            visit(dep)
        active.remove(sid)
        visited.add(sid)

    for sid in index:
        visit(sid)
    check(len(visited) == len(index), "No se recorrieron todas las dependencias")
    notes.append("Trazabilidad y estructura no acreditan calidad de implementación, DoR humana, consentimiento auténtico ni E2E.")
    return {
        "status": "PASS" if not errors else "FAIL", "checks": checks, "errors": errors,
        "notes": notes, "stories": len(stories), "epics": len(epic_ids),
        "requirements_covered": len(covered & requirements), "requirements_total": len(requirements),
        "approved_sprints": sum(bool(s.get("approval")) for s in sprints),
        "done_stories": sum(s["status"] == "done" for s in stories),
        "historical_velocity": None,
    }


def generated_documents(backlog, sprints):
    index = {s["id"]: s for s in backlog["stories"]}
    epic_names = {e["id"]: e["title"] for e in backlog["epics"]}
    selected = {sid: sp["id"] for sp in sprints if sp["status"] not in {"closed", "cancelled"} for sid in sp["stories"]}
    outputs = {}
    archived_ids = set()
    banner = "> Generado desde `backlog.json` y `sprints.json`. No editar este estado a mano. Propuesta ≠ compromiso ≠ aceptación.\n"
    board = ["# Tablero de control", "", banner, "## Resumen", "",
             f"{len(index)} historias · {len(epic_names)} épicas · {sum(bool(sp.get('approval')) for sp in sprints)} sprints aprobados · {sum(s['status'] == 'done' for s in index.values())} historias aceptadas.", "",
             "Velocidad histórica: **N/A**. Las pruebas documentales no son avance productivo.", "",
             "## Sprints", "", "| Sprint | Estado | Candidatos/puntos | Capacidad orientativa | Inicio / fin |", "|---|---|---|---|---|"]
    for sp in sprints:
        points = sum(index[sid]["points"] for sid in sp["stories"])
        board.append(f"| [{sp['id']}](sprints/{sp['id']}/PLAN.md) | {sp['status']} | {len(sp['stories'])} / {points} | {sp['capacity_points']} (no velocidad) | {sp['timebox']['start_at'] or 'pendiente'} / {sp['timebox']['end_at'] or 'pendiente'} |")
        if sp["status"] in {"closed", "cancelled"} and sp.get("approval"):
            baseline = sp["approval"]["baseline"]
            snapshot = json.loads((CONTROL / baseline).read_text())
            historical = [
                f"# {sp['id']} · Sprint archivado", "", banner,
                f"Estado `{sp['status']}` · versión {sp['version']} · [baseline original](../../{baseline}).", "",
                snapshot["sprint"]["goal"], "",
                f"[Revisión, decisiones y carryover](../../{sp['review']}).", "",
                "Las historias pueden haber evolucionado en el backlog actual. El compromiso histórico y sus criterios son los del snapshot aprobado, no los de la versión más reciente.", "",
                "Huella original:", "", "```text", sp["approval"]["plan_sha256"], "```", "",
            ]
            outputs[CONTROL / "sprints" / sp["id"] / "PLAN.md"] = "\n".join(historical)
            archived_ids.add(sp["id"])
            continue
    board += ["", "## Columnas", "", "| Estado | Historias |", "|---|---|"]
    for state in ("proposed", "ready", "committed", "in_progress", "blocked", "in_review", "done"):
        items = [f"[{s['id']}](BACKLOG.md#{s['id'].lower()})" for s in index.values() if s["status"] == state]
        board.append(f"| {state} | {', '.join(items) or '—'} |")
    board += ["", "## Asignaciones propuestas", "", "| Historia | Entrega | Ejecutor / revisión producto | Sprint candidato | Estado |", "|---|---|---|---|---|"]
    for story in index.values():
        owners = assignment(backlog, story)
        board.append(f"| [{story['id']}](BACKLOG.md#{story['id'].lower()}) | {story['title']} | {owners['executor']} / {owners['product_reviewer']} ({owners['status']}) | {selected.get(story['id'], 'sin asignar')} | {story['status']} |")
    board += ["", "[Registro de bloqueos y cambios](REGISTRO.md) · [Paquete de arranque](sprints/SP-001/ARRANQUE.md)", ""]

    detail = ["# Backlog trazable de BeGlobal", "", banner,
              "Puntos y orden: propuestas por refinar. Toda historia futura necesita revisar DoR/INVEST, insumos y alcance antes de compromiso. Responsables heredados son propuestas, no asignaciones aceptadas.", "",
              "La cobertura indica dónde se trabajará cada requisito, **no** que esté cumplido. BG-001…005 cubren sólo un subconjunto local con fixtures; los requisitos de autenticación real siguen en BG-006…008.", "",
              "## Índice", "", "| ID | Resultado | Área | Puntos | Prioridad | Score orientativo |", "|---|---|---|---|---|---|"]
    for story in index.values():
        detail.append(f"| [{story['id']}](#{story['id'].lower()}) | {story['title']} | {story['epic']} | {story['points']} | {story['priority']} | {score(story):.2f}/5 |")
    for story in index.values():
        sid = story["id"]
        owners = assignment(backlog, story)
        detail += ["", f"<a id=\"{sid.lower()}\"></a>", "", f"## {sid} · {story['title']}", "", story["narrative"], "",
                   f"Estado `{story['status']}` · {story['points']} puntos provisionales · {story['epic']} {epic_names[story['epic']]} · Sprint candidato: {selected.get(sid, 'sin asignar')}.", "",
                   f"Ejecutor: {owners['executor']} · Revisión producto: {owners['product_reviewer']} · Asignación: {owners['status']}. Revisor independiente: {owners['independent_reviewer'] or 'no designado; no afirmar revisión independiente'}.", "",
                   f"Alcance: {story['scope']}", "",
                   f"Requisitos: {', '.join(story['requirements'])} en [trazabilidad](../SPECS/15-requisitos-y-pruebas.md). SPECS: " + ", ".join(f"[{name}](../SPECS/{name})" for name in story["specs"]) + ".", "",
                   "Dependencias: " + (", ".join(f"[{dep}](#{dep.lower()})" for dep in story["dependencies"]) or "ninguna historia previa") + ". Gates/insumos: " + (", ".join(story["gates"]) or "DoR general") + ".", "",
                   "### Criterios de aceptación", ""]
        for num, ac in enumerate(story["acceptance_criteria"], 1):
            detail.append(f"- **{sid}-AC{num}:** {ac}")
        detail += ["", "### Control y evidencia", "",
                   f"DoR: {story_value(backlog, story, 'ready_evidence') or 'sin revisión registrada'}. INVEST: pendiente de juicio; dependencias declaradas, no independencia presumida.", "",
                   f"Evidencias registradas: {len(story_value(backlog, story, 'evidence'))}. Aceptación: {'registrada; ver JSON/fuente' if story_value(backlog, story, 'acceptance') else 'pendiente'}. No inferir cumplimiento por trazabilidad."]
        if story.get("tasks"):
            detail += ["", "| Tarea | Acción | Responsable propuesto | Estado |", "|---|---|---|---|"]
            for task in story["tasks"]:
                detail.append(f"| {task['id']} | {task['title']} | {task['owner']} | {task['status']} |")
    detail += ["", "## Cobertura de requisitos", "", "| Requisito | Historias propuestas |", "|---|---|"]
    for req in sorted({r for s in index.values() for r in s["requirements"]}):
        detail.append(f"| {req} | " + ", ".join(f"[{s['id']}](#{s['id'].lower()})" for s in index.values() if req in s["requirements"]) + " |")
    detail.append("")
    outputs[CONTROL / "TABLERO.md"] = "\n".join(board)
    outputs[CONTROL / "BACKLOG.md"] = "\n".join(detail)
    for sp in sprints:
        if sp["id"] in archived_ids:
            continue
        points = sum(index[sid]["points"] for sid in sp["stories"])
        plan = [f"# {sp['id']} · Perfil del miembro y acceso local" if sp["id"] == "SP-001" else f"# {sp['id']} · Plan de sprint", "", banner,
                f"Versión {sp['version']} · Estado `{sp['status']}` · Aprobación: {'registrada; consultar fuente' if sp.get('approval') else 'PENDIENTE; no iniciar'}.\n",
                "## Objetivo", "", sp["goal"], "", "## Entrega y capacidad", "",
                f"{len(sp['stories'])} historias candidatas, {points} puntos de un sobre de {sp['capacity_points']} ({points/sp['capacity_points']*100:.2f}%). {sp['capacity_basis']}", "",
                f"Timebox propuesto: {sp['timebox']['proposed_business_days']} días hábiles. Inicio: {sp['timebox']['start_at'] or 'pendiente'}. Fin: {sp['timebox']['end_at'] or 'pendiente'}. Revisión: {sp['timebox']['review_at'] or 'pendiente'} ({sp['timebox']['timezone']}).", "",
                f"Entorno: {sp['environment']}", "", "| Orden candidato | Historia | Puntos | Depende de |", "|---|---|---|---|"]
        for number, sid in enumerate(sp["stories"], 1):
            s = index[sid]
            plan.append(f"| {number} | [{sid} · {s['title']}](../../BACKLOG.md#{sid.lower()}) | {s['points']} | {', '.join(s['dependencies']) or '—'} |")
        plan += ["", "La secuencia es una dependencia real; no cinco desarrollos independientes. Pruebas se escriben con cada historia, no se posponen todas a la última.", "", "## Incluye", ""]
        plan += [f"- {item}." for item in sp["included"]]
        plan += ["", "## Excluye", ""] + [f"- {item}." for item in sp["excluded"]]
        plan += ["", "## Autorización y aceptación", "",
                 f"Ejecutor/revisor propuestos: {sp['executor']} / {sp['product_reviewer']}. {sp['review_gate']}", "",
                 f"Tope de nuevos gastos externos: {sp['budget']['external_spend_limit']} {sp['budget']['currency']}. {sp['budget']['scope']}", "",
                 "Rutas propuestas: " + "; ".join(f"`{p}`" for p in sp["scope_paths"]) + ".", "",
                 "[Completar los seis insumos y aprobar](ARRANQUE.md). [Reglas de autonomía/DoR/DoD](../../METODOLOGIA.md). No heredar autorizaciones antiguas de despliegues, videos o credenciales a este sprint.", "",
                 "## Demo prevista", "",
                 "Abrir perfil local con branding → comparar vigente, vencido y verificación no disponible → distinguir plan y rol → intentar acceso cruzado y ver denegación → recorrer UI con teclado/móvil → reproducir pruebas. Todo con datos ficticios y etiqueta de simulación. No presentar capturas como prueba de OAuth o plataforma real.", "",
                 "## Huella del paquete", "", "```text", plan_hash(backlog, sp), "```", "",
                 "SHA-256 del alcance, criterios, tareas/roles propuestos, límites, timebox, respuestas de arranque y reglas operativas. No es firma digital ni aprobación. Estado y evidencias de ejecución no cambian esta huella; cambiar el plan sí. Conservar el snapshot aprobado antes de ejecutar.", ""]
        outputs[CONTROL / "sprints" / sp["id"] / "PLAN.md"] = "\n".join(plan)
    return outputs


def markdown_link_errors():
    errors = []
    for file in CONTROL.rglob("*.md"):
        for target in re.findall(r"\]\(([^)]+)\)", file.read_text()):
            if target.startswith(("https://", "http://", "mailto:", "#")):
                continue
            target = target.split("#", 1)[0]
            if target and not (file.parent / target).exists():
                errors.append(f"Enlace roto en {file.relative_to(ROOT)}: {target}")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--render", action="store_true", help="Regenerar sólo vistas derivadas y reporte QA")
    parser.add_argument("--check", action="store_true", help="Validar fuente y detectar vistas desactualizadas (por defecto)")
    args = parser.parse_args()
    backlog, sprints = read_sources()
    report = validate(backlog, sprints)
    if not report["errors"]:
        outputs = generated_documents(backlog, sprints)
        if args.render:
            for path, content in outputs.items():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content)
            # Create the report target on a clean checkout before checking MD links.
            (CONTROL / "qa").mkdir(parents=True, exist_ok=True)
            (CONTROL / "qa" / "validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
        for path, content in outputs.items():
            if not path.is_file() or path.read_text() != content:
                report["errors"].append(f"Vista ausente/desactualizada: {path.relative_to(ROOT)}; ejecutar --render")
        report["errors"].extend(markdown_link_errors())
    report["status"] = "FAIL" if report["errors"] else "PASS"
    if args.render:
        report["generated_at"] = datetime.now(timezone.utc).isoformat()
        (CONTROL / "qa" / "validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if report["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
