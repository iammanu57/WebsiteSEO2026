/**
 * Manu Aryal – Academic Portfolio
 * Vanilla JS: mobile nav, smooth scroll, tabs, lightbox, form helper
 */

(function () {
  "use strict";

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Mobile Navigation Toggle ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when a nav link is clicked (mobile)
    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Smooth Scroll (enhancement + active state) ---------- */
  // Native CSS scroll-behavior handles most cases; this adds offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById("site-header")?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ---------- Active nav link on scroll (optional polish) ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- Creative Corner Tabs ---------- */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      // Update buttons
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Update panels
      tabPanels.forEach((panel) => {
        const isMatch = panel.id === `panel-${target}`;
        panel.classList.toggle("active", isMatch);
        panel.hidden = !isMatch;
      });
    });
  });

  /* ---------- Lightbox for Travel Gallery ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const galleryItems = document.querySelectorAll(".gallery-item");

  function openLightbox(src, caption, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const full = item.getAttribute("data-full") || item.querySelector("img")?.src;
      const caption = item.getAttribute("data-caption") || item.querySelector("figcaption")?.textContent || "";
      const alt = item.querySelector("img")?.alt || "";
      openLightbox(full, caption, alt);
    });

    // Keyboard support
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* ---------- Contact Form (front-end only demo) ---------- */
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // In production, send data to your backend or a service (Formspree, Netlify Forms, etc.)
      if (formNote) {
        formNote.textContent = "Thank you! Your message has been recorded (demo only – connect a backend to send).";
      }
      contactForm.reset();
    });
  }
})();
function initCarousel(carouselId) {
  const root = document.getElementById(carouselId);
  if (!root) return;

  const track = root.querySelector(".carousel-track");
  const slides = [...root.querySelectorAll(".carousel-slide")];
  const prevBtn = root.querySelector(".carousel-btn.prev");
  const nextBtn = root.querySelector(".carousel-btn.next");
  const dotsWrap = root.querySelector(".carousel-dots");

  if (!track || slides.length === 0) return;

  let index = 0;
  const total = slides.length;

  // build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? [...dotsWrap.querySelectorAll("button")] : [];

  function goTo(i) {
    index = (i + total) % total;

    // center the active slide
    // 70% width + 3% margins → each step is ~73% of container
    const slideWidthPercent = 73;   // 70 + 1.5 + 1.5
    const offset = 15;              // (100 - 70) / 2  → centers the active slide
    track.style.transform = `translateX(calc(${offset}% - ${index * slideWidthPercent}%))`;

    // active state for blur / scale
    slides.forEach((s, si) => s.classList.toggle("active", si === index));
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

  // start centered
  goTo(0);
}
initCarousel("poetry-carousel");
initCarousel("travel-carousel");
