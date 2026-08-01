/* Duolingo Gamification Functions for Be Global */

/**
 * Celebración visual cuando completa una acción
 */
function celebrate() {
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  document.body.appendChild(confetti);

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.textContent = ["🎉", "⭐", "🚀", "✨", "🏆"][Math.floor(Math.random() * 5)];
    piece.style.left = Math.random() * 100 + "%";
    piece.style.top = "-20px";
    confetti.appendChild(piece);
  }

  setTimeout(() => confetti.remove(), 3000);
}

/**
 * Mostrar notificación de logro desbloqueado
 */
function notifyAchievement(achievement) {
  const modal = document.createElement("div");
  modal.className = "achievement-modal";
  modal.innerHTML = `
    <div class="achievement-card">
      <div class="icon">${achievement.icon || "🏆"}</div>
      <h2>¡Logro desbloqueado!</h2>
      <p>${achievement.title}</p>
      <small>${achievement.description}</small>
      <button class="btn" onclick="this.closest('.achievement-modal').remove()" style="margin-top: 1rem;">Continuar</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Auto-dismiss después de 5 segundos
  setTimeout(() => {
    if (modal.parentElement) modal.remove();
  }, 5000);
}

/**
 * Mostrar notificación de level up
 */
function notifyLevelUp(newLevel) {
  const toast = document.createElement("div");
  toast.className = "level-up-toast";
  toast.textContent = `🎉 ¡Level ${newLevel}! ¡Vas muy bien!`;
  document.body.appendChild(toast);

  celebrate();
  setTimeout(() => toast.remove(), 3000);
}

/**
 * Animar XP bar cuando gana XP
 */
function animateXPGain(xpAmount) {
  const bar = document.getElementById("xp-fill");
  if (!bar) return;

  const label = document.getElementById("xp-label");
  const floatingText = document.createElement("div");
  floatingText.style.cssText = `
    position: absolute;
    color: var(--green);
    font-weight: 900;
    font-size: 1.2rem;
    pointer-events: none;
  `;
  floatingText.textContent = `+${xpAmount} XP`;

  bar.parentElement.appendChild(floatingText);

  let top = 0;
  const interval = setInterval(() => {
    top -= 2;
    floatingText.style.transform = `translateY(${top}px)`;
    floatingText.style.opacity = 1 - top / 50;
    if (top < -50) {
      clearInterval(interval);
      floatingText.remove();
    }
  }, 30);
}

/**
 * Animar racha cuando se completa una misión diaria
 */
function animateStreakIncrease(oldStreak, newStreak) {
  const streakDisplay = document.getElementById("stat-streak");
  if (!streakDisplay) return;

  streakDisplay.style.transition = "none";
  streakDisplay.style.transform = "scale(1.5)";
  streakDisplay.style.color = "var(--amber)";

  setTimeout(() => {
    streakDisplay.textContent = newStreak;
    streakDisplay.style.transition = "all 0.3s ease";
    streakDisplay.style.transform = "scale(1)";
  }, 100);

  setTimeout(() => {
    streakDisplay.style.color = "";
  }, 600);
}

/**
 * Desbloquear nodo de lección visualmente
 */
function unlockLessonNode(lessonId) {
  const node = document.querySelector(`[data-lesson-id="${lessonId}"]`);
  if (!node) return;

  node.classList.remove("locked");
  node.classList.add("unlocked", "celebrate");

  setTimeout(() => {
    node.classList.remove("celebrate");
  }, 600);
}

/**
 * Marcar nodo de lección como completada
 */
function completeLessonNode(lessonId) {
  const node = document.querySelector(`[data-lesson-id="${lessonId}"]`);
  if (!node) return;

  node.classList.add("completed", "celebrate");
  node.style.pointerEvents = "none";
}

/**
 * Animar desbloqueo de logro
 */
function unlockAchievementBadge(achievementCode) {
  const badge = document.querySelector(`[data-achievement-code="${achievementCode}"]`);
  if (!badge) return;

  badge.classList.remove("locked");
  badge.classList.add("unlocked", "celebrate");

  setTimeout(() => {
    badge.classList.remove("celebrate");
  }, 600);
}

/**
 * Actualizar contador de misiones completadas
 */
function updateMissionCounter(count) {
  const counter = document.getElementById("stat-missions");
  if (!counter) return;

  counter.textContent = count;
  counter.classList.add("celebrate");
  setTimeout(() => counter.classList.remove("celebrate"), 600);
}

/**
 * Actualizar contador de lecciones completadas
 */
function updateLessonCounter(count) {
  const counter = document.getElementById("stat-lessons");
  if (!counter) return;

  counter.textContent = count;
  counter.classList.add("celebrate");
  setTimeout(() => counter.classList.remove("celebrate"), 600);
}

/**
 * Actualizar barra de progreso de XP
 */
function updateXPBar(xpCurrent, xpNext) {
  const bar = document.getElementById("xp-fill");
  const label = document.getElementById("xp-label");
  if (!bar) return;

  const pct = Math.round((xpCurrent / xpNext) * 100);
  bar.style.width = pct + "%";

  if (label) {
    label.textContent = `${xpCurrent} / ${xpNext} XP`;
  }
}

/**
 * Actualizar nivel visible
 */
function updateLevelDisplay(newLevel) {
  const display = document.getElementById("stat-level");
  if (!display) return;

  const oldLevel = parseInt(display.textContent);
  if (newLevel > oldLevel) {
    notifyLevelUp(newLevel);
  }

  display.textContent = newLevel;
}

/**
 * Mostrar estado de misión en card
 */
function setMissionCardStatus(missionId, status) {
  const card = document.querySelector(`[data-mission-id="${missionId}"]`);
  if (!card) return;

  card.className = "mission-card";
  card.classList.add(status);

  if (status === "completed") {
    card.style.pointerEvents = "none";
  }
}

/**
 * Habilitar archivo upload con preview
 */
function setupFileUpload(fileInputId, previewId) {
  const input = document.getElementById(fileInputId);
  const preview = document.getElementById(previewId);

  if (!input) return;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (preview) {
        if (file.type.startsWith("image/")) {
          preview.innerHTML = `<img src="${event.target.result}" style="max-width: 100%; border-radius: 8px;">`;
        } else if (file.type.startsWith("video/")) {
          preview.innerHTML = `<video src="${event.target.result}" style="max-width: 100%; border-radius: 8px;" controls></video>`;
        } else {
          preview.innerHTML = `<div style="text-align: center; padding: 1rem;"><span style="font-size: 2rem;">📎</span><p>${file.name}</p></div>`;
        }
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Sistema de racha visual
 */
function updateStreakDisplay(current, best) {
  const streakSpan = document.getElementById("stat-streak");
  if (streakSpan) {
    streakSpan.textContent = current;
    streakSpan.className = current > 0 ? "" : "no-streak";
  }

  const fireIcon = document.querySelector(".streak-display .fire");
  if (fireIcon && current > 0) {
    fireIcon.style.animation = "float 3s ease-in-out infinite";
  }
}

/**
 * Debounce para prevenir clicks múltiples
 */
function debounce(fn, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Validar forma antes de enviar
 */
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll("input[required], textarea[required]");
  for (let input of inputs) {
    if (!input.value.trim()) {
      toast(`Por favor llena: ${input.placeholder || input.name}`, true);
      input.focus();
      return false;
    }
  }
  return true;
}

/**
 * Transición suave entre páginas
 */
function transitionToPage(url) {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";
  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

/**
 * Inicializar observers para lazy-loading de assets
 */
function setupLazyLoading() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    observer.observe(img);
  });
}

/**
 * Guardar estado local para offline support
 */
const localState = {
  set(key, value) {
    try {
      localStorage.setItem(`beglobal_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("LocalStorage no disponible:", e);
    }
  },
  get(key) {
    try {
      const item = localStorage.getItem(`beglobal_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(`beglobal_${key}`);
    } catch (e) {
      console.warn("LocalStorage no disponible:", e);
    }
  }
};

/**
 * Inicializar Telegram Mini App
 */
function initTelegramWebApp() {
  if (typeof Telegram !== "undefined" && Telegram.WebApp) {
    const tg = Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();

    // Aplicar tema de Telegram si está disponible
    if (tg.themeParams?.bg_color) {
      document.documentElement.style.setProperty("--bg", tg.themeParams.bg_color);
    }

    return tg;
  }
  return null;
}

/**
 * Volver al chat de Telegram
 */
function backToChat() {
  if (typeof Telegram !== "undefined" && Telegram.WebApp) {
    Telegram.WebApp.close();
  }
}

// Inicializar cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  setupLazyLoading();
  initTelegramWebApp();
});
