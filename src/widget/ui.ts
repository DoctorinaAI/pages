import type { WidgetConfig } from './config';
import { openTarget } from './tab-opener';
import { startPlaceholderAnimation } from './placeholder-animation';

const SEND_ICON_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;

export function createWidget(container: HTMLElement, config: WidgetConfig): void {
  // Build DOM
  const box = document.createElement('div');
  box.className = 'dchat-box';
  box.setAttribute('role', 'form');
  box.setAttribute('aria-label', 'Chat message');

  const textarea = document.createElement('textarea');
  textarea.className = 'dchat-textarea';
  textarea.rows = 1;
  textarea.setAttribute('autocomplete', 'off');
  textarea.setAttribute('aria-label', 'Chat message');
  textarea.maxLength = 4096;

  if (config.placeholder) {
    textarea.placeholder = config.placeholder;
  }

  const btn = document.createElement('button');
  btn.className = 'dchat-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Send message');
  btn.title = 'Send message';
  btn.disabled = true;
  btn.setAttribute('aria-disabled', 'true');
  btn.innerHTML = SEND_ICON_SVG;

  box.appendChild(textarea);
  box.appendChild(btn);
  container.appendChild(box);

  // Auto-resize textarea
  function autoResize(): void {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
  }
  textarea.addEventListener('input', autoResize);
  autoResize();

  // Toggle button state
  function updateButton(): void {
    const empty = textarea.value.trim() === '';
    btn.disabled = empty;
    btn.setAttribute('aria-disabled', String(empty));
  }
  textarea.addEventListener('input', updateButton);
  updateButton();

  // Submit handler
  function submit(): void {
    if (textarea.value.trim() === '') return;
    openTarget(config, textarea.value);
    textarea.value = '';
    autoResize();
    updateButton();
  }

  btn.addEventListener('click', submit);

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  // Placeholder animation
  let destroyAnimation: (() => void) | undefined;
  if (config.phrases && config.phrases.length > 0) {
    destroyAnimation = startPlaceholderAnimation(textarea, config.phrases);
  }

  // Expose cleanup for SPA / dynamic removal
  container.addEventListener(
    'dchat:destroy',
    () => {
      destroyAnimation?.();
      textarea.removeEventListener('input', autoResize);
      textarea.removeEventListener('input', updateButton);
    },
    { once: true },
  );
}
