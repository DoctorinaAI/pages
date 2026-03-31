import { parseConfig } from './config';
import { injectStyles } from './styles';
import { createWidget } from './ui';

const SELECTOR = '#doctorina-chat, .doctorina-chat, [data-doctorina-chat]';

export function init(): void {
  const containers = document.querySelectorAll<HTMLElement>(SELECTOR);

  containers.forEach((container) => {
    if (container.dataset.dchatInited === '1') return;
    container.dataset.dchatInited = '1';

    const config = parseConfig(container);

    injectStyles();
    createWidget(container, config);
  });
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Public API for programmatic use
(window as unknown as { DoctorinaChat: { init: typeof init } }).DoctorinaChat = { init };
