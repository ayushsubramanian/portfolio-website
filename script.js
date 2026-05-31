const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const typingTarget = document.querySelector("[data-typewriter]");

const easeOutCubic = (time) => 1 - Math.pow(1 - time, 3);

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const runTypewriter = async () => {
  if (!typingTarget) return;

  const text = typingTarget.getAttribute("data-typewriter") || typingTarget.textContent || "";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typingTarget.textContent = text;
    return;
  }

  while (true) {
    for (let index = 0; index <= text.length; index += 1) {
      typingTarget.textContent = text.slice(0, index);
      await wait(index === 0 ? 300 : 85);
    }

    await wait(1200);

    for (let index = text.length; index >= 0; index -= 1) {
      typingTarget.textContent = text.slice(0, index);
      await wait(45);
    }

    await wait(650);
  }
};

runTypewriter();

const scrollToSection = (targetId) => {
  const target = document.querySelector(targetId);
  if (!target) return;

  const header = document.querySelector(".site-header");
  const targetHeading = target.querySelector(".section-heading") || target;
  const headerHeight = header?.getBoundingClientRect().height || 0;
  const topPadding = targetId === "#top" ? 0 : 14;
  const start = window.scrollY;
  let destination =
    targetId === "#top"
      ? 0
      : targetHeading.getBoundingClientRect().top + window.scrollY - headerHeight - topPadding;

  if (targetId === "#skills") {
    const skillsContent = target.querySelector(".section-shell") || target;
    const contentRect = skillsContent.getBoundingClientRect();
    destination =
      contentRect.top +
      window.scrollY -
      Math.max(0, (window.innerHeight - contentRect.height) / 2);
  }

  const distance = destination - start;
  const duration = Math.min(1300, Math.max(850, Math.abs(distance) * 0.55));
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, start + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href?.startsWith("#")) {
      event.preventDefault();
      scrollToSection(href);
      history.pushState(null, "", href);
    }

    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".brand")?.addEventListener("click", (event) => {
  event.preventDefault();
  scrollToSection("#top");
  history.pushState(null, "", "#top");
});

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      window.setTimeout(() => button.classList.remove("is-copied"), 900);
    } catch {
      button.classList.remove("is-copied");
    }
  });
});
