"""Database schema and models for BeGlobal Member Miniapp."""
import os
import sqlite3
import time
from datetime import datetime
from contextlib import contextmanager

DB_PATH = os.environ.get("DB_PATH", "be_global_member.db")

SCHEMA = """
-- Users
CREATE TABLE IF NOT EXISTS users (
  tg_id INTEGER PRIMARY KEY,
  profile TEXT DEFAULT 'member',
  name TEXT,
  first_seen INTEGER NOT NULL,
  experience_level TEXT,
  product_type TEXT,
  main_channel TEXT,
  main_blocker TEXT,
  onboarding_step TEXT DEFAULT 'diagnosis',
  diagnosis_complete INTEGER DEFAULT 0,
  last_activity INTEGER
);

-- Gamification
CREATE TABLE IF NOT EXISTS gamification (
  tg_id INTEGER PRIMARY KEY,
  profile TEXT DEFAULT 'member',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp_current INTEGER DEFAULT 0,
  xp_next_level INTEGER DEFAULT 500,
  streak_current INTEGER DEFAULT 0,
  streak_max INTEGER DEFAULT 0,
  streak_last_date TEXT,
  lessons_completed INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  achievements TEXT DEFAULT '[]',
  last_activity_date TEXT,
  FOREIGN KEY (tg_id) REFERENCES users(tg_id)
);

-- Lessons
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

-- Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  tg_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  status TEXT DEFAULT 'locked',
  quiz_score INTEGER,
  attempts INTEGER DEFAULT 0,
  completed_at INTEGER,
  PRIMARY KEY (tg_id, lesson_id),
  FOREIGN KEY (tg_id) REFERENCES users(tg_id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Missions
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

-- Mission Progress
CREATE TABLE IF NOT EXISTS mission_progress (
  tg_id INTEGER NOT NULL,
  mission_id INTEGER NOT NULL,
  status TEXT DEFAULT 'locked',
  attempts INTEGER DEFAULT 0,
  started_at INTEGER,
  completed_at INTEGER,
  score INTEGER,
  coach_feedback TEXT,
  deliverable_url TEXT,
  PRIMARY KEY (tg_id, mission_id),
  FOREIGN KEY (tg_id) REFERENCES users(tg_id),
  FOREIGN KEY (mission_id) REFERENCES missions(id)
);

-- Achievements
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

-- Diagnosis Responses
CREATE TABLE IF NOT EXISTS diagnosis_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER NOT NULL,
  question_code TEXT NOT NULL,
  response TEXT NOT NULL,
  response_value TEXT,
  timestamp INTEGER NOT NULL,
  UNIQUE(tg_id, question_code),
  FOREIGN KEY (tg_id) REFERENCES users(tg_id)
);

-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_trail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL,
  actor_tg_id INTEGER NOT NULL,
  actor_profile TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT,
  FOREIGN KEY (actor_tg_id) REFERENCES users(tg_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_gamification_profile ON gamification(profile);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_mission_progress_status ON mission_progress(status);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_trail(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_trail(action);
"""

def get_db():
  """Get database connection."""
  conn = sqlite3.connect(DB_PATH)
  conn.row_factory = sqlite3.Row
  conn.execute("PRAGMA journal_mode=WAL")
  conn.execute("PRAGMA foreign_keys=ON")
  return conn

def init_db():
  """Initialize database schema."""
  conn = get_db()
  conn.executescript(SCHEMA)

  # Seed lessons
  lessons = [
    ("lesson_01", 1, "🚀 Fundamentos de e-commerce", "Qué es e-commerce", "video", 5, None, None, "[]", 50, "easy"),
    ("lesson_02", 2, "🎯 Elegir tu nicho", "Cómo identificar un producto", "quiz", 10, None, None, "[]", 75, "easy"),
    ("lesson_03", 3, "📸 Fotografía de producto", "Técnicas para fotos", "video", 8, None, None, '["lesson_01"]', 60, "easy"),
    ("lesson_04", 4, "💬 Copywriting básico", "Descripciones que cierren", "interactive", 12, None, None, '["lesson_02"]', 80, "medium"),
    ("lesson_05", 5, "📊 Analítica básica", "Entender métricas", "video", 6, None, None, '["lesson_01"]', 70, "medium"),
    ("lesson_06", 6, "🛍️ Setup Shopify", "Configurar tienda", "interactive", 30, None, None, '["lesson_01","lesson_02"]', 100, "medium"),
    ("lesson_07", 7, "📱 Instagram para vendedores", "Estrategia de contenido", "video", 15, None, None, '["lesson_03"]', 90, "medium"),
    ("lesson_08", 8, "💰 Pricing y márgenes", "Fijar precios ganadores", "quiz", 8, None, None, '["lesson_01"]', 75, "medium"),
    ("lesson_09", 9, "🚀 Ads en Meta", "Crear campañas", "video", 20, None, None, '["lesson_07","lesson_08"]', 120, "hard"),
    ("lesson_10", 10, "📈 Escala sin morir", "De 1K a 10K MXN/mes", "video", 25, None, None, '["lesson_05","lesson_09"]', 150, "hard"),
  ]

  if not conn.execute("SELECT 1 FROM lessons LIMIT 1").fetchone():
    conn.executemany(
      "INSERT INTO lessons (code, ord, title, description, content_type, duration_minutes, content_url, quiz_data, prerequisites, xp_reward, difficulty) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      lessons
    )

  # Seed missions
  missions = [
    ("mission_01", "Tu primer landing", "Crea una landing page", "easy", 100, 10, 15, "link", None, "[]", 1),
    ("mission_02", "Contenido que vende", "Graba un video corto", "easy", 125, 15, 20, "video", None, "[]", 2),
    ("mission_03", "Primera venta", "Completa primera transacción", "easy", 150, 20, 30, "screenshot", None, "[]", 3),
    ("mission_04", "Descripción ganadora", "Escribe descripción de producto", "easy", 100, 10, 10, "document", None, '["lesson_04"]', 4),
    ("mission_05", "Tienda en línea", "Crea tu tienda Shopify", "medium", 250, 25, 60, "screenshot", None, '["lesson_06"]', 5),
    ("mission_06", "Primeras 10 ventas", "Registra 10 ventas", "medium", 300, 35, 120, "screenshot", None, '["mission_03","mission_05"]', 6),
    ("mission_07", "Contenido Instagram", "Publica 5 posts", "medium", 200, 20, 40, "link", None, '["lesson_07"]', 7),
    ("mission_08", "Análisis competencia", "Analiza 3 competidores", "medium", 150, 15, 30, "document", None, '["lesson_02"]', 8),
    ("mission_09", "Primera campaña Ads", "Crea campaña Meta Ads", "hard", 400, 50, 120, "screenshot", None, '["lesson_09","mission_06"]', 9),
    ("mission_10", "Optimiza tu tienda", "Implementa 5 mejoras", "hard", 350, 40, 90, "document", None, '["lesson_05","mission_05"]', 10),
  ]

  if not conn.execute("SELECT 1 FROM missions LIMIT 1").fetchone():
    conn.executemany(
      "INSERT INTO missions (code, title, description, difficulty, xp_reward, coins_reward, time_estimate_minutes, deliverable_type, success_criteria, related_lessons, ord) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      missions
    )

  # Seed achievements
  achievements = [
    ("first_mission", "Primeros pasos", "Completaste tu primera misión", "🚀", "missions", 1, 25),
    ("five_missions", "Quincenal", "Completaste 5 misiones", "⭐", "missions", 5, 50),
    ("streak_3", "Consistencia", "3 días de racha", "🔥", "streak", 3, 25),
    ("streak_7", "¡Sin parar!", "7 días de racha", "🔥", "streak", 7, 75),
    ("streak_30", "Campeón", "30 días de racha", "🏆", "streak", 30, 250),
    ("level_2", "Aprendiz", "Nivel 2", "⭐", "profile_level", 2, 0),
    ("level_5", "Aprendiz avanzado", "Nivel 5", "⭐⭐", "profile_level", 5, 50),
    ("level_10", "Maestro", "Nivel 10", "⭐⭐⭐", "profile_level", 10, 200),
    ("all_lessons_easy", "Conocedor", "Todas lecciones fáciles", "🎓", "profile_level", 3, 100),
    ("vendor_ready", "¡Listo para vender!", "5 primeras misiones", "🛍️", "missions", 5, 150),
    ("marketing_pro", "Marketing maestro", "Misiones de Ads", "📊", "missions", 3, 100),
  ]

  if not conn.execute("SELECT 1 FROM achievements LIMIT 1").fetchone():
    conn.executemany(
      "INSERT INTO achievements (code, title, description, icon, condition_type, condition_value, xp_bonus) VALUES (?,?,?,?,?,?,?)",
      achievements
    )

  conn.commit()
  conn.close()
  print(f"✓ Database initialized at {DB_PATH}")

if __name__ == "__main__":
  init_db()
