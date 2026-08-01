"""Pytest configuration and fixtures."""
import os
import sys
import time
import pytest
import sqlite3
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import db
from main import app

@pytest.fixture
def test_db():
  """Create temporary test database."""
  db_path = ":memory:"
  os.environ["DB_PATH"] = db_path

  conn = sqlite3.connect(db_path)
  conn.row_factory = sqlite3.Row
  conn.executescript(db.SCHEMA)

  yield conn

  conn.close()

@pytest.fixture
def client(test_db):
  """Create FastAPI test client."""
  return TestClient(app)

@pytest.fixture
def test_user_id():
  """Test user Telegram ID."""
  return 12345678

@pytest.fixture
def valid_init_data(test_user_id):
  """Create valid Telegram initData for testing."""
  import hashlib
  import hmac
  import json

  bot_token = os.environ.get("MEMBER_BOT_TOKEN", "test_token")
  secret = hashlib.sha256(f"WebAppData{bot_token}".encode()).digest()

  auth_date = str(int(time.time()))
  user_data = json.dumps({
    "id": test_user_id,
    "username": "testuser",
    "is_bot": False
  })

  data_check = f"auth_date={auth_date}\nuser={user_data}"
  calc_hash = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()

  return f"auth_date={auth_date}&user={user_data}&hash={calc_hash}"
