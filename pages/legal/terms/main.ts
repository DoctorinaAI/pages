import { initLegalPage } from '~/shared/legal/legal-page';

initLegalPage({
  localeModules: import.meta.glob('./locales/*.ts'),
  localeNames: { en: 'English', es: 'Español' },
});
