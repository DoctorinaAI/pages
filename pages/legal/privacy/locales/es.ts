import type { LocaleModule } from '~/shared/legal/locale-resolver';
import { renderPrivacyPolicy, renderPrivacyPolicyV1 } from '~/shared/legal/renderers';
import data from '../data/latest/es.json';
import appleData from '../data/latest/es-apple.json';
import v1Data from '../data/v1/es.json';

const contentMap: Record<string, () => string> = {
    'v1:default':    () => renderPrivacyPolicyV1(v1Data),
    'latest:apple':  () => renderPrivacyPolicy(appleData),
    'latest:default': () => renderPrivacyPolicy(data),
};

const locale: LocaleModule = {
  title: 'Política de Privacidad - Doctorina',
  content: ({ isApple, version }) => {
      const key = `${version ?? 'latest'}:${isApple ? 'apple' : 'default'}`;
      return (contentMap[key] ?? contentMap['latest:default'])();
  },
};

export default locale;
