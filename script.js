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

  // ---------- Dots ----------
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

  // ---------- Core navigation ----------
  function goTo(i) {
    index = (i + total) % total;

    const slideWidthPercent = 73;   // 70% + margins
    const offset = 15;              // centers the active slide
    track.style.transform = `translateX(calc(${offset}% - ${index * slideWidthPercent}%))`;

    slides.forEach((s, si) => s.classList.toggle("active", si === index));
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

  // ---------- Touch swipe + Mouse drag ----------
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTransform = 0;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onStart(e) {
    isDragging = true;
    startX = getClientX(e);
    track.style.transition = "none";          // disable animation while dragging
  }

  function onMove(e) {
    if (!isDragging) return;
    currentX = getClientX(e);
    const diff = currentX - startX;
    // optional live drag preview (comment out if you prefer snap-only)
    // track.style.transform = `translateX(calc(${15}% - ${index * 73}% + ${diff}px))`;
  }

  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "";              // restore animation

    const diff = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - startX;
    const threshold = 50;                     // px needed to trigger slide change

    if (diff > threshold) {
      goTo(index - 1);                        // swipe right → previous
    } else if (diff < -threshold) {
      goTo(index + 1);                        // swipe left → next
    } else {
      goTo(index);                            // snap back
    }
  }

  // Touch events
  track.addEventListener("touchstart", onStart, { passive: true });
  track.addEventListener("touchmove", onMove, { passive: true });
  track.addEventListener("touchend", onEnd);

  // Mouse events (desktop drag)
  track.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);

  // Prevent image drag ghost
  track.querySelectorAll("img").forEach(img => {
    img.addEventListener("dragstart", e => e.preventDefault());
  });

  // Start centered
  goTo(0);
}
initCarousel("poetry-carousel");
initCarousel("travel-carousel");
function goTo(i) {
  index = (i + total) % total;

  // Detect mobile vs desktop
  const isMobile = window.innerWidth <= 640;

  // Match the CSS values
  const slidePercent = isMobile ? 85 : 80;   // flex-basis
  const marginPercent = isMobile ? 2 : 1;  // left + right margin each side
  const step = slidePercent + marginPercent * 2;  // total width one slide occupies
  const offset = (100 - slidePercent) / 2;         // centers the active slide

  track.style.transform = `translateX(calc(${offset}% - ${index * step}%))`;

  slides.forEach((s, si) => s.classList.toggle("active", si === index));
  dots.forEach((d, di) => d.classList.toggle("active", di === index));
}
window.addEventListener("resize", () => goTo(index));
/* ---------- See more / See less for poems ---------- */
document.querySelectorAll(".poetry-block").forEach((block) => {
  const textWrap = block.querySelector(".poetry-text");
  const btn = block.querySelector(".see-more-btn");
  if (!textWrap || !btn) return;

  // hide button if the poem is already short
  if (textWrap.scrollHeight <= 220) {
    btn.style.display = "none";
    textWrap.classList.remove("collapsed");
    return;
  }

  btn.addEventListener("click", () => {
    const isCollapsed = textWrap.classList.toggle("collapsed");
    btn.textContent = isCollapsed ? "See more" : "See less";
  });
});
