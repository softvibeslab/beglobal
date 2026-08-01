/* Módulo de escalación — Detección automática y flujo de upgrade. */

const EscalationModule = {
  async checkEligibility() {
    return api("/api/escalation/check-eligibility");
  },

  async performEscalation(fromProfile, toProfile) {
    const fd = new FormData();
    fd.append("from_profile", fromProfile);
    fd.append("to_profile", toProfile);
    return api("/api/member/escalate-to-team", { method: "POST", body: fd });
  },

  async performTeamEscalation() {
    const fd = new FormData();
    return api("/api/team/escalate-to-corporate", { method: "POST", body: fd });
  },

  async acknowledgeSuggestion(escalationId) {
    const fd = new FormData();
    fd.append("escalation_id", escalationId);
    return api("/api/escalation/acknowledge-suggestion", { method: "POST", body: fd });
  },

  showEscalationModal(fromProfile, toProfile, milestone, bonusXP) {
    const modal = document.createElement("div");
    modal.className = "escalation-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;

    const titles = {
      "member-team": "¡Lo estás haciendo bien!",
      "team-corporate": "¡Tiempo de gobernar!"
    };

    const descriptions = {
      "member-team": "Completaste tus primeras misiones. ¿Listo para ayudar a otros?",
      "team-corporate": "Revisaste muchas misiones. ¿Listo para gobernar el sistema?"
    };

    const benefits = {
      "member-team": ["Revisar trabajo de otros", "Dar feedback", "Ganar más XP", "Nuevo badge: Team Ally"],
      "team-corporate": ["Ver métricas globales", "Tomar decisiones", "Gates de despliegue", "Role: Gobernanza"]
    };

    const key = `${fromProfile}-${toProfile}`;

    modal.innerHTML = `
      <div style="
        background: var(--panel);
        border-radius: 24px;
        padding: 2rem;
        max-width: 500px;
        text-align: center;
        animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem; animation: float 2s ease-in-out infinite;">
          🚀
        </div>

        <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">
          ${titles[key] || "¡Escalación!"}
        </h2>

        <p style="color: var(--muted); margin-bottom: 1.5rem; font-size: 1rem;">
          ${descriptions[key] || "Cumpliste los criterios"}
        </p>

        <div style="
          background: var(--panel-soft);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          text-align: left;
        ">
          <div style="font-weight: 700; margin-bottom: 0.5rem;">✨ Beneficios:</div>
          ${(benefits[key] || []).map(b => `
            <div style="padding: 0.3rem 0; color: var(--cyan);">✓ ${b}</div>
          `).join("")}
          ${bonusXP ? `
            <div style="padding: 0.5rem 0; margin-top: 0.5rem; font-weight: 700; color: var(--green);">
              + ${bonusXP} XP Bonus
            </div>
          ` : ""}
        </div>

        <button class="btn btn-large" id="btn-escalate-yes" style="margin-bottom: 1rem;">
          Sí, continuar →
        </button>

        <button class="btn" style="background: var(--panel-soft); color: var(--muted); width: 100%;" id="btn-escalate-no">
          Ahora no
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btn-escalate-yes").addEventListener("click", async () => {
      try {
        modal.style.opacity = "0";
        const result = toProfile === "team"
          ? await EscalationModule.performEscalation(fromProfile, toProfile)
          : await EscalationModule.performTeamEscalation();

        celebrate();
        notifyLevelUp(0, "¡Escalado! 🎉");
        modal.remove();
        location.reload();
      } catch (err) {
        toast("Error en escalación: " + err.message, true);
        modal.remove();
      }
    });

    document.getElementById("btn-escalate-no").addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }
};
