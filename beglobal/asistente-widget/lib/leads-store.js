"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { hashValue, randomToken } = require("./security");

function nowIso() {
  return new Date().toISOString();
}

function createStore(filePath, options = {}) {
  const secret = options.secret || "dev-only-change";
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  let rows = [];
  if (fs.existsSync(filePath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      rows = Array.isArray(parsed.leads) ? parsed.leads : [];
    } catch {
      rows = [];
    }
  }

  function persist() {
    const tmp = `${filePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ leads: rows }, null, 2));
    fs.renameSync(tmp, filePath);
  }

  function publicLead(row, extra = {}) {
    if (!row) return null;
    return {
      id: row.id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      name: row.name,
      email: row.email,
      phone: row.phone,
      stage: row.stage,
      cta_id: row.cta_id,
      cta_type: row.cta_type,
      purposes: row.purposes,
      status: row.status,
      retention_until: row.retention_until,
      consent_version: row.consent_version,
      terms_version: row.terms_version || "",
      privacy_version: row.privacy_version || "",
      mission_summary: row.mission_summary || "",
      source: row.source,
      notes_internal: row.notes_internal || "",
      ...extra,
    };
  }

  function createLead(input) {
    const id = randomToken();
    const eraseToken = randomToken();
    const created = nowIso();
    const row = {
      id,
      created_at: created,
      updated_at: created,
      name: input.name,
      email: input.email,
      phone: input.phone || "",
      stage: input.stage || "",
      mission_summary: String(input.mission_summary || "").slice(0, 280),
      cta_id: input.cta_id,
      cta_type: input.cta_type,
      purposes: input.purposes,
      consent_version: input.consent_version,
      terms_version: input.terms_version,
      privacy_version: input.privacy_version,
      session_ref: input.session_ref,
      ip_hash: input.ip_hash,
      status: "nuevo",
      notes_internal: "",
      erase_token_hash: hashValue(secret, eraseToken),
      retention_until: input.retention_until,
      source: "asistente",
    };
    rows.unshift(row);
    persist();
    return { lead: publicLead(row), erase_token: eraseToken };
  }

  function list(filter = {}) {
    return rows
      .filter((row) => row.status !== "borrado" || filter.includeDeleted)
      .filter((row) => !filter.status || row.status === filter.status)
      .filter((row) => !filter.q || `${row.name} ${row.email} ${row.phone} ${row.cta_id}`.toLowerCase().includes(String(filter.q).toLowerCase()))
      .map((row) => publicLead(row));
  }

  function get(id) {
    return rows.find((row) => row.id === id) || null;
  }

  function update(id, patch) {
    const row = get(id);
    if (!row || row.status === "borrado") return null;
    const allowedStatus = new Set(["nuevo", "contactado", "inscrito", "socio", "baja"]);
    if (patch.status && !allowedStatus.has(patch.status)) return null;
    if (patch.status) row.status = patch.status;
    if (typeof patch.notes_internal === "string") row.notes_internal = patch.notes_internal.slice(0, 500);
    row.updated_at = nowIso();
    persist();
    return publicLead(row);
  }

  function erase(id, token) {
    const row = get(id);
    if (!row) return false;
    if (token && !timingSafe(row.erase_token_hash, hashValue(secret, token))) return false;
    row.name = "";
    row.email = "";
    row.phone = "";
    row.mission_summary = "";
    row.notes_internal = "";
    row.status = "borrado";
    row.updated_at = nowIso();
    persist();
    return true;
  }

  function expireDue(reference = new Date()) {
    let count = 0;
    for (const row of rows) {
      if (row.status === "borrado") continue;
      if (row.retention_until && new Date(row.retention_until) <= reference) {
        erase(row.id);
        count += 1;
      }
    }
    return count;
  }

  function timingSafe(expectedHash, givenHash) {
    const left = Buffer.from(String(expectedHash));
    const right = Buffer.from(String(givenHash));
    if (left.length !== right.length) return false;
    return require("node:crypto").timingSafeEqual(left, right);
  }

  return { createLead, list, get, update, erase, expireDue, publicLead };
}

module.exports = { createStore };
