/* Módulo del equipo — Operaciones de revisión de misiones. */

const TeamModule = {
  async getMissionsQueue(difficulty = "all") {
    return api("/api/team/missions-queue?difficulty=" + difficulty);
  },

  async getAnalytics() {
    return api("/api/team/analytics");
  },

  async getHistory(days = 7) {
    return api("/api/team/history?days=" + days);
  },

  async getEscalations() {
    return api("/api/team/escalations");
  },

  async approveMission(missionId, score, feedback = "") {
    const fd = new FormData();
    fd.append("score", score);
    fd.append("feedback", feedback);
    return api(`/api/missions/${missionId}/approve`, { method: "POST", body: fd });
  },

  async rejectMission(missionId, feedback = "") {
    const fd = new FormData();
    fd.append("feedback", feedback);
    return api(`/api/missions/${missionId}/reject`, { method: "POST", body: fd });
  },

  async approveBulk(missionIds) {
    const fd = new FormData();
    fd.append("mission_ids", missionIds.join(","));
    return api("/api/team/missions/approve-bulk", { method: "POST", body: fd });
  },

  async resolveEscalation(escalationId, status) {
    const fd = new FormData();
    fd.append("status", status);
    return api(`/api/team/escalations/${escalationId}/resolve`, { method: "POST", body: fd });
  }
};
