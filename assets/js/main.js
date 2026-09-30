/* ==========================================================================
   PUENTES & SÁNCHEZ ABOGADAS — Comportamiento 2026
   JavaScript mínimo y diferido (< 6 KB). Cero dependencias.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------- Cabecera: estado de scroll ------- */
  var header = doc.querySelector(".site-header");
  var toTop = doc.querySelector(".to-top");

  function onScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 640);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------- Navegación móvil ------- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("menu-principal");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    doc.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
  }

  /* ------- Animaciones de entrada ------- */
  var revealables = doc.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------- FAQ: una respuesta abierta a la vez ------- */
  var faqs = doc.querySelectorAll(".faq details");
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqs.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ------- Resaltar sección activa en el menú ------- */
  var navLinks = doc.querySelectorAll('.nav a[href*="#"]');
  var sections = [];
  navLinks.forEach(function (link) {
    var hashIndex = link.href.indexOf("#");
    if (hashIndex === -1) return;
    var id = link.href.slice(hashIndex + 1);
    if (!id || id === "page-top") return;
    var target = doc.getElementById(id);
    if (target) sections.push({ link: link, target: target });
  });

  if (sections.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (item) {
          item.link.classList.toggle("is-active", item.target === entry.target);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (item) { sectionObserver.observe(item.target); });
  }

  /* ------- Formulario → WhatsApp (sin backend) ------- */
  var form = doc.querySelector("[data-wa-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var nombre = (data.get("nombre") || "").toString().trim();
      var area = (data.get("area") || "").toString().trim();
      var mensaje = (data.get("mensaje") || "").toString().trim();
      var numero = form.getAttribute("data-wa-numero") || "56993170166";

      var texto = "Hola Puentes & Sánchez Abogadas. Mi nombre es " + (nombre || "[nombre]") + ".";
      if (area) texto += " Necesito asesoría en " + area + ".";
      if (mensaje) texto += " " + mensaje;

      var url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
    });
  }

  /* ------- Año dinámico en el pie ------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
