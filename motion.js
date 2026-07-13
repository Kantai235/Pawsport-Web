(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const homePage = document.querySelector(".home-page");

  if (!homePage) return;

  let animationFrame;
  const updateScrollProgress = () => {
    animationFrame = undefined;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    homePage.style.setProperty("--scroll-progress", Math.min(1, Math.max(0, progress)).toFixed(4));
  };
  const requestScrollProgress = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScrollProgress);
  };

  updateScrollProgress();
  window.addEventListener("scroll", requestScrollProgress, { passive: true });
  window.addEventListener("resize", requestScrollProgress, { passive: true });

  const navLinks = [...document.querySelectorAll(".home-header nav a[href^='#']")];
  const setCurrentNav = (id) => {
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6%" }
    );

    document.querySelectorAll("[data-motion]").forEach((element) => observer.observe(element));

    const navObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (visibleEntry) setCurrentNav(visibleEntry.target.id);
      },
      { threshold: [0.28, 0.54, 0.8], rootMargin: "-20% 0px -42%" }
    );

    document.querySelectorAll("#make-it, #show-it, #privacy").forEach((section) => navObserver.observe(section));
  }

  document.querySelectorAll(".button, .header-cta").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      button.classList.remove("has-spark");
      window.requestAnimationFrame(() => button.classList.add("has-spark"));
      window.setTimeout(() => button.classList.remove("has-spark"), 460);
    });
  });

  if (reducedMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll("[data-tilt]").forEach((element) => {
    const maxTilt = element.classList.contains("hero-art-parallax") ? 3 : 1.7;
    const resetTilt = () => {
      element.classList.remove("is-tilting");
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    };

    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      const vertical = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      element.classList.add("is-tilting");
      element.style.setProperty("--tilt-x", `${(-vertical * maxTilt).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(horizontal * maxTilt).toFixed(2)}deg`);
    });

    element.addEventListener("pointerleave", resetTilt);
    element.addEventListener("pointercancel", resetTilt);
  });

})();
