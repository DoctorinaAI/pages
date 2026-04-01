const TYPE_SPEED = 85;
const DELETE_SPEED = 45;
const HOLD_MS = 3000;
const BETWEEN_MS = 800;
const IDLE_CHECK_MS = 200;

export function startPlaceholderAnimation(
  textarea: HTMLTextAreaElement,
  phrases: string[],
): () => void {
  if (phrases.length === 0) return () => {};

  // Respect user motion preferences — show first phrase as static placeholder
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    textarea.placeholder = phrases[0];
    return () => {};
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  function isUserActive(): boolean {
    return textarea.value.trim().length > 0 || document.activeElement === textarea;
  }

  function tick(): void {
    if (destroyed) return;

    if (isUserActive()) {
      textarea.placeholder = '';
      timer = setTimeout(tick, IDLE_CHECK_MS);
      return;
    }

    const phrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      textarea.placeholder = phrase.slice(0, charIndex);

      if (charIndex >= phrase.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_MS);
      } else {
        timer = setTimeout(tick, TYPE_SPEED);
      }
    } else {
      charIndex--;
      textarea.placeholder = phrase.slice(0, Math.max(0, charIndex));

      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timer = setTimeout(tick, BETWEEN_MS);
      } else {
        timer = setTimeout(tick, DELETE_SPEED);
      }
    }
  }

  function cancelTimer(): void {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function onFocus(): void {
    cancelTimer();
    textarea.placeholder = '';
  }

  function onBlur(): void {
    if (!destroyed && textarea.value.trim() === '') {
      cancelTimer();
      tick();
    }
  }

  textarea.addEventListener('focus', onFocus);
  textarea.addEventListener('blur', onBlur);
  tick();

  return () => {
    destroyed = true;
    cancelTimer();
    textarea.removeEventListener('focus', onFocus);
    textarea.removeEventListener('blur', onBlur);
  };
}
