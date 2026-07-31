# Telegram onboarding MiniApp troubleshooting

Use this when applying the Be Global Pro onboarding MiniApp to Telegram chats/groups.

## Key Telegram behavior

- A normal URL button or pasted link may open as a browser/webview page, not as a MiniApp popup.
- Telegram can reject `inline_keyboard` buttons using `web_app` in groups with `BUTTON_TYPE_INVALID`.
- For groups, the reliable pattern is: post a normal link or button that sends the user to the bot/DM; open the MiniApp from the bot private chat via the menu button or a DM web_app button.
- Configure the bot DM menu button with `setChatMenuButton` using `{type: "web_app", text: "Diagnóstico", web_app: {url}}` when possible.

## Quick Cloudflare tunnel pitfall

Account-less `trycloudflare.com` quick tunnels are temporary. If the user sees Cloudflare `Error 1016 / Origin DNS error`, assume the previous tunnel URL expired or the tunnel process died.

Recovery pattern:

1. Check whether the local HTTP server and `cloudflared` processes are still alive.
2. If not alive, restart the local server from the MiniApp directory.
3. Start a new quick tunnel.
4. Extract the new `trycloudflare.com` URL from the tunnel log.
5. Verify the new MiniApp URL opens before sending it.
6. Update the bot DM menu button to the new URL.
7. Post the new direct link in the group as fallback.

## Messaging pattern

When a user reports “no aparece”, “abre en otra página” or sends an error screenshot:

- Acknowledge briefly.
- Explain the root cause in one line.
- Fix it immediately if tools/credentials are available.
- Send the new link or tell them exactly which chat to open.
- Avoid long explanations unless they ask.

## Production recommendation

For production, do not rely on a quick tunnel. Publish the MiniApp to a permanent HTTPS URL such as Cloudflare Pages, Vercel, or Netlify, then set that URL in BotFather / Telegram menu button.