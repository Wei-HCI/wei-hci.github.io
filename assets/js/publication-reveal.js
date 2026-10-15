(() => {
  const entries = document.querySelectorAll('.publication-entry');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!entries.length || reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  // Content stays visible if scripting or animation support is unavailable.
  const observer = new IntersectionObserver((changes) => {
    for (const change of changes) {
      if (!change.isIntersecting) continue;
      observer.unobserve(change.target);
      if (reducedMotion.matches || change.target.contains(document.activeElement)) continue;
      change.target.animate([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }
  }, { threshold: 0.08 });

  entries.forEach((entry) => observer.observe(entry));
  document.addEventListener('focusin', (event) => {
    const entry = event.target.closest('.publication-entry');
    if (entry) entry.getAnimations().forEach((animation) => animation.cancel());
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    observer.disconnect();
    entries.forEach((entry) => entry.getAnimations().forEach((animation) => animation.cancel()));
  });
})();
