"""Tests for FastAPI endpoints."""
import pytest
import json

def test_healthz(client):
  """Test health endpoint."""
  response = client.get("/healthz")
  assert response.status_code == 200
  assert response.json()["ok"] is True

def test_info(client):
  """Test info endpoint."""
  response = client.get("/info")
  assert response.status_code == 200
  data = response.json()
  assert data["name"] == "BeGlobal Member Miniapp"
  assert data["version"] == "1.0.0"

def test_diagnosis_missing_init_data(client):
  """Test diagnosis endpoint without auth."""
  response = client.post("/api/member/diagnosis",
    data={
      "experience": "beginner",
      "product": "saas",
      "channel": "instagram",
      "blocker": "marketing",
      "capital": "500"
    }
  )
  assert response.status_code == 401

def test_get_lessons_missing_auth(client):
  """Test lessons endpoint without auth."""
  response = client.get("/api/member/lessons")
  assert response.status_code == 401

def test_get_dashboard_missing_auth(client):
  """Test dashboard endpoint without auth."""
  response = client.get("/api/member/dashboard")
  assert response.status_code == 401
