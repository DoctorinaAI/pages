import type { WidgetConfig } from './config';

// The widget *is* the user-message medium — every redirect is the user pressing Send.
// Embedders override by passing utm_medium in data-params.
const DEFAULT_PARAMS: Readonly<Record<string, string>> = Object.freeze({
  utm_medium: 'user_message',
});

export function normalizeMessage(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

function effectiveParams(config: WidgetConfig): Record<string, string> {
  return { ...DEFAULT_PARAMS, ...(config.params ?? {}) };
}

export function buildTargetUrl(config: WidgetConfig, message?: string): string {
  const url = new URL(config.targetUrl);
  url.searchParams.set('auto_accept_policies', '1');
  url.searchParams.set('referrer', window.location.href);

  for (const [key, value] of Object.entries(effectiveParams(config))) {
    url.searchParams.set(key, value);
  }

  if (message) {
    url.hash = encodeURIComponent(message);
  }

  return url.toString();
}

/**
 * Opens the target app with the user's message.
 *
 * The message is sent over BOTH channels so losing one still delivers it:
 *  - window.name — survives cross-origin navigation, no size limit (primary);
 *  - URL hash — survives when window.name is gone (e.g. an iOS universal-link
 *    intercept tears down the originating tab) and is also the popup-blocked
 *    fallback path.
 * The web app reads window.name first and only falls back to the hash.
 */
export function openTarget(config: WidgetConfig, message: string): void {
  const text = normalizeMessage(message);

  // Try opening a new tab (must be synchronous in the click handler for Safari)
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
    payload.params = effectiveParams(config);
    newTab.name = JSON.stringify(payload);
    // Also carry the message in the URL so it survives a lost window.name.
    newTab.location.href = buildTargetUrl(config, text || undefined);
  } else {
    // Fallback: redirect in current tab, message in URL hash
    window.location.href = buildTargetUrl(config, text || undefined);
  }
}
