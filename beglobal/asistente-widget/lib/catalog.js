"use strict";

const fs = require("node:fs");
const path = require("node:path");

function loadCatalog(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!raw || !Array.isArray(raw.ctas) || !raw.privacy_version || !raw.terms_version) {
    throw new Error("invalid-catalog");
  }
  return Object.freeze({
    ...raw,
    ctas: Object.freeze(raw.ctas.map((cta) => Object.freeze({ ...cta }))),
  });
}

function publicCtas(catalog) {
  return catalog.ctas.map((cta) => ({
    id: cta.id,
    type: cta.type,
    title: cta.title,
    text: cta.text,
    label: cta.label,
    url: cta.url,
    requires_lead: Boolean(cta.requires_lead),
    purposes: [...(cta.purposes || [])],
  }));
}

function ctaById(catalog, id) {
  return catalog.ctas.find((cta) => cta.id === id) || null;
}

function defaultCatalogPath() {
  return path.join(__dirname, "..", "lead-catalog.json");
}

module.exports = { loadCatalog, publicCtas, ctaById, defaultCatalogPath };
