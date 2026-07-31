"""SQLite: esquema y datos semilla del piloto Be Global."""
import os
import sqlite3
import time

DB_PATH = os.environ.get("DB_PATH", os.path.join(os.path.dirname(__file__), "beglobal.db"))

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
  tg_id INTEGER NOT NULL,
  profile TEXT NOT NULL,
  name TEXT,
  first_seen INTEGER NOT NULL,
  PRIMARY KEY (tg_id, profile)
);
CREATE TABLE IF NOT EXISTS stages (
  code TEXT PRIMARY KEY,
  ord INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverable TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
  tg_id INTEGER NOT NULL,
  stage_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | in_progress | review | done
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (tg_id, stage_code)
);
CREATE TABLE IF NOT EXISTS evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER NOT NULL,
  stage_code TEXT NOT NULL,
  filename TEXT NOT NULL,
  stored_path TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  score INTEGER,
  review_note TEXT,
  reviewed_by INTEGER,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS escalations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',     -- open | approved | rejected
  resolution TEXT,
  resolved_by INTEGER,
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stage_code TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT
);
CREATE TABLE IF NOT EXISTS decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  decided_by INTEGER,
  created_at INTEGER NOT NULL,
  decided_at INTEGER
);
CREATE TABLE IF NOT EXISTS gates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ord INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'   -- pending | done
);
CREATE TABLE IF NOT EXISTS telemetry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER,
  profile TEXT,
  event TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
"""

STAGES = [
    ("PRECHECK", 1, "Precheck", "Confirma requisitos y accesos para empezar.", "Checklist de requisitos completo"),
    ("INTAKE", 2, "Intake", "Cuéntale a tu Guía sobre tu marca, producto y meta.", "Formulario de marca y producto"),
    ("SETUP", 3, "Setup", "Conexiones y configuración inicial, sin dolor.", "Espacio configurado y verificado"),
    ("MISSION", 4, "Primera misión", "Una tarea concreta con entregable real.", "Entregable de la misión (guion, tienda…)"),
    ("ACCEPTANCE", 5, "Aceptación", "Revisión final con criterios y evidencia.", "Ficha de aceptación firmada"),
]

RESOURCES = [
    ("INTAKE", "Cómo definir tu producto estrella", None),
    ("MISSION", "Estructura de un reel que funciona", None),
    ("MISSION", "Plantilla Be Global: guion y plan de tomas", None),
    ("SETUP", "Tu tienda con plantilla Be Global, paso a paso", None),
]

DECISIONS = [
    ("Mapeo de bots por perfil", "Confirmar @Beglobalplus_bot como Master y crear bots independientes para Corporate, Team y Member."),
    ("Allowlist por perfil", "Definir el ID de usuario o chat permitido para cada perfil."),
    ("Canal del piloto", "Ratificar Telegram como canal único del piloto."),
]

GATES = [
    (1, "Mapeo de bots y tokens configurados en el VPS"),
    (2, "Pruebas getMe, allowlists y aislamiento por bot"),
    (3, "API autenticada para dashboard, workflows y evidencias"),
    (4, "Media Hub aislado con pruebas de acceso cruzado"),
    (5, "Snapshot y migración del VPS a versión LTS"),
]


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db() -> None:
    conn = connect()
    with conn:
        conn.executescript(SCHEMA)
        if not conn.execute("SELECT 1 FROM stages LIMIT 1").fetchone():
            conn.executemany("INSERT INTO stages VALUES (?,?,?,?,?)", STAGES)
        if not conn.execute("SELECT 1 FROM resources LIMIT 1").fetchone():
            conn.executemany("INSERT INTO resources (stage_code, title, url) VALUES (?,?,?)", RESOURCES)
        if not conn.execute("SELECT 1 FROM decisions LIMIT 1").fetchone():
            now = int(time.time())
            conn.executemany(
                "INSERT INTO decisions (title, detail, created_at) VALUES (?,?,?)",
                [(t, d, now) for t, d in DECISIONS],
            )
        if not conn.execute("SELECT 1 FROM gates LIMIT 1").fetchone():
            conn.executemany("INSERT INTO gates (ord, title) VALUES (?,?)", GATES)
    conn.close()
