# Atlas — Interactive Prototype (Phase 1)

**On-Demand Logistics & Moving Super-App** · Customer · Driver · Admin · Business
We Are Amnet · Operations · Launch market: Malaysia / SE Asia

This is a **clickable, front-end-only prototype** built for stakeholder review and approval. There is no live backend — the AI Quotation Engine, live tracking, dispatch, and analytics are simulated with realistic demo data so reviewers can walk the full experience on a phone or laptop. Phase 2 is the real build.

---

## What's inside

| Surface | Folder | Highlights |
|---|---|---|
| **Launcher** | `index.html` | Entry hub — pick a surface to demo |
| **Customer app** | `customer/` | Send / Move / Transport. **AI Quotation Engine** hero flow: capture → scan animation → editable item list → vehicle recommendation → add-ons → package quote → tracking |
| **Driver & Mover app** | `driver/` | Go online, matched job with accept timer, navigation, item checklist, proof of delivery, earnings & wallet |
| **Admin dashboard** | `admin/` | Live order map & heatmap, dispatch queue, pricing & surge, driver approval, fraud queue, AI-accuracy analytics |
| **Business / Enterprise** | `business/` | Bulk/recurring booking, fleet, multi-branch, consolidated invoicing, analytics, API & integrations |

The **AI Quote** demo supports both a scripted scan animation **and** a scenario picker (Studio / 2-Bedroom / Office). Editing the item list live recalculates volume, recommended vehicle, and price.

---

## Run it locally

It's plain HTML/CSS/JS — no build step. Either:

**Option A — just open it**
Open `index.html` in a browser. (The dashboards work fully; for the mobile apps a local server is recommended so shared assets load cleanly.)

**Option B — local server (recommended)**
```bash
cd atlas-prototype
python3 -m http.server 8080
# then open http://localhost:8080
```

Best viewed on a phone, or in a browser with mobile device emulation (the customer/driver apps render inside a phone frame on desktop too).

---

## Push to GitHub + host for phone testing (GitHub Pages)

1. **Create a repo** on GitHub, e.g. `atlas-prototype` (public, or private with Pages enabled on your plan).

2. **Push this folder:**
   ```bash
   cd atlas-prototype
   git init
   git add .
   git commit -m "Atlas prototype — Phase 1 (4 surfaces)"
   git branch -M main
   git remote add origin https://github.com/<your-username>/atlas-prototype.git
   git push -u origin main
   ```

3. **Enable Pages:** repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / root → Save.**

4. After ~1 minute your live demo is at:
   ```
   https://<your-username>.github.io/atlas-prototype/
   ```
   Share that link — stakeholders can open every surface on their own phones.

> `.nojekyll` is included so GitHub Pages serves all files as-is.

---

## Notes for reviewers / open questions (from the PRD)

This prototype visualises decisions still open for sign-off — surfacing them is part of the goal:

- Vision-LLM provider for the launch quotation engine
- Launch payment gateway + e-wallet set (GrabPay / Touch 'n Go / Boost shown)
- On-site discrepancy / re-quote policy when actual load exceeds estimate
- Commission take-rate per line + enterprise subscription tiers
- Native vs cross-platform build for Phase 2

---

## Tech

Vanilla HTML/CSS/JS. No frameworks, no dependencies, no tracking. Inter font via Google Fonts (degrades gracefully offline). All icons are inline SVG. Single shared design system in `css/atlas.css` + helpers in `js/atlas.js`.

*Prototype only — not for production use.*
