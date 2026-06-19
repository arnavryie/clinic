/*
  Sanchi Physiotherapy Clinic — site wiring
  Smooth scroll, scroll progress, FX dispatch, nav, reveal-on-scroll,
  and a no-backend appointment form that opens WhatsApp.
  Motion engine adapted from github.com/arnavryie/ryie-fx (MIT).
*/
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Lenis smooth scroll (synced to GSAP if present) ----
  if (window.Lenis && !reduced) {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    }
    // keep anchor links working through Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1) {
          var target = document.querySelector(id);
          if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); closeNav(); }
        }
      });
    });
  } else {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1) {
          var t = document.querySelector(id);
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); closeNav(); }
        }
      });
    });
  }

  if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  // ---- scroll progress bar ----
  var bar = document.getElementById("progress");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    var nav = document.querySelector(".nav");
    if (nav) nav.classList.toggle("scrolled", h.scrollTop > 24);
    if (toTop) toTop.classList.toggle("show", h.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- mobile nav ----
  var burger = document.getElementById("burger");
  var links = document.getElementById("navlinks");
  function closeNav() { if (links) links.classList.remove("open"); if (burger) burger.setAttribute("aria-expanded", "false"); }
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---- reveal on scroll (works without GSAP) ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (reduced) { el.classList.add("in"); } else { io.observe(el); }
  });

  // ---- dispatch ryie-fx effects ----
  function boot() {
    var FX = window.RYIEFX || {};
    document.querySelectorAll("[data-fx]").forEach(function (el) {
      var name = el.getAttribute("data-fx");
      if (typeof FX[name] === "function") {
        try { FX[name](el); } catch (e) { console.warn("FX " + name + " failed:", e); }
      }
    });
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // ---- appointment form -> WhatsApp (no backend needed) ----
  var CLINIC_WA = "919325926576"; // +91 93259 26576
  var form = document.getElementById("apptForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("f-name").value || "").trim();
      var phone = (document.getElementById("f-phone").value || "").trim();
      var service = document.getElementById("f-service").value || "";
      var note = (document.getElementById("f-note").value || "").trim();
      var msg = "Hello Dr. Tagade, I'd like to book an appointment.%0A%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Phone: " + encodeURIComponent(phone) + "%0A" +
        "For: " + encodeURIComponent(service);
      if (note) msg += "%0ANote: " + encodeURIComponent(note);
      window.open("https://wa.me/" + CLINIC_WA + "?text=" + msg, "_blank", "noopener");
    });
  }

  // ---- year ----
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
