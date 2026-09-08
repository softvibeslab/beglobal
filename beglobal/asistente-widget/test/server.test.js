"use strict";
const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const port = 18655;
const upstreamPort = 18656;
const origin = "https://chatbeglobal.softvibes.pro";
let app;
let upstream;
let lastRequest;
async function waitFor(url) { for (let i=0;i<40;i+=1) { try { if ((await fetch(url)).ok) return; } catch {} await new Promise(r=>setTimeout(r,100)); } throw new Error("not ready"); }
function cookieFrom(response) { return response.headers.get("set-cookie").split(";")[0]; }
async function createSession(ip="203.0.113.10") {
  const response = await fetch(`http://127.0.0.1:${port}/api/session`, { method:"POST", headers:{ Origin:origin, "X-Forwarded-For":ip, "Content-Type":"application/json" }, body:"{}" });
  return { response, cookie:cookieFrom(response), csrf:(await response.json()).csrf };
}
before(async()=>{
  upstream=http.createServer(async(req,res)=>{ const chunks=[]; for await(const c of req) chunks.push(c); lastRequest={headers:req.headers,body:JSON.parse(Buffer.concat(chunks))}; res.writeHead(200,{"Content-Type":"application/json"}); res.end(JSON.stringify({choices:[{message:{content:"Respuesta pública segura"}}]})); });
  await new Promise(r=>upstream.listen(upstreamPort,"127.0.0.1",r));
  app=spawn(process.execPath,["server.js"],{cwd:path.resolve(__dirname,".."),env:{...process.env,PORT:String(port),HOST:"127.0.0.1",HERMES_BASE_URL:`http://127.0.0.1:${upstreamPort}`,API_SERVER_KEY:"test-key-with-safe-length",ALLOWED_ORIGIN:origin}});
  await waitFor(`http://127.0.0.1:${port}/healthz`);
});
after(async()=>{app?.kill("SIGTERM");if(upstream)await new Promise(r=>upstream.close(r));});
test("serves iframe-safe shell",async()=>{const r=await fetch(`http://127.0.0.1:${port}/`);const h=await r.text();assert.equal(r.status,200);assert.match(r.headers.get("content-security-policy"),/frame-ancestors https:\/\/beglobal\.softvibes\.pro/);assert.match(h,/Be Global Asistente/);});
test("requires exact origin to create session",async()=>{const r=await fetch(`http://127.0.0.1:${port}/api/session`,{method:"POST",headers:{Origin:"https://evil.example"}});assert.equal(r.status,403);});
test("uses HttpOnly cookie, CSRF and fixed profile",async()=>{const s=await createSession();assert.equal(s.response.status,201);assert.match(s.response.headers.get("set-cookie"),/HttpOnly; Secure; SameSite=Lax/);const r=await fetch(`http://127.0.0.1:${port}/api/chat`,{method:"POST",headers:{Origin:origin,Cookie:s.cookie,"X-BeGlobal-CSRF":s.csrf,"Content-Type":"application/json"},body:JSON.stringify({message:"¿Qué es Be Global?"})});assert.equal(r.status,200);assert.deepEqual(await r.json(),{message:"Respuesta pública segura"});assert.equal(lastRequest.body.model,"beglobalasistente");assert.deepEqual(lastRequest.body.messages,[{role:"user",content:"¿Qué es Be Global?"}]);assert.match(lastRequest.headers["x-hermes-session-key"],/^web:/);});
test("rejects client model and role overrides",async()=>{const s=await createSession("203.0.113.11");const r=await fetch(`http://127.0.0.1:${port}/api/chat`,{method:"POST",headers:{Origin:origin,Cookie:s.cookie,"X-BeGlobal-CSRF":s.csrf,"Content-Type":"application/json"},body:JSON.stringify({message:"hola",model:"otro",role:"system"})});assert.equal(r.status,400);});
test("does not accept another session without its CSRF",async()=>{const a=await createSession("203.0.113.12");const b=await createSession("203.0.113.13");const r=await fetch(`http://127.0.0.1:${port}/api/chat`,{method:"POST",headers:{Origin:origin,Cookie:a.cookie,"X-BeGlobal-CSRF":b.csrf,"Content-Type":"application/json"},body:JSON.stringify({message:"hola"})});assert.equal(r.status,403);});
test("frontend renders assistant output as text",async()=>{const r=await fetch(`http://127.0.0.1:${port}/app.js`);const script=await r.text();assert.match(script,/article\.textContent = text/);assert.doesNotMatch(script,/innerHTML/);});
