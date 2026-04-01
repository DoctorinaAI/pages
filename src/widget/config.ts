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

  // Child elements = phrases for placeholder animation (translation-plugin friendly)
  // 1 element → static placeholder, 2+ elements → animated cycling
  const childTexts = Array.from(container.children)
    .map((el) => el.textContent?.trim() ?? '')
    .filter((text) => text.length > 0);

  if (childTexts.length === 1) {
    config.placeholder = childTexts[0];
  } else if (childTexts.length > 1) {
    config.phrases = childTexts;
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
