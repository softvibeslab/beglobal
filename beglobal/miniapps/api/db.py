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
  experience_level TEXT,
  product_type TEXT,
  main_channel TEXT,
  main_blocker TEXT,
  onboarding_step TEXT DEFAULT 'diagnosis',
  diagnosis_complete INTEGER DEFAULT 0,
  last_activity INTEGER,
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
  status TEXT NOT NULL DEFAULT 'pending',
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
  status TEXT NOT NULL DEFAULT 'pending',
  score INTEGER,
  review_note TEXT,
  reviewed_by INTEGER,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS escalations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
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
  status TEXT NOT NULL DEFAULT 'pending',
  decided_by INTEGER,
  created_at INTEGER NOT NULL,
  decided_at INTEGER
);
CREATE TABLE IF NOT EXISTS gates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ord INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS telemetry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER,
  profile TEXT,
  event TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- ── GAMIFICATION SCHEMA ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gamification (
  tg_id INTEGER NOT NULL,
  profile TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  streak_current INTEGER DEFAULT 0,
  streak_max INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  achievements TEXT DEFAULT '[]',
  level INTEGER DEFAULT 1,
  xp_current INTEGER DEFAULT 0,
  xp_next_level INTEGER DEFAULT 500,
  last_activity_date TEXT,
  PRIMARY KEY (tg_id, profile)
);

CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  ord INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  duration_minutes INTEGER,
  content_url TEXT,
  quiz_data TEXT,
  prerequisites TEXT DEFAULT '[]',
  xp_reward INTEGER DEFAULT 50,
  difficulty TEXT DEFAULT 'easy'
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  tg_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  status TEXT DEFAULT 'locked',
  quiz_score INTEGER,
  attempts INTEGER DEFAULT 0,
  completed_at INTEGER,
  PRIMARY KEY (tg_id, lesson_id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE IF NOT EXISTS missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT DEFAULT 'easy',
  xp_reward INTEGER DEFAULT 100,
  coins_reward INTEGER DEFAULT 10,
  time_estimate_minutes INTEGER,
  deliverable_type TEXT,
  success_criteria TEXT,
  related_lessons TEXT DEFAULT '[]',
  ord INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mission_progress (
  tg_id INTEGER NOT NULL,
  mission_id INTEGER NOT NULL,
  status TEXT DEFAULT 'locked',
  attempts INTEGER DEFAULT 0,
  started_at INTEGER,
  completed_at INTEGER,
  score INTEGER,
  coach_feedback TEXT,
  PRIMARY KEY (tg_id, mission_id),
  FOREIGN KEY (mission_id) REFERENCES missions(id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  condition_type TEXT,
  condition_value INTEGER,
  xp_bonus INTEGER DEFAULT 25
);

CREATE TABLE IF NOT EXISTS diagnosis_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER NOT NULL,
  question_code TEXT NOT NULL,
  response TEXT NOT NULL,
  response_value TEXT,
  timestamp INTEGER NOT NULL,
  UNIQUE(tg_id, question_code)
);

CREATE TABLE IF NOT EXISTS learning_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER NOT NULL,
  profile TEXT NOT NULL,
  session_type TEXT,
  content_id INTEGER,
  duration_seconds INTEGER,
  completed INTEGER DEFAULT 0,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  device_info TEXT
);

-- ── INDICES ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_gamification_profile ON gamification(profile, level);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_mission_progress_status ON mission_progress(status);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_tg_id ON learning_sessions(tg_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_responses_tg_id ON diagnosis_responses(tg_id);
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

# ── DUOLINGO GAMIFICATION SEED DATA ────────────────────────────────────

LESSONS = [
    ("lesson_01", 1, "🚀 Fundamentos de e-commerce", "Qué es e-commerce y por qué funciona", "video", 5, None, None, "[]", 50, "easy"),
    ("lesson_02", 2, "🎯 Elegir tu nicho", "Cómo identificar un producto ganador", "quiz", 10, None, None, "[]", 75, "easy"),
    ("lesson_03", 3, "📸 Fotografía de producto", "Técnicas para fotos que venden", "video", 8, None, None, '["lesson_01"]', 60, "easy"),
    ("lesson_04", 4, "💬 Copywriting básico", "Cómo escribir descripciones que cierren", "interactive", 12, None, None, '["lesson_02"]', 80, "medium"),
    ("lesson_05", 5, "📊 Analítica básica", "Entender métricas que importan", "video", 6, None, None, '["lesson_01"]', 70, "medium"),
    ("lesson_06", 6, "🛍️ Setup de tienda Shopify", "Configurar tienda en 30 minutos", "interactive", 30, None, None, '["lesson_01","lesson_02"]', 100, "medium"),
    ("lesson_07", 7, "📱 Instagram para vendedores", "Estrategia de contenido Instagram", "video", 15, None, None, '["lesson_03"]', 90, "medium"),
    ("lesson_08", 8, "💰 Pricing y márgenes", "Cómo fijar precios ganadores", "quiz", 8, None, None, '["lesson_01"]', 75, "medium"),
    ("lesson_09", 9, "🚀 Ads en Meta (Facebook/Instagram)", "Crear campañas que convierten", "video", 20, None, None, '["lesson_07","lesson_08"]', 120, "hard"),
    ("lesson_10", 10, "📈 Escala sin morir en el intento", "Cómo crecer de 1K a 10K MXN/mes", "video", 25, None, None, '["lesson_05","lesson_09"]', 150, "hard"),
]

MISSIONS = [
    ("mission_01", "Tu primer landing", "Crea una landing page simple (Notion, Carrd o HTML) para validar demanda", "easy", 100, 10, 15, "link", None, "[]", 1),
    ("mission_02", "Contenido que vende", "Graba un video corto (30 seg) presentando tu producto", "easy", 125, 15, 20, "video", None, "[]", 2),
    ("mission_03", "Primera venta", "Completa tu primera transacción (real o simulada con friend test)", "easy", 150, 20, 30, "screenshot", None, "[]", 3),
    ("mission_04", "Descripción ganadora", "Escribe una descripción de producto usando copywriting básico", "easy", 100, 10, 10, "document", None, '["lesson_04"]', 4),
    ("mission_05", "Tienda en línea", "Crea tu tienda en Shopify, WooCommerce o similar", "medium", 250, 25, 60, "screenshot", None, '["lesson_06"]', 5),
    ("mission_06", "Primeras 10 ventas", "Registra 10 ventas verificadas en tu tienda", "medium", 300, 35, 120, "screenshot", None, '["mission_03","mission_05"]', 6),
    ("mission_07", "Contenido Instagram", "Publica 5 posts o reels en tu cuenta Instagram de producto", "medium", 200, 20, 40, "link", None, '["lesson_07"]', 7),
    ("mission_08", "Análisis de competencia", "Analiza 3 competidores y crea un documento con insights", "medium", 150, 15, 30, "document", None, '["lesson_02"]', 8),
    ("mission_09", "Primera campaña de Ads", "Crea y lanza una campaña de Meta Ads con presupuesto real (>$50)", "hard", 400, 50, 120, "screenshot", None, '["lesson_09","mission_06"]', 9),
    ("mission_10", "Optimiza tu tienda", "Implementa 5 mejoras de conversión en tu tienda", "hard", 350, 40, 90, "document", None, '["lesson_05","mission_05"]', 10),
]

ACHIEVEMENTS = [
    ("first_mission", "Primeros pasos", "Completaste tu primera misión", "🚀", "missions", 1, 25),
    ("five_missions", "Quincenal", "Completaste 5 misiones", "⭐", "missions", 5, 50),
    ("streak_3", "Consistencia", "3 días de racha consecutivos", "🔥", "streak", 3, 25),
    ("streak_7", "¡Sin parar!", "7 días de racha consecutivos", "🔥", "streak", 7, 75),
    ("streak_30", "Campeón de racha", "30 días de racha consecutivos", "🏆", "streak", 30, 250),
    ("level_2", "Aprendiz", "Alcanzaste nivel 2", "⭐", "profile_level", 2, 0),
    ("level_5", "Aprendiz avanzado", "Alcanzaste nivel 5", "⭐⭐", "profile_level", 5, 50),
    ("level_10", "Maestro", "Alcanzaste nivel 10", "⭐⭐⭐", "profile_level", 10, 200),
    ("all_lessons_easy", "Conocedor", "Completaste todas las lecciones fáciles", "🎓", "profile_level", 3, 100),
    ("vendor_ready", "¡Listo para vender!", "Completaste las primeras 5 misiones", "🛍️", "missions", 5, 150),
    ("marketing_pro", "Marketing maestro", "Completaste misiones de Ads y marketing", "📊", "missions", 3, 100),
]

DIAGNOSIS_QUESTIONS = [
    {
        "code": "experience",
        "type": "choice",
        "title": "¿Cuál es tu experiencia con e-commerce?",
        "options": [
            {"id": "beginner", "label": "Nunca lo he hecho"},
            {"id": "intermediate", "label": "Tengo 1-2 intentos fallidos"},
            {"id": "advanced", "label": "Soy veterano, quiero optimizar"},
        ]
    },
    {
        "code": "product",
        "type": "choice",
        "title": "¿Qué quieres vender principalmente?",
        "options": [
            {"id": "physical", "label": "Producto físico (ropa, accesorios, etc)"},
            {"id": "digital", "label": "Curso, e-book o info digital"},
            {"id": "service", "label": "Servicio o consultoría"},
            {"id": "dropshipping", "label": "Dropshipping"},
        ]
    },
    {
        "code": "channel",
        "type": "choice",
        "title": "¿Tu canal principal?",
        "options": [
            {"id": "instagram", "label": "Instagram/TikTok"},
            {"id": "email", "label": "Email/newsletter"},
            {"id": "whatsapp", "label": "WhatsApp"},
            {"id": "marketplace", "label": "Mercado Libre, Amazon, Shopee"},
            {"id": "website", "label": "Mi propio sitio web"},
        ]
    },
    {
        "code": "blocker",
        "type": "choice",
        "title": "¿Cuál es tu principal bloqueo?",
        "options": [
            {"id": "conocimiento", "label": "No sé cómo empezar"},
            {"id": "tiempo", "label": "No tengo tiempo"},
            {"id": "capital", "label": "No tengo presupuesto"},
            {"id": "producto", "label": "No tengo claro qué vender"},
            {"id": "traffico", "label": "No logro conseguir tráfico"},
        ]
    },
    {
        "code": "capital",
        "type": "choice",
        "title": "¿Cuánto puedes invertir en los próximos 3 meses?",
        "options": [
            {"id": "bajo", "label": "$0-500 USD"},
            {"id": "medio", "label": "$500-2000 USD"},
            {"id": "alto", "label": "$2000+ USD"},
        ]
    },
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

        # Seed gamification content
        if not conn.execute("SELECT 1 FROM lessons LIMIT 1").fetchone():
            conn.executemany(
                """INSERT INTO lessons (code, ord, title, description, content_type, duration_minutes,
                   content_url, quiz_data, prerequisites, xp_reward, difficulty)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                LESSONS
            )
        if not conn.execute("SELECT 1 FROM missions LIMIT 1").fetchone():
            conn.executemany(
                """INSERT INTO missions (code, title, description, difficulty, xp_reward, coins_reward,
                   time_estimate_minutes, deliverable_type, success_criteria, related_lessons, ord)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                MISSIONS
            )
        if not conn.execute("SELECT 1 FROM achievements LIMIT 1").fetchone():
            conn.executemany(
                """INSERT INTO achievements (code, title, description, icon, condition_type,
                   condition_value, xp_bonus) VALUES (?,?,?,?,?,?,?)""",
                ACHIEVEMENTS
            )
    conn.close()
