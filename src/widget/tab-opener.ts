import type { WidgetConfig } from './config';

function normalizeMessage(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

function buildTargetUrl(config: WidgetConfig, message?: string): string {
  const url = new URL(config.targetUrl);
  url.searchParams.set('auto_accept_policies', '1');
  url.searchParams.set('referrer', window.location.href);

  if (config.params) {
    for (const [key, value] of Object.entries(config.params)) {
      url.searchParams.set(key, value);
    }
  }

  if (message) {
    url.hash = encodeURIComponent(message);
  }

  return url.toString();
}

/**
 * Opens the target app with the user's message.
 *
 * Primary: window.open() + window.name (no size limit, cross-origin safe).
 * Fallback (popup blocked): redirect via window.location with message in URL hash.
 */
export function openTarget(config: WidgetConfig, message: string): void {
  const text = normalizeMessage(message);

  // Try opening a new tab (must be synchronous in click handler for Safari)
  const newTab = window.open('about:blank', '_blank');
  const popupBlocked = !newTab || newTab.closed;

  if (!popupBlocked) {
    // Pass data via window.name — survives cross-origin navigation
    const payload: Record<string, unknown> = {
      referrer: window.location.href,
    };
    if (text) {
      payload.message = text;
    }
    if (config.params) {
      payload.params = config.params;
    }
    newTab.name = JSON.stringify(payload);
    newTab.location.href = buildTargetUrl(config);
  } else {
    // Fallback: redirect in current tab, message in URL hash
    window.location.href = buildTargetUrl(config, text || undefined);
  }
}
