export interface ContentOptions {
  isApple: boolean;
  version?: string;
}

export interface LocaleModule {
  title: string;
  content: (options: ContentOptions) => string;
}

/**
 * Normalize locale code: "en-US" -> "en_us", "es_ES" -> "es_es"
 */
function normalizeLocale(locale: string): string {
  return locale.replace('-', '_').toLowerCase();
}

/**
 * Extract language code: "en_US" -> "en", "es" -> "es"
 */
function getLanguageCode(locale: string): string {
  return normalizeLocale(locale).split('_')[0];
}

/**
 * Resolve the best matching locale from available locales.
 *
 * Fallback chain:
 * 1. URL parameter (exact match, then language-only)
 * 2. Browser locale (exact match, then language-only)
 * 3. English
 */
export function resolveLocale(
  availableLocales: string[],
  paramLocale?: string | null,
): string {
  const tryMatch = (code: string): string | undefined => {
    const normalized = normalizeLocale(code);

    // Exact match
    if (availableLocales.includes(normalized)) return normalized;

    // Language code only
    const lang = getLanguageCode(code);
    if (availableLocales.includes(lang)) return lang;

    return undefined;
  };

  // 1. URL parameter
  if (paramLocale) {
    const match = tryMatch(paramLocale);
    if (match) return match;
  }

  // 2. Browser locale
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language;
    if (browserLang) {
      const match = tryMatch(browserLang);
      if (match) return match;
    }

    if (navigator.languages) {
      for (const lang of navigator.languages) {
        const match = tryMatch(lang);
        if (match) return match;
      }
    }
  }

  // 3. Fallback to English
  return 'en';
}

/**
 * Dynamically load a locale module by code.
 * Falls back to English if the requested locale is not found.
 */
export async function loadLocale(
  modules: Record<string, () => Promise<unknown>>,
  locale: string,
): Promise<LocaleModule> {
  const key = Object.keys(modules).find((k) => k.includes(`/${locale}.ts`));

  if (key) {
    const mod = (await modules[key]()) as { default: LocaleModule };
    return mod.default;
  }

  // Fallback to English
  const enKey = Object.keys(modules).find((k) => k.includes('/en.ts'));
  if (enKey) {
    const mod = (await modules[enKey]()) as { default: LocaleModule };
    return mod.default;
  }

  throw new Error(`No locale module found for "${locale}"`);
}
