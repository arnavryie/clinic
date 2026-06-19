/*
  RYIE FX — effects engine (clinic edition)
  Adapted for Sanchi Physiotherapy Clinic from github.com/arnavryie/ryie-fx
  Copyright (c) 2026 Ryie (Arnav Tagade). MIT License.

  Effects used here: splitwords, maskwipe, counter, magnet, tilt, marquee.
  Recolored from the original neon palette to the clinic's clinical teal.
  Each effect is registered on window.RYIEFX[name] and wired by main.js.
*/
(function () {
  "use strict";

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var hasGSAP = function () { return window.gsap && window.ScrollTrigger; };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia && window.matchMedia("(hover: none)").matches;

  var FX = {};

  /* SPLIT WORDS — hero headline settles in word-by-word on load.
     Adapted from the original 02 "splitletters" (letter shatter was too
     aggressive for a clinic, so this is a calm per-word rise). */
  FX.splitwords = function (el) {
    // Prefer pre-split markup (.fx-word-in) so colored accents survive.
    var spans = Array.prototype.slice.call(el.querySelectorAll(".fx-word-in"));
    if (!spans.length) {
      // fall back to auto-splitting plain text
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = "";
      words.forEach(function (w, i) {
        var outer = document.createElement("span"); outer.className = "fx-word";
        var inner = document.createElement("span"); inner.className = "fx-word-in"; inner.textContent = w;
        outer.appendChild(inner); el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
        spans.push(inner);
      });
    }
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
  };

  /* MASK WIPE — a teal gradient sweeps across a heading as it scrolls in.
     Adapted from the original 01. Uses background-clip on a duplicated
     layer so the base text stays readable even if JS/GSAP never runs. */
  FX.maskwipe = function (el) {
    if (reduced) { el.classList.add("fx-wipe-done"); return; }
    var paint = function (p) {
      el.style.setProperty("--wipe", (p * 100).toFixed(1) + "%");
    };
    paint(0);
    if (hasGSAP()) {
      window.ScrollTrigger.create({
        trigger: el, start: "top 88%", end: "top 52%", scrub: 0.5,
        onUpdate: function (s) { paint(s.progress); }
      });
    } else {
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) {
          el.style.transition = "none";
          var t0 = performance.now();
          (function step(now) {
            var p = clamp((now - t0) / 900, 0, 1);
            paint(ease(p));
            if (p < 1) requestAnimationFrame(step);
          })(t0);
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(el);
    }
  };

  /* COUNT UP — roll numbers from 0 to target once they scroll into view.
     Straight port of the original 07, supports decimals + suffixes. */
  FX.counter = function (wrap) {
    var els = wrap.querySelectorAll("[data-to]");
    var done = false;
    // start from zero now that JS will animate (avoids flash of final value)
    if (!reduced) els.forEach(function (b) { b.textContent = "0"; });
    function run() {
      if (done) return; done = true;
      els.forEach(function (b) {
        var to = parseFloat(b.getAttribute("data-to")) || 0;
        var dec = (to % 1 !== 0) ? 1 : 0;
        var suffix = b.getAttribute("data-suffix") || "";
        if (reduced) { b.textContent = to.toFixed(dec) + suffix; return; }
        var dur = 1400, start = performance.now();
        (function step(now) {
          var t = clamp((now - start) / dur, 0, 1);
          var v = (to * ease(t)).toFixed(dec);
          b.textContent = v + suffix;
          if (t < 1) requestAnimationFrame(step);
        })(start);
      });
    }
    if (hasGSAP()) {
      window.ScrollTrigger.create({ trigger: wrap, start: "top 85%", once: true, onEnter: run });
    } else {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
      io.observe(wrap);
    }
  };

  /* MAGNETIC PULL — button springs toward the cursor. Pointer-only, so it
     simply never engages on touch devices (mobile is unaffected).
     Port of the original 04. */
  FX.magnet = function (btn) {
    if (touch || reduced) return;
    var rect, tx = 0, ty = 0, cx = 0, cy = 0, raf = null, active = false;
    function measure() { rect = btn.getBoundingClientRect(); }
    function tick() {
      cx = lerp(cx, tx, 0.18); cy = lerp(cy, ty, 0.18);
      btn.style.transform = "translate(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px)";
      if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    btn.addEventListener("pointerenter", function () { active = true; measure(); });
    btn.addEventListener("pointermove", function (e) {
      if (!active) return;
      var mx = e.clientX - (rect.left + rect.width / 2);
      var my = e.clientY - (rect.top + rect.height / 2);
      tx = mx * 0.28; ty = my * 0.34; kick();
    });
    btn.addEventListener("pointerleave", function () { active = false; tx = 0; ty = 0; kick(); });
    window.addEventListener("resize", measure);
  };

  /* TILT CARD — card rotates toward the pointer with a soft teal glare.
     Pointer-only. Port of the original 06, glare recolored to teal. */
  FX.tilt = function (card) {
    if (touch || reduced) return;
    var rect, raf = null, rx = 0, ry = 0, trx = 0, try_ = 0;
    function measure() { rect = card.getBoundingClientRect(); }
    function tick() {
      rx = lerp(rx, trx, 0.12); ry = lerp(ry, try_, 0.12);
      card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      if (Math.abs(rx - trx) > 0.05 || Math.abs(ry - try_) > 0.05) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    card.addEventListener("pointerenter", function () { measure(); card.classList.add("lit"); });
    card.addEventListener("pointermove", function (e) {
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      trx = (0.5 - py) * 8; try_ = (px - 0.5) * 10;
      card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      kick();
    });
    card.addEventListener("pointerleave", function () { trx = 0; try_ = 0; card.classList.remove("lit"); kick(); });
    window.addEventListener("resize", measure);
  };

  /* VELOCITY MARQUEE — looping ticker whose speed reacts to scroll velocity.
     Port of the original 05. */
  FX.marquee = function (wrap) {
    var track = wrap.querySelector(".marquee-track");
    if (!track) return;
    // duplicate content once so the loop is seamless
    track.innerHTML += track.innerHTML;
    var x = 0, base = reduced ? 0 : 0.5, vel = 0, last = window.scrollY, width = 0;
    function measure() { width = track.scrollWidth / 2; }
    function tick() {
      var now = window.scrollY;
      var dv = now - last; last = now;
      vel = lerp(vel, dv, 0.1);
      var dir = vel >= 0 ? 1 : -1;
      x -= (base + Math.abs(vel) * 0.2) * dir;
      if (width) { if (x <= -width) x += width; else if (x > 0) x -= width; }
      track.style.transform = "translateX(" + x.toFixed(2) + "px)";
      requestAnimationFrame(tick);
    }
    measure(); requestAnimationFrame(tick);
    window.addEventListener("resize", measure);
  };

  window.RYIEFX = FX;
})();
