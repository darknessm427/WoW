// File: worker.js // Cloudflare Worker - بررسی توکن و ارجاع به subscription اصلی

const SUBSCRIPTIONS = { "xray": "https://raw.githubusercontent.com/michaelrezza/wow/refs/heads/main/Xray-WoW.json", "singbox": "https://raw.githubusercontent.com/michaelrezza/wow/refs/heads/main/sing-box.json", "singbox-hiddify": "https://raw.githubusercontent.com/michaelrezza/wow/refs/heads/main/sing-box-hiddify.json", "warp": "https://raw.githubusercontent.com/michaelrezza/wow/refs/heads/main/warp.json", "warp2": "https://raw.githubusercontent.com/michaelrezza/wow/refs/heads/main/warp2.json", "warpauto": "https://raw.githubusercontent.com/michaelrezza/wow/refs/heads/main/warpauto.json" };

const SECRET = "my_super_secret_key"; // تغییر بده به کلید خودت

addEventListener("fetch", event => { event.respondWith(handleRequest(event.request)); });

async function handleRequest(request) { const url = new URL(request.url); const token = url.searchParams.get("token"); if (!token) return new Response("Missing token", { status: 400 });

try { const [payloadB64, signature] = token.split("."); const expectedSig = await hmac(payloadB64); if (expectedSig !== signature) throw new Error("Invalid signature");

const payload = JSON.parse(atob(payloadB64));
if (Date.now() > payload.exp) throw new Error("Token expired");

const subURL = SUBSCRIPTIONS[payload.sub];
if (!subURL) return new Response("Invalid subscription", { status: 404 });

return fetch(subURL);

} catch (e) { return new Response("Forbidden: " + e.message, { status: 403 }); } }

async function hmac(data) { const enc = new TextEncoder(); const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data)); return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, ""); }

// File: .github/workflows/gen-token.yml // GitHub Action - ساخت خودکار توکن با انقضای 3 روزه

name: Generate Token

on: workflow_dispatch: inputs: sub: description: 'نوع subscription (مثلاً: xray, warp, singbox)' required: true

jobs: build: runs-on: ubuntu-latest steps: - name: Set up Node.js uses: actions/setup-node@v3 with: node-version: '18'

- name: Generate Token
    run: |
      const crypto = require('crypto');
      const SECRET = "my_super_secret_key"; // همون کلید Worker
      const sub = process.env.SUB;
      const payload = {
        sub,
        exp: Date.now() + 3 * 24 * 60 * 60 * 1000
      };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const hmac = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url');
      const token = `${payloadB64}.${hmac}`;
      console.log(`\n\nYour secure link:`);
      console.log(`https://YOUR_WORKER_URL.workers.dev/?token=${token}\n\n`);
    env:
      SUB: ${{ github.event.inputs.sub }}

