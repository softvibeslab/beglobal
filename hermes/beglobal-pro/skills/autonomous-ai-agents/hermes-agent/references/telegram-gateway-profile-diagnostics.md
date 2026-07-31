# Telegram gateway / profile diagnostics

Use this when a Telegram user says a Hermes profile, bot, or DM is “down”, “old”, or showing `Provider authentication failed: No Codex credentials stored`.

## Safe diagnostic order

1. **Do not send probe messages to contacts unless the user explicitly approves the exact target and message.** First inspect local state.
2. List visible delivery targets:
   - Tool: `send_message(action="list")`
   - CLI/config file: inspect `<HERMES_HOME>/channel_directory.json` for Telegram chat IDs, names, and group/DM type.
3. List profiles and gateways:
   - `hermes profile list`
   - `systemctl --user list-units --type=service --all --no-pager | grep -i -E 'hermes|openclaw'`
   - `ps -eo pid,ppid,etimes,cmd | grep -i -E 'hermes|openclaw' | grep -v grep`
4. Check the specific profile status/auth:
   - `hermes --profile <profile> status --all`
   - `hermes --profile <profile> auth list`
   - `hermes --profile <profile> gateway status`
5. Check recent Telegram gateway logs by chat/user ID:
   - `tail -n 300 ~/.hermes/profiles/<profile>/logs/gateway.log | grep -i -E '<name>|<chat_id>|error|failed|exception|traceback|inbound message|response ready|Sending response'`
   - `tail -n 100 ~/.hermes/profiles/<profile>/logs/errors.log`

## Interpreting common findings

- `Provider authentication failed: No Codex credentials stored` usually means the running profile/instance lacks Codex OAuth credentials, or the user is interacting with an older gateway/profile than the one being inspected.
- `hermes profile list` is the source of truth for profile names on the current machine. Do not assume project folder names (e.g. app repo names) are Hermes profile names.
- A web/app stack can be healthy while the Hermes bot/profile is broken. Check app containers separately from Hermes gateway/profile status.
- Multiple services may coexist: a profile-specific Hermes gateway, an old default `hermes-gateway.service`, and legacy services such as OpenClaw. Map the Telegram chat to the service before restarting or messaging anyone.

## If an accidental Telegram message was sent

If the bot token is available and the message ID is known, delete with Telegram Bot API without printing the token:

```bash
python - <<'PY'
import os, urllib.request, urllib.parse, json
from pathlib import Path
for p in [Path('/root/.hermes/profiles/<profile>/.env'), Path('/root/.hermes/.env')]:
    if p.exists():
        for line in p.read_text().splitlines():
            if line.startswith('TELEGRAM_BOT_TOKEN='):
                os.environ['TELEGRAM_BOT_TOKEN'] = line.split('=', 1)[1].strip().strip('"').strip("'")
                break
    if os.environ.get('TELEGRAM_BOT_TOKEN'):
        break
params = urllib.parse.urlencode({'chat_id': '<chat_id>', 'message_id': '<message_id>'}).encode()
url = f"https://api.telegram.org/bot{os.environ['TELEGRAM_BOT_TOKEN']}/deleteMessage"
with urllib.request.urlopen(url, data=params, timeout=20) as r:
    print(r.read().decode())
PY
```

Replace `<profile>`, `<chat_id>`, and `<message_id>` before running.
