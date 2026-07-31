# Hermes Workspace access recovery — Be Global / Sales Masterminds

Use when Roger/equipo asks for the password/key to a hosted Hermes Workspace URL, for example `https://hermes.salesmastersminds.com/`, or a similar internal workspace protected by an “Enter Password” screen.

## Safe operating pattern

1. Treat it as internal/admin access, not as an alumno ecommerce question.
2. Load `hermes-agent` for Hermes concepts, but do **not** expose raw secrets/tokens in chat.
3. Verify whether the URL/domain is referenced in the active profile config/logs/files.
4. Check for likely env/config names without printing values:
   - `HERMES_WORKSPACE_PASSWORD`
   - `WORKSPACE_PASSWORD`
   - `PASSWORD`
   - `APP_PASSWORD`
   - `AUTH_PASSWORD`
   - `BWS_ACCESS_TOKEN`
5. If the password is not in the active local profile, say clearly that no fixed password was found locally and route to reset/recovery from the deployment host.

## What to tell the user

- “No encontré una contraseña guardada en este perfil local.”
- “Hermes Workspace normalmente usa una variable de entorno o secreto del despliegue, no una contraseña universal.”
- “Si eres admin/dueño del servidor, hay que revisar el hosting donde vive ese dominio o regenerar la clave.”

## Where to look on the deployment host

Generic shell search:

```bash
grep -Rni "WORKSPACE_PASSWORD\|HERMES_WORKSPACE\|AUTH_PASSWORD\|APP_PASSWORD\|BWS_ACCESS_TOKEN" ~/.hermes .env* /etc 2>/dev/null
```

Docker:

```bash
docker ps
docker inspect <container_id> | grep -i "PASSWORD\|WORKSPACE\|HERMES\|BWS"
```

Common platforms:

- Vercel / Railway / Render / Fly.io / Cloudflare: check Project → Environment Variables / Secrets.
- VPS/systemd: check service unit, `.env`, compose file, or process environment.
- Bitwarden Secrets Manager: check whether `BWS_ACCESS_TOKEN` is configured; the local `config.yaml` may only reference the env var name.

## Guardrails

- Never paste full tokens, refresh tokens, bot tokens, workspace passwords, or API keys into the chat.
- Do not brute-force or bypass the password page.
- If the user is not the owner/admin, tell them to request access from the workspace owner.
- If the user is admin but lacks host access, recommend resetting the secret from the deployment platform instead of guessing.

## Next-step prompt

Ask one routing question only if needed:

“¿Dónde está hosteado ese dominio: VPS/Docker, Vercel, Railway, Render, Cloudflare u otro?”

Then give the exact recovery path for that platform.
