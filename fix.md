# PATCH — Fix blank hero headline + enrich hero left column
## File: `clinic` repo (your dad's physio site)

Apply every change below in order. Each block shows the **exact old string → exact new string**.
No other files need to change.

---

## 1. `style.css` — Fix 3 hero CSS issues

### 1a. Remove the CSS that hides `.fx-word-in` before JS runs
(We will hide them in JS instead so the element is always visible as a fallback)

**FIND exactly:**
```css
/* word-rise (ryie-fx splitwords) */
.fx-word { display: inline-block; overflow: hidden; vertical-align: top; }
.fx-word-in { display: inline-block; will-change: transform; }
.js .fx-words .fx-word-in { transform: translateY(110%); }
```

**REPLACE WITH:**
```css
/* word-rise (ryie-fx splitwords) */
.fx-word { display: inline-block; overflow: hidden; vertical-align: top; }
.fx-word-in { display: inline-block; will-change: transform; opacity: 1; }
/* NOTE: words are hidden in JS (ryie-fx.js) not CSS, so no-JS = always visible */
```

---

### 1b. Tighten hero padding + make headline color pop on both themes

**FIND exactly:**
```css
.hero { position: relative; padding: 104px 0 40px; overflow: hidden; }
.hero-grid { display: grid; gap: 26px; }
```

**REPLACE WITH:**
```css
.hero { position: relative; padding: 96px 0 44px; overflow: hidden; }
.hero-grid { display: grid; gap: 26px; }
/* ensure headline always visible even mid-animation */
.hero h1 { opacity: 1 !important; }
```

---

### 1c. Add a hero highlight strip — a thin teal accent line left of the headline block

**FIND exactly:**
```css
.hero h1 { font-size: clamp(38px, 11vw, 76px); letter-spacing: -0.025em; }
.hero h1 .accent { color: var(--teal); }
.hero .lede { color: var(--slate); font-size: 17px; max-width: 56ch; }
.hero-actions { display: flex; flex-direction: column; gap: 12px; }
```

**REPLACE WITH:**
```css
.hero h1 { font-size: clamp(38px, 11vw, 76px); letter-spacing: -0.025em; margin: 18px 0 20px; }
.hero h1 .accent { color: var(--teal); }
.hero .lede { color: var(--slate); font-size: 17px; max-width: 56ch; margin-bottom: 6px; }
.hero-actions { display: flex; flex-direction: column; gap: 12px; }

/* hero micro-details strip — fills the gap between badge and headline */
.hero-meta {
  display: flex; align-items: center; gap: 10px; margin: 14px 0 0;
  font-family: var(--mono); font-size: 12px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--teal);
}
.hero-meta::before {
  content: ""; display: block; width: 28px; height: 2px;
  background: var(--grad); border-radius: 2px; flex: none;
}

/* availability pill */
.avail-pill {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(15,148,136,.1); border: 1px solid rgba(15,148,136,.25);
  color: var(--pine); border-radius: var(--r-pill);
  padding: 6px 13px; font-size: 13px; font-weight: 600; margin: 0 0 4px;
}
.avail-pill .blink {
  width: 8px; height: 8px; border-radius: 50%; background: var(--teal-bright);
  box-shadow: 0 0 0 0 rgba(25,194,176,.7);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%   { box-shadow: 0 0 0 0 rgba(25,194,176,.7); }
  60%  { box-shadow: 0 0 0 7px rgba(25,194,176,.0); }
  100% { box-shadow: 0 0 0 0 rgba(25,194,176,.0); }
}

/* hero specialties mini-row below trust bullets */
.hero-specs {
  margin-top: 20px; padding-top: 18px;
  border-top: 1px dashed var(--line);
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.hero-spec {
  display: flex; align-items: flex-start; gap: 9px;
  font-size: 13px; color: var(--ink-soft);
}
.hero-spec .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal-soft);
  border: 2px solid var(--teal); flex: none; margin-top: 5px; }
.hero-spec .dot.warm { background: #fde7dc; border-color: var(--coral); }
```

---

### 1d. Desktop: fix hero-grid min-height so it never feels short

**FIND exactly (in the `@media (min-width: 861px)` block):**
```css
  .hero { padding: 130px 0 60px; }
  .hero-grid { grid-template-columns: 1.05fr .95fr; align-items: center; gap: 50px; }
```

**REPLACE WITH:**
```css
  .hero { padding: 118px 0 60px; }
  .hero-grid { grid-template-columns: 1.05fr .95fr; align-items: center; gap: 50px; min-height: 520px; }
```

---

## 2. `index.html` — Replace hero `<header>` content

**FIND exactly (the full opening div of hero-copy):**
```html
      <div class="hero-copy">
        <span class="hero-badge reveal"><span class="dot"></span> Mul · Chandrapur · Maharashtra</span>
        <h1 class="fx-words" data-fx="splitwords"><span class="fx-word"><span class="fx-word-in">Keeping</span></span> <span class="fx-word"><span class="fx-word-in">you</span></span> <span class="fx-word"><span class="fx-word-in accent">moving.</span></span></h1>
        <p class="lede reveal d1">Sanchi Physiotherapy Clinic welcomes you. For more than 17 years, Dr. Giridhar Tagade has helped the people of Mul and Chandrapur recover from pain, injury and surgery — and get back to the life they love.</p>
        <div class="hero-actions reveal d2">
          <a href="tel:+919325926576" class="btn btn-primary" data-fx="magnet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call for appointment
          </a>
          <a href="#conditions" class="btn btn-ghost">See what we treat</a>
        </div>
        <ul class="hero-trust reveal d3">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></svg> 17+ years</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M8 13v8l4-2 4 2v-8"/></svg> IAP life member</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> Home visits</li>
        </ul>
      </div>
```

**REPLACE WITH:**
```html
      <div class="hero-copy">

        <!-- availability ping -->
        <span class="avail-pill reveal"><span class="blink"></span> Now accepting patients</span>

        <!-- location kicker -->
        <div class="hero-meta reveal">Mul · Chandrapur · Maharashtra</div>

        <!-- headline — words animate in on load -->
        <h1 class="fx-words" data-fx="splitwords">
          <span class="fx-word"><span class="fx-word-in">Keeping</span></span>
          <span class="fx-word"><span class="fx-word-in">you</span></span>
          <span class="fx-word"><span class="fx-word-in accent">moving.</span></span>
        </h1>

        <p class="lede reveal d1">Sanchi Physiotherapy Clinic welcomes you. For more than 17 years, Dr. Giridhar Tagade has helped the people of Mul and Chandrapur recover from pain, injury and surgery — and get back to the life they love.</p>

        <div class="hero-actions reveal d2">
          <a href="tel:+919325926576" class="btn btn-primary" data-fx="magnet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call for appointment
          </a>
          <a href="#conditions" class="btn btn-ghost">See what we treat</a>
        </div>

        <!-- trust badges -->
        <ul class="hero-trust reveal d3">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></svg>
            17+ years
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M8 13v8l4-2 4 2v-8"/></svg>
            IAP life member
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Home visits
          </li>
        </ul>

        <!-- specialties grid — fills remaining vertical space, adds substance -->
        <div class="hero-specs reveal d3">
          <div class="hero-spec"><span class="dot"></span> Joint &amp; knee pain</div>
          <div class="hero-spec"><span class="dot"></span> Spine &amp; neck rehab</div>
          <div class="hero-spec"><span class="dot warm"></span> Pediatric rehab</div>
          <div class="hero-spec"><span class="dot"></span> Stroke recovery</div>
          <div class="hero-spec"><span class="dot"></span> Post-surgery care</div>
          <div class="hero-spec"><span class="dot warm"></span> Home-care visits</div>
        </div>

      </div>
```

---

## 3. `js/ryie-fx.js` — Fix the splitwords GSAP animation bug

The current code calls `gsap.to()` but wipes the start transform in `onStart`, so GSAP animates from 0→0 (nothing moves). Fix: use `gsap.fromTo()` so start/end are both explicit.

**FIND exactly:**
```js
    if (reduced) { spans.forEach(function (s) { s.style.transform = "none"; s.style.opacity = 1; }); return; }
    spans.forEach(function (s) { s.style.transform = "translateY(110%)"; s.style.opacity = "0"; });
    if (hasGSAP()) {
      window.gsap.to(spans, {
        yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        stagger: 0.08, delay: 0.12,
        onStart: function () { spans.forEach(function (s) { s.style.transform = ""; }); }
      });
    } else {
      spans.forEach(function (s, i) {
        s.style.transition = "transform .85s cubic-bezier(.16,1,.3,1) " + (0.1 + i * 0.08) + "s, opacity .85s ease " + (0.1 + i * 0.08) + "s";
        requestAnimationFrame(function () { s.style.transform = "translateY(0)"; s.style.opacity = "1"; });
      });
    }
```

**REPLACE WITH:**
```js
    if (reduced) { spans.forEach(function (s) { s.style.transform = "none"; s.style.opacity = "1"; }); return; }
    /* hide via inline style (not CSS) so fallback is always visible */
    spans.forEach(function (s) { s.style.transform = "translateY(110%)"; s.style.opacity = "0"; });
    if (hasGSAP()) {
      /* fromTo so GSAP owns both start and end — no onStart wipe needed */
      window.gsap.fromTo(spans,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.1,
          clearProps: "transform,opacity" }
      );
    } else {
      requestAnimationFrame(function () {
        spans.forEach(function (s, i) {
          s.style.transition = "transform .85s cubic-bezier(.16,1,.3,1) " + (0.1 + i * 0.09) + "s, opacity .7s ease " + (0.1 + i * 0.09) + "s";
          s.style.transform = "translateY(0)";
          s.style.opacity = "1";
        });
      });
    }
```

---

## Summary of what these changes do

| # | What | Why |
|---|------|-----|
| 1a | Move word-hiding from CSS to JS inline style | Words visible without JS, animation still works |
| 1b | Hero padding tweak + `opacity:1 !important` on h1 | Prevents any flash of invisible headline |
| 1c | `.hero-meta`, `.avail-pill` (pulsing dot), `.hero-specs` grid | Fills the blank left-column gap with real visual density |
| 1d | `min-height: 520px` on hero-grid desktop | Stops grid collapsing when words are mid-animation |
| 2 | New hero-copy HTML with avail pill + meta + specs grid | Visible content top-to-bottom, no empty space |
| 3 | `gsap.fromTo()` instead of `gsap.to()` + remove `onStart` wipe | Fixes the headline actually animating in correctly |

No dependencies added. No new images needed. All changes are pure HTML/CSS/JS.