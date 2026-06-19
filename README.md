# Sanchi Physiotherapy Clinic — website

Dr. Giridhar Tagade · Mul, Chandrapur · Maharashtra
Static site (HTML / CSS / JS). No build step, no framework.

## Run it locally
```bash
npm run dev          # -> http://localhost:3000
# or just open index.html in a browser (works from file:// too)
```

## Deploy (free)
Drop the whole folder on any static host — Vercel, Netlify, GitHub Pages or Cloudflare Pages. No server needed (`server.js` is only for local preview).

---

## The page, section by section
1. **Hero** — aurora-lit, animated headline, trust badges, photo with floating cards
2. **Impact + credentials** — animated counters and registration badges
3. **About Dr. Tagade** — full bio, qualifications, an ethos quote
4. **Why families choose Sanchi** — six reasons with icons
5. **Conditions we treat** — a scroll-reactive ticker + three grouped lists (30+ conditions)
6. **Treatments & services** — six service cards with hover tilt
7. **PEMF therapy spotlight** — a dedicated explainer band
8. **Your path to recovery** — a 4-step journey timeline
9. **The care we're known for** — three honest care stories
10. **Who we are** — the movement philosophy
11. **FAQ** — six common questions (expandable)
12. **Visit us** — hours, contact, map, and a WhatsApp appointment form
13. **Closing call-to-action** + footer with a back-to-top button
14. **Sticky mobile bar** — Call · WhatsApp · Directions, always within reach

---

## What changed from the very first version
The earlier build had a few details that didn't match Dad's real Wix site. All corrected here with the real info:

| Field | Was (wrong) | Now (correct) |
|------|-------------|---------------|
| Phone | +91 99776 08474 | **+91 93259 26576** |
| Email | — | **drgstagade@gmail.com** |
| Address | "Ward 16, Ashirwad Colony…" | **Mul, Chandrapur, Maharashtra 441224** |
| Hours | 9am–12pm | **8–10 am & 5:30–9 pm** |
| NACAHP no. / ₹400 fee | shown | **removed** (weren't real) |
| Facebook | — | **m.facebook.com/giri.tagade** |

## ⚠️ Please double-check these before going live
1. **Morning hours** read **8–10 am** on the old site. If that's meant to be 8 am–12 pm, fix it (locations below).
2. **PEMF therapy** appears in two places. If Dad doesn't offer it, delete those blocks (search `PEMF`).
3. **FAQ answers** (session length ~30–45 min, "no referral needed") are sensible defaults — confirm with Dad and tweak in the `#faq` section.

## Easy edits — it's all plain text
- **Phone** — search the project for `9325926576` and replace everywhere (used in `tel:`, `wa.me/`, and `CLINIC_WA` in `js/main.js`).
- **Hours** — in `index.html`, search `8:00 – 10:00 am` and `5:30 – 9:00 pm`.
- **Address / email** — search `441224` and `drgstagade@gmail.com`.
- **Counters** — in `index.html`, the `data-to="…"` numbers in the stats band.
- **Map pin** — currently centres on Mul town. To pin the exact clinic: Google Maps → find clinic → Share → Embed a map → paste that `<iframe>` src into the `.map-wrap` iframe.
- **Photos** — replace files in `/images/` (keep the same names) with real clinic photos. A real photo of Dr. Tagade in the **About** section (`images/therapist-shoulder.jpg`) would be the single biggest upgrade.
- **Got real Google/Facebook reviews?** Tell Arnav — a testimonials section can be added with genuine patient quotes (with their permission). They aren't invented here on purpose.

## The appointment form
No backend — on submit it opens **WhatsApp** with the patient's name, phone and request pre-filled, addressed to the clinic. Reliable and free.

## Animations
Motion is adapted from **ryie-fx** (github.com/arnavryie/ryie-fx, MIT), recoloured from the original neon palette to the clinic's clinical teal. Effects used: `splitwords`, `maskwipe`, `counter`, `magnet`, `tilt`, `marquee`, plus an ambient aurora, a travelling “pulse” divider, Lenis smooth-scroll and a scroll-progress bar. **Everything degrades gracefully** — if GSAP/Lenis or JS fail to load, all content stays visible and the site still works.

Built with care by Arnav Tagade — for Dad. ❤️
