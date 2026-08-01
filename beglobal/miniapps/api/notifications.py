"""Sistema de notificaciones para Telegram y in-app.

Maneja:
- Notificaciones push via Telegram Bot API
- Cola de notificaciones pending
- Webhook para eventos críticos
"""
import json
import os
import time
from typing import Dict, List, Optional

TELEGRAM_BOT_TOKENS = {
    "member": os.environ.get("MEMBER_BOT_TOKEN", ""),
    "team": os.environ.get("TEAM_BOT_TOKEN", ""),
    "corporate": os.environ.get("CORPORATE_BOT_TOKEN", ""),
}

NOTIFICATION_QUEUE: Dict[int, List[dict]] = {}


def queue_notification(tg_id: int, notification_type: str, message: str, icon: str = "ℹ️"):
    """Agregar notificación a la cola para un usuario."""
    if tg_id not in NOTIFICATION_QUEUE:
        NOTIFICATION_QUEUE[tg_id] = []

    NOTIFICATION_QUEUE[tg_id].append({
        "type": notification_type,
        "message": message,
        "icon": icon,
        "timestamp": int(time.time())
    })


def get_pending_notifications(tg_id: int) -> List[dict]:
    """Obtener notificaciones pendientes para un usuario."""
    if tg_id in NOTIFICATION_QUEUE:
        notifications = NOTIFICATION_QUEUE[tg_id]
        NOTIFICATION_QUEUE[tg_id] = []
        return notifications
    return []


def send_telegram_message(profile: str, tg_id: int, message: str, parse_mode: str = "HTML") -> bool:
    """Enviar mensaje via Telegram Bot API."""
    token = TELEGRAM_BOT_TOKENS.get(profile)
    if not token:
        print(f"[WARN] No token configurado para perfil {profile}")
        return False

    try:
        import requests
        response = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                "chat_id": tg_id,
                "text": message,
                "parse_mode": parse_mode
            },
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        print(f"[ERROR] Telegram send failed: {e}")
        return False


def notify_mission_approved(member_tg_id: int, mission_title: str, xp_gained: int, new_level: int):
    """Notificar a miembro que su misión fue aprobada."""
    queue_notification(
        member_tg_id,
        "mission",
        f"✅ '{mission_title}' aprobada\n+{xp_gained} XP • Nivel {new_level}",
        "🎯"
    )

    message = f"""
<b>✅ Misión Aprobada</b>

Tu misión <b>{mission_title}</b> fue revisada y aprobada.

<b>+{xp_gained} XP</b>
Nuevo nivel: <b>{new_level}</b>

¡Sigue adelante! 🚀
"""

    send_telegram_message("member", member_tg_id, message)


def notify_mission_rejected(member_tg_id: int, mission_title: str, feedback: str):
    """Notificar a miembro que su misión requiere cambios."""
    queue_notification(
        member_tg_id,
        "mission",
        f"📝 '{mission_title}' requiere cambios",
        "⚠️"
    )

    message = f"""
<b>📝 Se Solicitaron Cambios</b>

Tu misión <b>{mission_title}</b> requiere ajustes.

<b>Feedback:</b>
{feedback or "(sin detalles)"}

Puedes reenviarla en cualquier momento. 💪
"""

    send_telegram_message("member", member_tg_id, message)


def notify_achievement_unlocked(member_tg_id: int, achievement_title: str, achievement_icon: str):
    """Notificar logro desbloqueado."""
    queue_notification(
        member_tg_id,
        "achievement",
        f"Desbloqueaste: {achievement_title}",
        achievement_icon or "🏆"
    )

    message = f"""
<b>{achievement_icon or '🏆'} ¡Nuevo Logro!</b>

Has desbloqueado: <b>{achievement_title}</b>

¡Vas en buen camino! 🎯
"""

    send_telegram_message("member", member_tg_id, message)


def notify_escalation_available(member_tg_id: int, profile: str, message: str):
    """Notificar que el usuario es elegible para escalar."""
    queue_notification(
        member_tg_id,
        "escalation",
        f"¿Listo para escalar a {profile.title()}?",
        "🚀"
    )

    telegram_msg = f"""
<b>🚀 Escalación Disponible</b>

{message}

¿Estás listo para dar el siguiente paso?

Abre la miniapp para continuar. →
"""

    send_telegram_message("member", member_tg_id, telegram_msg)


def notify_team_new_mission(team_tg_id: int, mission_title: str, member_name: str):
    """Notificar a team que hay nueva misión por revisar."""
    queue_notification(
        team_tg_id,
        "mission",
        f"Nueva misión: {mission_title} (por {member_name})",
        "📋"
    )

    message = f"""
<b>📋 Nueva Misión en Revisión</b>

<b>{member_name}</b> envió: <b>{mission_title}</b>

Abre el Centro de Operaciones para revisar. →
"""

    send_telegram_message("team", team_tg_id, message)


def notify_corporate_metrics_update(corporate_tg_id: int, active_socios: int, missions_today: int):
    """Notificar a corporate sobre métricas diarias."""
    message = f"""
<b>📊 Reporte Diario</b>

<b>Socios Activos:</b> {active_socios}
<b>Misiones Hoy:</b> {missions_today}

Torre de Control: consulta para más detalles. →
"""

    send_telegram_message("corporate", corporate_tg_id, message)


# Cleanup old notifications periodically (in-memory cache)
def cleanup_old_notifications(max_age_seconds: int = 3600):
    """Limpiar notificaciones antiguas de la cola."""
    now = int(time.time())
    for tg_id in list(NOTIFICATION_QUEUE.keys()):
        NOTIFICATION_QUEUE[tg_id] = [
            n for n in NOTIFICATION_QUEUE[tg_id]
            if now - n.get("timestamp", 0) < max_age_seconds
        ]
        if not NOTIFICATION_QUEUE[tg_id]:
            del NOTIFICATION_QUEUE[tg_id]
