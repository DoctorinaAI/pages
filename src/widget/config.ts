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

  const phrasesAttr = container.getAttribute('data-phrases');
  if (phrasesAttr) {
    try {
      const parsed = JSON.parse(phrasesAttr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        config.phrases = parsed.filter((p): p is string => typeof p === 'string' && p.trim() !== '');
      }
    } catch {
      console.warn('[DoctorinaChat] Invalid data-phrases JSON:', phrasesAttr);
    }
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
