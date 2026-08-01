/* Módulo corporativo — Gobernanza y decisiones. */

const CorporateModule = {
  async getMetrics() {
    return api("/api/corporate/metrics");
  },

  async getMetricsTrending(days = 7) {
    return api(`/api/corporate/metrics/trending?days=${days}`);
  },

  async getGates() {
    return api("/api/corporate/gates");
  },

  async completeGate(gateId) {
    const fd = new FormData();
    fd.append("completed", "true");
    return api(`/api/corporate/gates/${gateId}/complete`, { method: "POST", body: fd });
  },

  async getDecisions() {
    return api("/api/corporate/decisions");
  },

  async createDecision(title, impact = "5", detail = "") {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("impact", impact);
    fd.append("detail", detail);
    return api("/api/corporate/decisions", { method: "POST", body: fd });
  },

  async decideOnDecision(decisionId, action, reason = "") {
    const fd = new FormData();
    fd.append("action", action);
    fd.append("reason", reason);
    return api(`/api/corporate/decisions/${decisionId}/decide`, { method: "POST", body: fd });
  },

  async getAuditTrail(limit = 50, filter = null) {
    let path = `/api/corporate/audit-trail?limit=${limit}`;
    if (filter) {
      path += `&filter=${filter}`;
    }
    return api(path);
  },

  async checkGoLiveReadiness() {
    return api("/api/corporate/go-live-check");
  },

  async exportAuditTrail(format = "csv") {
    return api(`/api/corporate/audit-trail/export?format=${format}`);
  }
};
