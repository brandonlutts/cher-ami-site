(() => {
  const scroller = document.getElementById("snap");
  const dots = Array.from(document.querySelectorAll("[data-dot]"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = Array.from(document.querySelectorAll(".section"));
  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("menuPanel");
  const menuClose = document.getElementById("menuClose");
  const yearNow = document.getElementById("yearNow");

  if (yearNow) yearNow.textContent = String(new Date().getFullYear());

  // ---- Menu open/close
  const openMenu = () => {
    if (!menuPanel) return;
    menuPanel.classList.add("isOpen");
    menuToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    if (!menuPanel) return;
    menuPanel.classList.remove("isOpen");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuPanel?.classList.contains("isOpen");
    isOpen ? closeMenu() : openMenu();
  });
  menuClose?.addEventListener("click", closeMenu);
  menuPanel?.addEventListener("click", (e) => {
    if (e.target === menuPanel) closeMenu();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // ---- Smooth scroll for nav links (works in the snap container)
  const scrollToHash = (hash) => {
    const id = (hash || "").replace("#", "");
    const el = document.getElementById(id);
    if (!el || !scroller) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      closeMenu();
      scrollToHash(href);
      history.replaceState(null, "", href);
    });
  });

  dots.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      scrollToHash(href);
      history.replaceState(null, "", href);
    });
  });

  // ---- Active section detection
  const setActive = (id) => {
    dots.forEach((d) => {
      const href = d.getAttribute("href");
      d.classList.toggle("isActive", href === `#${id}`);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!visible) return;
      setActive(visible.target.id);
    },
    { root: scroller, threshold: [0.35, 0.55, 0.75] }
  );
  sections.forEach((s) => io.observe(s));

  // ---- Parallax (simple, editorial)
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  const onScroll = () => {
    const y = scroller?.scrollTop || 0;
    const vh = scroller?.clientHeight || window.innerHeight;

    for (const el of parallaxEls) {
      const strength = Number(el.getAttribute("data-parallax") || 0);
      if (!strength) continue;

      const rect = el.getBoundingClientRect();
      // rect relative to viewport, but we want relative to container top
      const center = rect.top + rect.height / 2;
      const delta = (center - vh / 2) / vh; // -1..1-ish
      const translate = clamp(delta * strength * -180, -32, 32);
      el.style.transform = `translate3d(0, ${translate}px, 0)`;
    }
  };

  let raf = null;
  scroller?.addEventListener("scroll", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(onScroll);
  });
  onScroll();

  // ---- Countdown (editable)
  const cd = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    mins: document.getElementById("cdMins"),
    secs: document.getElementById("cdSecs"),
  };

  // Change this date if you'd like:
  // NOTE: Month is 0-indexed in JS Date(year, monthIndex, day)
  const target = new Date(2026, 5, 1, 9, 0, 0); // June 1, 2026 @ 9:00 AM (local)

  const pad2 = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const now = new Date();
    const ms = target.getTime() - now.getTime();
    const total = Math.max(0, ms);

    const sec = Math.floor(total / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    if (cd.days) cd.days.textContent = String(days);
    if (cd.hours) cd.hours.textContent = pad2(hours);
    if (cd.mins) cd.mins.textContent = pad2(mins);
    if (cd.secs) cd.secs.textContent = pad2(secs);
  };

  tick();
  setInterval(tick, 1000);

  // ---- Newsletter form: create mailto draft
  const form = document.getElementById("newsletterForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const name = String(fd.get("name") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const subject = encodeURIComponent("Cher Ami — newsletter / question");
    const body = encodeURIComponent(
      `From: ${name || "—"}\nEmail: ${email}\n\n${message || ""}`.trim()
    );

    // Put YOUR email here:
    const to = "luttsbn@gmail.com";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });

  // ---- Deep link on load
  if (location.hash) {
    // allow layout to settle
    setTimeout(() => scrollToHash(location.hash), 60);
  }
})();
