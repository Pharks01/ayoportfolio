document.addEventListener("DOMContentLoaded", () => {
  /* ---- Nav scroll shadow ---- */
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  });

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("mobile-open");
    });
  }

  /* ---- Scroll-triggered fade-up with stagger ---- */
  const groupOf = (el) => el.closest("section, header, footer") || document.body;
  const groups = new Map();
  document.querySelectorAll(".fade-up").forEach((el) => {
    const g = groupOf(el);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(el);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = groups.get(groupOf(el)) || [el];
          const idx = siblings.indexOf(el);
          setTimeout(() => el.classList.add("in-view"), Math.max(idx, 0) * 90);
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));

  /* ---- Category filter ---- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workItems = document.querySelectorAll(".work-item");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      workItems.forEach((item) => {
        const cats = item.dataset.categories || "";
        const show = cat === "all" || cats.includes(cat);
        item.style.display = show ? "grid" : "none";
      });
    });
  });

  /* ---- Modal open/close ---- */
  const overlays = document.querySelectorAll(".modal-overlay");
  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const id = trigger.dataset.openModal;
      const overlay = document.getElementById(id);
      if (overlay) {
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });
  overlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
    overlay.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(overlay));
    });
  });
  function closeModal(overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(closeModal);
    }
  });

  /* ---- Artifact tabs (inside modals with multiple artifacts) ---- */
  document.querySelectorAll(".artifact-nav-tabs").forEach((tabRow) => {
    const tabs = tabRow.querySelectorAll(".artifact-tab");
    const container = tabRow.closest(".modal-block-artifacts") || tabRow.parentElement;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const targetId = tab.dataset.target;
        container.querySelectorAll(".artifact-panel").forEach((p) => {
          p.classList.toggle("active", p.id === targetId);
        });
      });
    });
  });
});
