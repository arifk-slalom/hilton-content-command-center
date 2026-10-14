# Content Command Center (prototype)

Art-of-the-possible prototype for the Hilton Content Governance pursuit.
Portfolio Decision Lab + AI Content Auditor + Ask the Hub. All content is synthetic.

## Structure
- `index.html`: the whole app (self-contained: fonts, logo, data, Chart.js from CDN)
- `api/ask.js`: Vercel function that proxies AI calls to the Claude API

Without the API key, the app runs in offline mode (heuristic audits, sample rewrites).

## Run locally
Open `index.html` in a browser (offline mode), or with live AI:
```
npm i -g vercel
vercel dev        # needs ANTHROPIC_API_KEY in .env.local
```

## Deploy
1. Push to a **private** GitHub repo.
2. Vercel → Add New Project → import the repo → Deploy (no build settings needed).
3. Settings → Environment Variables → add `ANTHROPIC_API_KEY` → redeploy.
4. Settings → Deployment Protection → turn on Vercel Authentication or a password,
   so only Slalom folks can open it (it names Hilton and spends API credits).
