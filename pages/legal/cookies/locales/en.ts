import type { LocaleModule } from '~/shared/legal/locale-resolver';
import { renderCookiesPolicy } from '~/shared/legal/renderers';
import data from '../data/latest/en.json';

const locale: LocaleModule = {
  title: 'Cookies Policy - Doctorina',
  content: () => renderCookiesPolicy(data),
};

export default locale;
