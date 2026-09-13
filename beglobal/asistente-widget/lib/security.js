"use strict";

const crypto = require("node:crypto");

function timingEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function hashValue(secret, value) {
  return crypto.createHmac("sha256", secret).update(String(value)).digest("hex");
}

function randomToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function normalizeName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/[^\d+]/g, "");
  return digits;
}

function validName(name) {
  return name.length >= 2 && name.length <= 80 && !/[<>]/.test(name);
}

function validEmail(email) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email) && email.length <= 120;
}

function validPhone(phone) {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("52"));
}

const PURPOSE_IDS = new Set(["contacto_evento", "novedades", "comunidad"]);

function parsePurposes(list, allowed) {
  const incoming = Array.isArray(list) ? list : [];
  const allowedSet = new Set(allowed || []);
  const unique = [...new Set(incoming.map(String))];
  if (!unique.length) return { error: "Elige al menos una finalidad." };
  for (const item of unique) {
    if (!PURPOSE_IDS.has(item)) return { error: "Finalidad no permitida." };
  }
  if (allowedSet.size && !unique.some((item) => allowedSet.has(item))) {
    return { error: "Marca la finalidad de este aviso." };
  }
  return { purposes: unique };
}

function extractStage(answerText) {
  const text = String(answerText || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const stages = ["curioso", "principiante", "en construccion", "lanzando", "atorado", "escalando"];
  return stages.find((stage) => text.includes(stage)) || "";
}

module.exports = {
  timingEqual,
  hashValue,
  randomToken,
  normalizeName,
  normalizeEmail,
  normalizePhone,
  validName,
  validEmail,
  validPhone,
  parsePurposes,
  extractStage,
  PURPOSE_IDS,
};
