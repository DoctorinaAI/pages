import type { LocaleModule } from '~/shared/legal/locale-resolver';
import { renderTermsOfUse, renderTermsOfUseV1 } from '~/shared/legal/renderers';
import data from '../data/latest/en.json';
import appleData from '../data/latest/en-apple.json';
import v1Data from '../data/v1/en.json';
import appleV1Data from '../data/v1/en-apple.json';

const contentMap: Record<string, () => string> = {
    'v1:apple':      () => renderTermsOfUse(appleV1Data),
    'v1:default':    () => renderTermsOfUseV1(v1Data),
    'latest:apple':  () => renderTermsOfUse(appleData),
    'latest:default': () => renderTermsOfUse(data),
};

const locale: LocaleModule = {
  title: 'Terms of Use - Doctorina',
  content: ({ isApple, version }) => {
      const key = `${version ?? 'latest'}:${isApple ? 'apple' : 'default'}`;
      return (contentMap[key] ?? contentMap['latest:default'])();
  },
};

export default locale;
