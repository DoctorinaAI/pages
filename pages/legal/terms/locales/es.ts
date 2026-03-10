import type { LocaleModule } from '~/shared/legal/locale-resolver';
import { renderTermsOfUse } from '~/shared/legal/renderers';
import data from '../data/latest/es.json';
import appleData from '../data/latest/es-apple.json';

const contentMap: Record<string, () => string> = {
    'latest:apple':  () => renderTermsOfUse(appleData),
    'latest:default': () => renderTermsOfUse(data),
};

const locale: LocaleModule = {
  title: 'Términos de Uso - Doctorina',
  content: ({ isApple, version }) => {
      const key = `${version ?? 'latest'}:${isApple ? 'apple' : 'default'}`;
      return (contentMap[key] ?? contentMap['latest:default'])();
  },
};

export default locale;
