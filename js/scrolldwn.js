// js/scroll-next.js
(() => {
  const SELECTOR_HINT = ".scroll-hint";
  const SELECTOR_SECTION = ".panel"; // change if your sections use a different class

  function getScrollableRoot() {
    // Most browsers use documentElement; Safari can be body — we’ll pick the one that scrolls.
    const de = document.documentElement;
    const body = document.body;
    const deScrolls = de.scrollHeight > de.clientHeight + 1;
    const bodyScrolls = body && body.scrollHeight > body.clientHeight + 1;
    return (deScrolls && de) || (bodyScrolls && body) || de;
  }

  function getSections() {
    return Array.from(document.querySelectorAll(SELECTOR_SECTION));
  }

  function getNextSection(currentSection) {
    const sections = getSections();
    const idx = sections.indexOf(currentSection);
    if (idx === -1) return null;
    return sections[idx + 1] || null;
  }

  function scrollToSection(section) {
    if (!section) return;

    // Let scroll-snap do its thing; this just initiates a smooth scroll.
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function labelHint(btn) {
    const label = btn.getAttribute("data-label");
    if (!label) return;
    const el = btn.querySelector(".scroll-hint__label");
    if (el) el.textContent = label;
  }

  function markLastSection() {
    const sections = getSections();
    sections.forEach((s) => s.classList.remove("is-last"));
    const last = sections[sections.length - 1];
    if (last) last.classList.add("is-last");
  }

  function bind() {
    markLastSection();

    document.querySelectorAll(SELECTOR_HINT).forEach((btn) => {
      labelHint(btn);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const section = btn.closest(SELECTOR_SECTION);
        if (!section) return;

        const next = getNextSection(section);
        scrollToSection(next);
      });
    });

    // If sections are dynamically added later, markLastSection again:
    // (lightweight observer)
    const root = document.querySelector("main") || document.body;
    const mo = new MutationObserver(() => markLastSection());
    mo.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
