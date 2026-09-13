"""SP-001: loopback-only, synthetic Member Workspace. Not a production BFF.

No database, dotenv, model calls, external HTTP clients or legacy API imports.
MembershipBridge remains the sole academic-decision component; this module adds
session/business/object/plan checks. Fixtures never work in staging/production.
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import importlib.util
import secrets
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, ConfigDict
from starlette.exceptions import HTTPException

HERE = Path(__file__).resolve().parent
boundary_path = HERE.parent / "membership-bridge" / "bridge.py"
spec = importlib.util.spec_from_file_location("beglobal_sp1_membership_boundary", boundary_path)
boundary = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = boundary
spec.loader.exec_module(boundary)

COOKIE = "bg_workspace_demo"
SESSION_TTL = 15 * 60
MAX_SESSIONS = 200
HEADERS = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
}
PERSONAS = {
    "lucia": {"personId": "demo_lucia", "businessId": "demo_nube", "displayName": "Lucía · demo", "businessName": "Estudio Nube", "goal": "Organizar mi estrategia y convertir el siguiente paso en una misión."},
    "diego": {"personId": "demo_diego", "businessId": "demo_brisa", "displayName": "Diego · demo", "businessName": "Tienda Brisa", "goal": "Entender mis prioridades antes de conectar la operación de mi tienda."},
}
SCENARIOS = {
    "active_agente": ("Vigente · PRO Agente", "active", "pro_agente"),
    "active_creador": ("Vigente · PRO Creador", "active", "pro_creador"),
    "active_negocio": ("Vigente · PRO Negocio", "active", "pro_negocio"),
    "expired_negocio": ("Vencida · PRO Negocio", "expired", "pro_negocio"),
    "unavailable_creador": ("Sin verificar · PRO Creador", "unavailable", "pro_creador"),
    "revoked_agente": ("Revocada · PRO Agente", "revoked", "pro_agente"),
    "timeout_creador": ("Proveedor sin respuesta · PRO Creador", "timeout", "pro_creador"),
    "mismatch_negocio": ("Respuesta de otro sujeto · PRO Negocio", "mismatch", "pro_negocio"),
    "no_grant": ("Permiso de negocio retirado", "active", "pro_negocio"),
}


class ClosedInput(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class StartInput(ClosedInput):
    persona: Literal["lucia", "diego"]
    scenario: str


class ScenarioInput(ClosedInput):
    scenario: str


class EmptyInput(ClosedInput):
    pass


@dataclass
class DemoSession:
    persona: str
    scenario: str
    expires_at: float


class DemoMapping:
    async def external_member_for(self, person_id):
        return {"demo_lucia": "fixture_member_lucia", "demo_diego": "fixture_member_diego"}.get(person_id)


class FixtureProvider:
    release_status = "fixture"

    def __init__(self, state, clock):
        self.state, self.clock = state, clock

    async def fetch_membership(self, external_member_id):
        if self.state == "timeout":
            await asyncio.sleep(1)
        now = int(self.clock())
        return boundary.MembershipSnapshot(
            "fixture_wrong_subject" if self.state == "mismatch" else external_member_id,
            "active" if self.state == "mismatch" else self.state,
            now, now - 3600,
            now - 1 if self.state == "expired" else now + 3600,
            "synthetic-sp001-v1",
        )


def iso(value):
    return datetime.fromtimestamp(value, timezone.utc).isoformat().replace("+00:00", "Z") if value is not None else None


class Denied(Exception):
    def __init__(self, status, code, message, retryable=False):
        self.status, self.code, self.message, self.retryable = status, code, message, retryable


def create_app(*, environment="development", fixtures_enabled=False, clock=time.time):
    # This entire artifact is a demo, not an app with a secret production bypass.
    if environment not in {"development", "test"}:
        raise ValueError("Member Workspace SP-001 is local-only; staging/production are forbidden")
    app = FastAPI(title="BeGlobal Member Workspace · demo", docs_url=None, redoc_url=None, openapi_url=None)
    app.state.sessions = {}
    app.state.clock = clock
    app.state.fixtures_enabled = fixtures_enabled

    def error(request, status, code, message, retryable=False):
        return JSONResponse(status_code=status, content={"code": code, "message": message, "requestId": getattr(request.state, "request_id", "no_context"), "retryable": retryable})

    def data(request, value):
        return {"data": value, "requestId": request.state.request_id}

    def current(request):
        token = request.cookies.get(COOKIE, "")
        key = hashlib.sha256(token.encode()).hexdigest()
        session = app.state.sessions.get(key)
        if not session or session.expires_at <= clock():
            app.state.sessions.pop(key, None)
            raise Denied(401, "SESSION_REQUIRED", "Abre una sesión de prueba para continuar.")
        return session

    def business_guard(session, requested_business=None):
        person = PERSONAS[session.persona]
        if requested_business is not None and requested_business != person["businessId"]:
            # Same response for nonexistent/foreign objects: do not enumerate.
            raise Denied(404, "RESOURCE_NOT_FOUND", "Ese recurso no está disponible en tu espacio.")
        if session.scenario == "no_grant":
            raise Denied(403, "BUSINESS_ACCESS_DENIED", "Tu sesión está abierta, pero no tienes permiso para este negocio.")
        return person

    async def access_for(session):
        person = business_guard(session)
        _, state, plan = SCENARIOS[session.scenario]
        provider = boundary.UnconfiguredProvider() if state == "unavailable" else FixtureProvider(state, clock)
        decision = await boundary.MembershipBridge(DemoMapping(), provider, environment=environment, timeout_seconds=.08, clock=clock).check(person["personId"])
        capabilities = ["profile.read", "access.read"]
        if decision.can_read_pro and plan in {"pro_agente", "pro_creador", "pro_negocio"}:
            capabilities.append("demo.pro.read")
        return {
            "membershipStatus": decision.membership_status,
            "verificationStatus": decision.verification_status,
            "agentPlan": plan, "canReadPro": decision.can_read_pro,
            "reason": decision.reason, "checkedAt": iso(decision.checked_at),
            "validUntil": iso(decision.valid_until), "capabilities": capabilities,
        }

    def profile_for(person):
        return {key: person[key] for key in ("personId", "businessId", "displayName", "goal")} | {"revision": 1}

    @app.middleware("http")
    async def local_boundary(request: Request, call_next):
        request.state.request_id = "req_" + secrets.token_hex(12)
        hostname = request.url.hostname
        peer = request.client.host if request.client else ""
        loopback_peers = {"127.0.0.1", "::1"} | ({"testclient"} if environment == "test" else set())
        response = None
        if hostname not in {"127.0.0.1", "localhost", "::1"} or peer not in loopback_peers:
            response = error(request, 403, "LOCAL_ONLY", "Esta demo sólo acepta conexiones locales.")
        origin = request.headers.get("origin")
        expected_origin = str(request.base_url).rstrip("/")
        if response is None and origin and origin != expected_origin:
            response = error(request, 403, "ORIGIN_DENIED", "Origen no autorizado para esta demo.")
        if response is None and request.method not in {"GET", "HEAD"}:
            if origin != expected_origin or request.headers.get("x-workspace-intent") != "fixture-demo":
                response = error(request, 403, "INTENT_REQUIRED", "La operación debe iniciarse desde la demo local.")
            else:
                try:
                    declared_size = int(request.headers.get("content-length", "0"))
                except ValueError:
                    declared_size = 4097
                if declared_size < 0 or declared_size > 4096:
                    response = error(request, 413, "PAYLOAD_TOO_LARGE", "La solicitud excede el límite de la demo.")
                elif len(await request.body()) > 4096:
                    response = error(request, 413, "PAYLOAD_TOO_LARGE", "La solicitud excede el límite de la demo.")
        if response is None and request.url.path.startswith("/api/v1/") and request.query_params:
            response = error(request, 422, "UNEXPECTED_FIELDS", "Este recurso no acepta parámetros de autorización.")
        if response is None:
            response = await call_next(request)
        response.headers.update(HEADERS)
        response.headers["X-Request-Id"] = request.state.request_id
        response.headers["X-BeGlobal-Demo"] = "synthetic-only"
        return response

    @app.exception_handler(Denied)
    async def denied(request, exc):
        return error(request, exc.status, exc.code, exc.message, exc.retryable)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request, exc):
        # Do not echo attacker input, including token-shaped forbidden fields.
        return error(request, 422, "INVALID_INPUT", "Revisa los campos permitidos de la solicitud.")

    @app.exception_handler(HTTPException)
    async def route_error(request, exc):
        return error(request, exc.status_code, "ROUTE_UNAVAILABLE", "La ruta u operación no está disponible en esta demo.")

    @app.get("/")
    async def home():
        return FileResponse(HERE / "static" / "index.html")

    @app.get("/assets/{filename}")
    async def asset(filename: str):
        if filename not in {"app.js", "cards.js", "styles.css", "logo-beglobal.png"}:
            raise Denied(404, "ASSET_NOT_FOUND", "Recurso no disponible.")
        return FileResponse(HERE / "static" / filename)

    @app.get("/healthz")
    async def health(request: Request):
        return data(request, {"status": "ok", "environment": environment, "syntheticOnly": True, "fixturesEnabled": fixtures_enabled})

    @app.get("/demo/v1/config")
    async def config(request: Request):
        return data(request, {
            "syntheticOnly": True, "fixturesEnabled": fixtures_enabled,
            "personas": [{"id": key, "label": value["displayName"]} for key, value in PERSONAS.items()],
            "scenarios": [{"id": key, "label": value[0]} for key, value in SCENARIOS.items()],
        })

    @app.post("/demo/v1/session")
    async def start(request: Request, body: StartInput):
        if not fixtures_enabled:
            raise Denied(404, "FIXTURES_DISABLED", "Las sesiones de prueba no están habilitadas.")
        if body.scenario not in SCENARIOS:
            raise Denied(422, "INVALID_SCENARIO", "Elige un escenario de prueba disponible.")
        now = clock()
        sessions = app.state.sessions
        for key, session in list(sessions.items()):
            if session.expires_at <= now:
                del sessions[key]
        old = request.cookies.get(COOKIE)
        if old:
            sessions.pop(hashlib.sha256(old.encode()).hexdigest(), None)
        if len(sessions) >= MAX_SESSIONS:
            raise Denied(429, "DEMO_SESSION_LIMIT", "Se alcanzó el límite local de sesiones; espera a que caduquen.", True)
        token = secrets.token_urlsafe(32)
        sessions[hashlib.sha256(token.encode()).hexdigest()] = DemoSession(body.persona, body.scenario, now + SESSION_TTL)
        response = JSONResponse(data(request, {"started": True, "syntheticOnly": True}))
        # Explicitly HTTP-only loopback demo. Never reuse this cookie in a real BFF.
        response.set_cookie(COOKIE, token, httponly=True, samesite="strict", secure=False, path="/", max_age=SESSION_TTL)
        return response

    @app.post("/demo/v1/scenario")
    async def change_scenario(request: Request, body: ScenarioInput):
        session = current(request)
        if body.scenario not in SCENARIOS:
            raise Denied(422, "INVALID_SCENARIO", "Elige un escenario de prueba disponible.")
        session.scenario = body.scenario
        return data(request, {"changed": True, "syntheticOnly": True})

    @app.post("/demo/v1/logout")
    async def logout(request: Request, body: EmptyInput):
        token = request.cookies.get(COOKIE, "")
        app.state.sessions.pop(hashlib.sha256(token.encode()).hexdigest(), None)
        response = JSONResponse(data(request, {"closed": True}))
        response.delete_cookie(COOKIE, path="/", httponly=True, samesite="strict")
        return response

    @app.get("/demo/v1/workspace")
    async def workspace(request: Request):
        session = current(request)
        person = business_guard(session)
        access = await access_for(session)
        return data(request, {
            "profile": profile_for(person), "access": access,
            "context": {"businessName": person["businessName"], "roles": ["member"], "syntheticOnly": True,
                        "personaKey": session.persona, "scenarioKey": session.scenario,
                        "sessionExpiresAt": iso(session.expires_at), "otherBusinessId": "demo_brisa" if session.persona == "lucia" else "demo_nube"},
            "progress": {"accepted": 0, "required": 0, "percent": None, "routeVersion": None},
            "missions": [], "history": [],
            "notice": {"type": "notice", "version": 1, "severity": "info", "text": "Todo lo que ves usa datos ficticios. No hay conexión a tu membresía real ni a cuentas externas."},
        })

    @app.get("/api/v1/businesses/{business_id}/profile")
    async def profile(request: Request, business_id: str):
        return data(request, profile_for(business_guard(current(request), business_id)))

    @app.get("/api/v1/businesses/{business_id}/access")
    async def access(request: Request, business_id: str):
        session = current(request)
        business_guard(session, business_id)
        return data(request, await access_for(session))

    @app.get("/api/v1/businesses/{business_id}/resources/demo-pro")
    async def synthetic_pro(request: Request, business_id: str):
        session = current(request)
        business_guard(session, business_id)
        rights = await access_for(session)  # Never trust the previous UI snapshot.
        if rights["verificationStatus"] != "verified":
            raise Denied(503, "MEMBERSHIP_UNVERIFIED", "No pudimos verificar la membresía. El acceso PRO permanece bloqueado.", True)
        if "demo.pro.read" not in rights["capabilities"]:
            raise Denied(403, "ACADEMIC_ACCESS_DENIED", "La membresía académica de prueba no permite abrir este recurso.")
        return data(request, {"syntheticOnly": True, "text": "Acceso de prueba permitido. Este mensaje es ficticio; no contiene material de la Academia PRO."})

    return app


if __name__ == "__main__":
    import os
    import uvicorn
    parser = argparse.ArgumentParser(description="BeGlobal SP-001 · sólo loopback y datos ficticios")
    parser.add_argument("--fixtures", action="store_true", help="Activar explícitamente sesiones sintéticas")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error("Elige un puerto local entre 1024 y 65535")
    try:
        demo = create_app(environment=os.environ.get("BEGLOBAL_ENV", "development"), fixtures_enabled=args.fixtures)
    except ValueError as exc:
        parser.error(str(exc))
    uvicorn.run(demo, host="127.0.0.1", port=args.port, proxy_headers=False, access_log=False)
