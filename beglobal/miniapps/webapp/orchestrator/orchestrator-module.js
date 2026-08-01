/* Módulo orquestador central — Router y detección de perfil. */

const Orchestrator = {
  async detectProfile() {
    return api("/api/orchestrator/detect-profile");
  },

  async getOnboardingStatus() {
    return api("/api/orchestrator/onboarding-status");
  },

  async acknowledgeSetup() {
    return api("/api/orchestrator/acknowledge-setup", { method: "POST" });
  },

  getRedirectTarget(profile) {
    const targets = {
      member: "../member/",
      team: "../team/",
      corporate: "../corporate/"
    };
    return targets[profile] || null;
  },

  showLoading(container, message = "Cargando...") {
    container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        flex-direction: column;
        gap: 1.5rem;
        background: linear-gradient(135deg, var(--teal), var(--bg));
      ">
        <div style="font-size: 3rem; animation: pulse 1.5s ease-in-out infinite;">⏳</div>
        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text);">
          ${message}
        </div>
        <div style="
          width: 40px;
          height: 4px;
          background: var(--panel-soft);
          border-radius: 2px;
          overflow: hidden;
        ">
          <div style="
            width: 50%;
            height: 100%;
            background: var(--cyan);
            animation: slideRight 1.5s ease-in-out infinite;
          "></div>
        </div>
      </div>
    `;
  },

  showSetupWizard(container, profile, onboarding) {
    container.innerHTML = `
      <div style="
        padding: 2rem;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      ">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
          <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Bienvenido a Be Global</h1>
          <p style="color: var(--muted); font-size: 1rem;">
            ${profile.profile === 'member' ? 'Comencemos tu viaje de aprendizaje' : 'Estás listo para gobernar'}
          </p>
        </div>

        <div class="card" style="margin-bottom: 1.5rem;">
          <h2 style="margin-bottom: 1rem;">📋 Próximos pasos</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${profile.profile === 'member' ? `
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <span style="
                  width: 30px; height: 30px; background: var(--cyan);
                  border-radius: 50%; display: flex; align-items: center;
                  justify-content: center; color: #04222b; font-weight: 700;
                  flex-shrink: 0;
                ">1</span>
                <div>
                  <div style="font-weight: 700;">Responder diagnóstico</div>
                  <div style="color: var(--muted-2); font-size: 0.9rem;">5 preguntas sobre tu experiencia</div>
                </div>
              </div>
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <span style="
                  width: 30px; height: 30px; background: var(--panel-soft);
                  border-radius: 50%; display: flex; align-items: center;
                  justify-content: center; color: var(--muted); font-weight: 700;
                  flex-shrink: 0;
                ">2</span>
                <div>
                  <div style="font-weight: 700;">Aprender y practicar</div>
                  <div style="color: var(--muted-2); font-size: 0.9rem;">Accede a lecciones personalizadas</div>
                </div>
              </div>
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <span style="
                  width: 30px; height: 30px; background: var(--panel-soft);
                  border-radius: 50%; display: flex; align-items: center;
                  justify-content: center; color: var(--muted); font-weight: 700;
                  flex-shrink: 0;
                ">3</span>
                <div>
                  <div style="font-weight: 700;">Completar misiones</div>
                  <div style="color: var(--muted-2); font-size: 0.9rem;">Entregar evidencia y ganar XP</div>
                </div>
              </div>
            ` : `
              <div style="
                background: var(--panel-soft); padding: 1rem; border-radius: 12px;
                color: var(--cyan); font-weight: 700; text-align: center;
              ">
                ✅ Cuenta activada en perfil ${profile.profile}
              </div>
            `}
          </div>
        </div>

        <button class="btn btn-large" id="btn-start" style="margin-bottom: 1rem;">
          Continuar →
        </button>
        <button class="btn" style="background: var(--panel-soft); color: var(--muted);" onclick="backToChat()">
          Volver al chat
        </button>
      </div>
    `;

    document.getElementById("btn-start").addEventListener("click", async () => {
      try {
        await this.acknowledgeSetup();
        location.reload();
      } catch (err) {
        toast("Error: " + err.message, true);
      }
    });
  },

  showError(container, message) {
    container.innerHTML = `
      <div style="
        padding: 2rem;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h1 style="font-size: 1.2rem; margin-bottom: 1rem;">Error de autenticación</h1>
        <p style="
          color: var(--muted);
          text-align: center;
          margin-bottom: 1.5rem;
          max-width: 400px;
        ">
          ${message}
        </p>
        <button class="btn" onclick="location.reload()">
          Reintentar
        </button>
        <button class="btn" style="background: var(--panel-soft); color: var(--muted); margin-top: 1rem;" onclick="backToChat()">
          Volver al chat
        </button>
      </div>
    `;
  }
};
