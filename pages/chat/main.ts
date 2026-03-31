import { copyToClipboard } from '~/shared/utils/clipboard';
import { initPage } from '~/shared/utils/page-init';
import { init as initWidget } from '~/widget/doctorina-chat';
import './style.css';

initPage('Doctorina Chat Widget');

const WIDGET_HOST = 'https://pages.doctorina.com';

const i18n = {
    en: {
        title: 'Doctorina Chat Widget',
        subtitle: 'Embeddable chat input for your website. Users type a question and get redirected to Doctorina with a pre-filled chat.',
        demo: 'Live Demo',
        demoDesc: 'Try typing a message and pressing Send:',
        integration: 'Integration',
        integrationDesc: 'Add this code to your website where you want the widget to appear:',
        copy: 'Copy',
        copied: 'Copied!',
        config: 'Configuration',
        configDesc: 'Customize the widget using data attributes. <code>data-target-url</code> is optional and uses the Doctorina default if omitted.',
        attrName: 'Attribute',
        attrDesc: 'Description',
        attrDefault: 'Default',
        attrTargetUrl: 'App URL to redirect to',
        attrTargetUrlDefault: 'app.doctorina.com',
        attrPlaceholder: 'Static placeholder text',
        attrPlaceholderDefault: 'None',
        attrPhrases: 'JSON array of phrases for typing animation',
        attrPhrasesDefault: 'None',
        attrParams: 'JSON object of extra query parameters (e.g. UTM tags)',
        attrParamsDefault: 'None',
        examples: 'Examples',
        exBasicTitle: 'Basic Usage',
        exBasicDesc: 'Minimal setup — just add the container and the script:',
        exPhrasesTitle: 'With Typing Animation',
        exPhrasesDesc: 'Animated placeholder that cycles through phrases:',
        exPlaceholderTitle: 'With Static Placeholder',
        exPlaceholderDesc: 'Simple static placeholder text:',
        exParamsTitle: 'With UTM Parameters',
        exParamsDesc: 'Pass custom query parameters (e.g. UTM tags) to the target URL:',
        multiWidget: 'Multiple Widgets',
        multiWidgetDesc: 'Use the class <code>doctorina-chat</code> instead of id to place multiple widgets on the same page. Each can have its own configuration.',
        programmatic: 'Programmatic API',
        programmaticDesc: 'Call <code>DoctorinaChat.init()</code> to re-scan the page for new widget containers (useful for SPAs or dynamically added elements).',
    },
    es: {
        title: 'Doctorina Chat Widget',
        subtitle: 'Campo de chat integrable para tu sitio web. Los usuarios escriben una pregunta y son redirigidos a Doctorina con un chat prellenado.',
        demo: 'Demostración',
        demoDesc: 'Prueba escribir un mensaje y presionar Enviar:',
        integration: 'Integración',
        integrationDesc: 'Agrega este código en tu sitio web donde quieras que aparezca el widget:',
        copy: 'Copiar',
        copied: '¡Copiado!',
        config: 'Configuración',
        configDesc: 'Personaliza el widget usando atributos data. <code>data-target-url</code> es opcional y usa el valor predeterminado de Doctorina si se omite.',
        attrName: 'Atributo',
        attrDesc: 'Descripción',
        attrDefault: 'Predeterminado',
        attrTargetUrl: 'URL de la app para redirigir',
        attrTargetUrlDefault: 'app.doctorina.com',
        attrPlaceholder: 'Texto estático del placeholder',
        attrPlaceholderDefault: 'Ninguno',
        attrPhrases: 'Array JSON de frases para la animación de escritura',
        attrPhrasesDefault: 'Ninguno',
        attrParams: 'Objeto JSON con parámetros extra (ej. etiquetas UTM)',
        attrParamsDefault: 'Ninguno',
        examples: 'Ejemplos',
        exBasicTitle: 'Uso básico',
        exBasicDesc: 'Configuración mínima — solo agrega el contenedor y el script:',
        exPhrasesTitle: 'Con animación de escritura',
        exPhrasesDesc: 'Placeholder animado que alterna entre frases:',
        exPlaceholderTitle: 'Con placeholder estático',
        exPlaceholderDesc: 'Texto estático simple en el campo de entrada:',
        exParamsTitle: 'Con parámetros UTM',
        exParamsDesc: 'Pasa parámetros personalizados (ej. etiquetas UTM) a la URL de destino:',
        multiWidget: 'Múltiples widgets',
        multiWidgetDesc: 'Usa la clase <code>doctorina-chat</code> en lugar de id para colocar múltiples widgets en la misma página. Cada uno puede tener su propia configuración.',
        programmatic: 'API programática',
        programmaticDesc: 'Llama a <code>DoctorinaChat.init()</code> para re-escanear la página en busca de nuevos contenedores (útil para SPAs o elementos agregados dinámicamente).',
    },
    ru: {
        title: 'Doctorina Chat Widget',
        subtitle: 'Встраиваемое поле ввода чата для вашего сайта. Пользователь вводит вопрос и перенаправляется в Doctorina с заполненным чатом.',
        demo: 'Демо',
        demoDesc: 'Попробуйте ввести сообщение и нажать Отправить:',
        integration: 'Подключение',
        integrationDesc: 'Добавьте этот код на ваш сайт в нужное место:',
        copy: 'Скопировать',
        copied: 'Скопировано!',
        config: 'Настройка',
        configDesc: 'Настраивайте виджет через data-атрибуты. Атрибут <code>data-target-url</code> необязателен — по умолчанию используется адрес Doctorina.',
        attrName: 'Атрибут',
        attrDesc: 'Описание',
        attrDefault: 'По умолчанию',
        attrTargetUrl: 'URL приложения для редиректа',
        attrTargetUrlDefault: 'app.doctorina.com',
        attrPlaceholder: 'Статический текст placeholder',
        attrPlaceholderDefault: 'Нет',
        attrPhrases: 'JSON-массив фраз для анимации печатания',
        attrPhrasesDefault: 'Нет',
        attrParams: 'JSON-объект с дополнительными query-параметрами (напр. UTM-метки)',
        attrParamsDefault: 'Нет',
        examples: 'Примеры',
        exBasicTitle: 'Базовое подключение',
        exBasicDesc: 'Минимальная настройка — только контейнер и скрипт:',
        exPhrasesTitle: 'С анимацией печатания',
        exPhrasesDesc: 'Анимированный placeholder с циклической сменой фраз:',
        exPlaceholderTitle: 'Со статическим placeholder',
        exPlaceholderDesc: 'Простой статический текст в поле ввода:',
        exParamsTitle: 'С UTM-параметрами',
        exParamsDesc: 'Передача произвольных query-параметров (напр. UTM-меток) в целевой URL:',
        multiWidget: 'Несколько виджетов',
        multiWidgetDesc: 'Используйте класс <code>doctorina-chat</code> вместо id, чтобы разместить несколько виджетов на одной странице. Каждый может иметь свою конфигурацию.',
        programmatic: 'Программный API',
        programmaticDesc: 'Вызовите <code>DoctorinaChat.init()</code> для повторного сканирования страницы на наличие новых контейнеров (полезно для SPA или динамически добавленных элементов).',
    },
} as const;

type Lang = keyof typeof i18n;

function detectLang(): Lang {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('ru')) return 'ru';
    if (nav.startsWith('es')) return 'es';
    return 'en';
}

const SNIPPET_BASIC = `<!-- Doctorina Chat Widget -->
<div id="doctorina-chat"></div>
<script defer src="${WIDGET_HOST}/widget/doctorina-chat.js"></script>`;

const SNIPPET_PHRASES = `<div id="doctorina-chat"
     data-phrases='["What symptoms do you have?", "Ask about medications", "Get a health consultation"]'>
</div>
<script defer src="${WIDGET_HOST}/widget/doctorina-chat.js"></script>`;

const SNIPPET_PLACEHOLDER = `<div id="doctorina-chat"
     data-placeholder="Type your health question...">
</div>
<script defer src="${WIDGET_HOST}/widget/doctorina-chat.js"></script>`;

const SNIPPET_PARAMS = `<div id="doctorina-chat"
     data-params='{"utm_source":"website","utm_campaign":"spring"}'>
</div>
<script defer src="${WIDGET_HOST}/widget/doctorina-chat.js"></script>`;

function escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function render(lang: Lang): void {
    const t = i18n[lang];
    const app = document.getElementById('app')!;

    app.innerHTML = `
    <div class="chat-page">
      <nav class="lang-switch" aria-label="Language">
        <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en" aria-pressed="${lang === 'en'}">English</button>
        <button class="lang-btn ${lang === 'es' ? 'active' : ''}" data-lang="es" aria-pressed="${lang === 'es'}">Español</button>
        <button class="lang-btn ${lang === 'ru' ? 'active' : ''}" data-lang="ru" aria-pressed="${lang === 'ru'}">Русский</button>
      </nav>

      <header class="chat-hero">
        <h1>${t.title}</h1>
        <p>${t.subtitle}</p>
      </header>

      <section class="chat-section" aria-labelledby="demo-heading">
        <h2 id="demo-heading">${t.demo}</h2>
        <p>${t.demoDesc}</p>
        <div class="demo-widget">
          <div class="doctorina-chat"
               data-target-url="https://doctorina-development.web.app"
               data-phrases='["What symptoms do you have?", "Ask about medications", "Describe how you feel"]'>
          </div>
        </div>
      </section>

      <section class="chat-section" aria-labelledby="integration-heading">
        <h2 id="integration-heading">${t.integration}</h2>
        <p>${t.integrationDesc}</p>
        <div class="code-block">
          <pre><code>${escapeHtml(SNIPPET_BASIC)}</code></pre>
          <button class="copy-btn" data-snippet="basic" aria-label="${t.copy}">${t.copy}</button>
        </div>
      </section>

      <section class="chat-section" aria-labelledby="config-heading">
        <h2 id="config-heading">${t.config}</h2>
        <p>${t.configDesc}</p>
        <table class="config-table" aria-label="${t.config}">
          <thead>
            <tr><th scope="col">${t.attrName}</th><th scope="col">${t.attrDesc}</th><th scope="col">${t.attrDefault}</th></tr>
          </thead>
          <tbody>
            <tr><td>data-target-url</td><td>${t.attrTargetUrl}</td><td>${t.attrTargetUrlDefault}</td></tr>
            <tr><td>data-placeholder</td><td>${t.attrPlaceholder}</td><td>${t.attrPlaceholderDefault}</td></tr>
            <tr><td>data-phrases</td><td>${t.attrPhrases}</td><td>${t.attrPhrasesDefault}</td></tr>
            <tr><td>data-params</td><td>${t.attrParams}</td><td>${t.attrParamsDefault}</td></tr>
          </tbody>
        </table>
      </section>

      <section class="chat-section" aria-labelledby="examples-heading">
        <h2 id="examples-heading">${t.examples}</h2>

        <div class="example-card">
          <h3>${t.exBasicTitle}</h3>
          <p>${t.exBasicDesc}</p>
          <div class="code-block">
            <pre><code>${escapeHtml(SNIPPET_BASIC)}</code></pre>
            <button class="copy-btn" data-snippet="basic" aria-label="${t.copy}">${t.copy}</button>
          </div>
        </div>

        <div class="example-card">
          <h3>${t.exPhrasesTitle}</h3>
          <p>${t.exPhrasesDesc}</p>
          <div class="code-block">
            <pre><code>${escapeHtml(SNIPPET_PHRASES)}</code></pre>
            <button class="copy-btn" data-snippet="phrases" aria-label="${t.copy}">${t.copy}</button>
          </div>
        </div>

        <div class="example-card">
          <h3>${t.exPlaceholderTitle}</h3>
          <p>${t.exPlaceholderDesc}</p>
          <div class="code-block">
            <pre><code>${escapeHtml(SNIPPET_PLACEHOLDER)}</code></pre>
            <button class="copy-btn" data-snippet="placeholder" aria-label="${t.copy}">${t.copy}</button>
          </div>
        </div>

        <div class="example-card">
          <h3>${t.exParamsTitle}</h3>
          <p>${t.exParamsDesc}</p>
          <div class="code-block">
            <pre><code>${escapeHtml(SNIPPET_PARAMS)}</code></pre>
            <button class="copy-btn" data-snippet="params" aria-label="${t.copy}">${t.copy}</button>
          </div>
        </div>
      </section>

      <section class="chat-section">
        <h3>${t.multiWidget}</h3>
        <p>${t.multiWidgetDesc}</p>
      </section>

      <section class="chat-section">
        <h3>${t.programmatic}</h3>
        <p>${t.programmaticDesc}</p>
      </section>
    </div>
  `;

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Language switch
    app.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            render(btn.dataset.lang as Lang);
        });
    });

    // Copy buttons
    const snippets: Record<string, string> = {
        basic: SNIPPET_BASIC,
        phrases: SNIPPET_PHRASES,
        placeholder: SNIPPET_PLACEHOLDER,
        params: SNIPPET_PARAMS,
    };

    app.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const key = btn.dataset.snippet || 'basic';
            const success = await copyToClipboard(snippets[key]);
            if (success) {
                const original = btn.textContent;
                btn.textContent = t.copied;
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = original;
                    btn.classList.remove('copied');
                }, 2000);
            }
        });
    });

    // Initialize widget in the demo section
    initWidget();
}

render(detectLang());
