(() => {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (!links.length) return;

  const sections = links
    .map((link) => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter((pair) => pair.target);

  const setActive = (active) => {
    for (const { link } of sections) {
      const isActive = link === active;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const OFFSET = 110;

  // Highlight whichever section the reader has scrolled to.
  const update = () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      // The last section can be too short to ever reach the top of the viewport.
      setActive(sections[sections.length - 1].link);
      return;
    }
    const line = window.scrollY + OFFSET + 4;
    let current = sections[0];
    for (const pair of sections) {
      if (pair.target.getBoundingClientRect().top + window.scrollY <= line) current = pair;
    }
    setActive(current.link);
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Keep the hash out of the URL so the buttons read as scrolling, not navigation.
  for (const { link, target } of sections) {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      const top = target === document.getElementById('top')
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - OFFSET;
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
      setActive(link);
    });
  }

  const brand = document.querySelector('.topbar-brand[href="#top"]');
  if (brand) {
    brand.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    });
  }
})();
