import './legal.css';
import { loadLocale, resolveLocale, type LocaleModule } from './locale-resolver';

interface LegalPageConfig {
    localeModules: Record<string, () => Promise<unknown>>;
    localeNames: Record<string, string>;
}

function isApplePlatform(): boolean {
    const ua = navigator.userAgent;
    return /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(ua);
}

function getParams(): { locale: string | null; isApple: boolean } {
    const params = new URLSearchParams(window.location.search);
    const locale =
        params.get('locale') || params.get('lang') || params.get('l') || null;

    const variant = params.get('variant');
    const appleParam = params.get('apple') || params.get('isApple') || params.get('is_apple');
    const hasExplicitVariant = variant !== null || appleParam !== null;

    const isApple = hasExplicitVariant
        ? variant === 'apple' || appleParam === 'true'
        : isApplePlatform();

    return { locale, isApple };
}

function extractAvailableLocales(
    modules: Record<string, () => Promise<unknown>>,
): string[] {
    return Object.keys(modules)
        .map((k) => k.match(/\/(\w+)\.ts$/)?.[1])
        .filter(Boolean) as string[];
}

function renderDropdown(
    currentLocale: string,
    locales: string[],
    names: Record<string, string>,
    onLocaleChange: (locale: string) => void,
): void {
    const container = document.getElementById('locale-selector');
    if (!container) return;

    container.innerHTML = '';

    const select = document.createElement('select');
    select.className = 'locale-select';
    select.setAttribute('aria-label', 'Select language');

    for (const code of locales) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = names[code] || code;
        if (code === currentLocale) option.selected = true;
        select.appendChild(option);
    }

    select.addEventListener('change', () => {
        const url = new URL(window.location.href);
        url.searchParams.set('locale', select.value);
        window.history.replaceState(null, '', url.toString());
        onLocaleChange(select.value);
    });

    container.appendChild(select);
}

async function renderContent(
    mod: LocaleModule,
    isApple: boolean,
): Promise<void> {
    const content = document.getElementById('content');
    if (!content) return;

    document.title = mod.title;
    content.innerHTML = mod.content({ isApple });
}

/**
 * Initialize a legal page with locale support.
 *
 * Usage in each page's main.ts:
 * ```ts
 * import { initLegalPage } from '~/shared/legal/legal-page';
 *
 * initLegalPage({
 *   localeModules: import.meta.glob('./locales/*.ts'),
 *   localeNames: { en: 'English', es: 'Español' },
 * });
 * ```
 */
export function initLegalPage(config: LegalPageConfig): void {
    const { localeModules, localeNames } = config;
    const availableLocales = extractAvailableLocales(localeModules);
    const { locale: paramLocale, isApple } = getParams();

    const currentLocale = resolveLocale(availableLocales, paramLocale);

    async function loadAndRender(locale: string): Promise<void> {
        const mod = await loadLocale(localeModules, locale);
        document.documentElement.lang = locale;
        await renderContent(mod, isApple);
        renderDropdown(locale, availableLocales, localeNames, loadAndRender);
    }

    loadAndRender(currentLocale);
}
