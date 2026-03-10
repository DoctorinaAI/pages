import type { LocaleModule } from '~/shared/legal/locale-resolver';
import { renderPrivacyPolicy, renderPrivacyPolicyV1 } from '~/shared/legal/renderers';
import appleData from '../data/latest/en-apple.json';
import data from '../data/latest/en.json';
import appleV1Data from '../data/v1/en-apple.json';
import v1Data from '../data/v1/en.json';

const contentMap: Record<string, () => string> = {
    'v1:apple':      () => renderPrivacyPolicy(appleV1Data),
    'v1:default':    () => renderPrivacyPolicyV1(v1Data),
    'latest:apple':  () => renderPrivacyPolicy(appleData),
    'latest:default': () => renderPrivacyPolicy(data),
};

const locale: LocaleModule = {
    title: 'Privacy Policy - Doctorina',
    content: ({ isApple, version }) => {
        const key = `${version ?? 'latest'}:${isApple ? 'apple' : 'default'}`;
        return (contentMap[key] ?? contentMap['latest:default'])();
    },
};

export default locale;
