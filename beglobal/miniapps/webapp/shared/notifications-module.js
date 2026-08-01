/* Módulo de notificaciones — In-app y Telegram. */

const NotificationsModule = {
  subscriptionActive: false,

  async subscribe() {
    try {
      await api("/api/notifications/subscribe", { method: "POST" });
      this.subscriptionActive = true;
      this.setupPolling();
    } catch (err) {
      console.error("Error subscribing to notifications:", err);
    }
  },

  setupPolling() {
    setInterval(async () => {
      try {
        const data = await api("/api/notifications/pending");
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.forEach(notif => {
            this.showInAppNotification(notif.type, notif.message, notif.icon);
          });
        }
      } catch (err) {
        // Silently fail, polling continues
      }
    }, 30000); // Poll every 30 seconds
  },

  showInAppNotification(type, message, icon = "ℹ️", duration = 5000) {
    const container = document.getElementById("notifications-container");
    if (!container) {
      const div = document.createElement("div");
      div.id = "notifications-container";
      div.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
      `;
      document.body.appendChild(div);
    }

    const notif = document.createElement("div");
    notif.style.cssText = `
      background: var(--panel);
      border: 2px solid var(--line);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    const iconMap = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
      mission: "🎯",
      achievement: "🏆",
      level_up: "📈",
      escalation: "🚀"
    };

    const displayIcon = iconMap[type] || icon;

    notif.innerHTML = `
      <div style="font-size: 1.5rem;">${displayIcon}</div>
      <div style="flex: 1;">
        <div style="font-weight: 700; margin-bottom: 0.25rem;">
          ${type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
        </div>
        <div style="color: var(--muted); font-size: 0.9rem;">
          ${message}
        </div>
      </div>
      <button onclick="this.parentElement.remove()" style="
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        font-size: 1.2rem;
      ">✕</button>
    `;

    document.getElementById("notifications-container").appendChild(notif);

    setTimeout(() => {
      notif.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notif.remove(), 300);
    }, duration);
  },

  async sendTelegramNotification(event, data) {
    try {
      await api("/api/notifications/telegram-webhook", {
        method: "POST",
        body: new FormData(Object.entries({
          event,
          data: JSON.stringify(data)
        }).reduce((fd, [k, v]) => { fd.append(k, v); return fd; }, new FormData()))
      });
    } catch (err) {
      console.error("Error sending Telegram notification:", err);
    }
  }
};

// Auto-subscribe on load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof NotificationsModule !== "undefined") {
    NotificationsModule.subscribe();
  }
});
