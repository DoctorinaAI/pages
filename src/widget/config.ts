const DEFAULT_TARGET_URL = 'https://app.doctorina.com';

export interface WidgetConfig {
  targetUrl: string;
  placeholder?: string;
  phrases?: string[];
  params?: Record<string, string>;
}

export function parseConfig(container: HTMLElement): WidgetConfig {
  const targetUrl = container.getAttribute('data-target-url') || DEFAULT_TARGET_URL;

  const config: WidgetConfig = {
    targetUrl: targetUrl.replace(/\/+$/, ''),
  };

  const placeholder = container.getAttribute('data-placeholder');
  if (placeholder) {
    config.placeholder = placeholder;
  }

  const childPhrases = Array.from(container.children)
    .map((el) => el.textContent?.trim() ?? '')
    .filter((text) => text.length > 0);

  if (childPhrases.length > 0) {
    config.phrases = childPhrases;
  }

  const paramsAttr = container.getAttribute('data-params');
  if (paramsAttr) {
    try {
      const parsed = JSON.parse(paramsAttr);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const filtered: Record<string, string> = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'string' && k.trim() !== '') {
            filtered[k] = v;
          }
        }
        if (Object.keys(filtered).length > 0) {
          config.params = filtered;
        }
      }
    } catch {
      console.warn('[DoctorinaChat] Invalid data-params JSON:', paramsAttr);
    }
  }

  return config;
}
