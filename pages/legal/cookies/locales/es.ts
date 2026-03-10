import type { LocaleModule } from '~/shared/legal/locale-resolver';
import { renderCookiesPolicy } from '~/shared/legal/renderers';
import data from '../data/latest/es.json';

const locale: LocaleModule = {
  title: 'Política de Cookies - Doctorina',
  content: () => renderCookiesPolicy(data),
};

export default locale;
