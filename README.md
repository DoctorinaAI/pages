# [Doctorina Pages](https://pages.doctorina.com)

Множество независимых легковесных HTML страниц для организации Doctorina, размещаемых на одном домене.

## 📁 Структура проекта

```
pages/
├── pages/                  # Директория со всеми страницами
│   ├── index/             # Главная страница (домашняя)
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   ├── links/             # Страница сокращения URL
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   ├── tools/             # Страница с утилитами
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   └── ...                # Другие страницы
├── src/
│   └── shared/            # Общий код для всех страниц
│       ├── utils/         # Утилиты (clipboard, validation и т.д.)
│       └── styles/        # Общие стили
├── public/                # Статические файлы
├── vite.config.ts         # Конфигурация Vite (автосканирование страниц)
└── package.json
```

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Разработка

Запустить dev сервер (откроется главная страница):

```bash
npm run dev
```

Открыть конкретную страницу:

```bash
npm run dev:index     # Главная страница
npm run dev:links     # Страница Links
npm run dev:tools     # Страница Tools
```

Или откройте в браузере:
- `http://localhost:3000/pages/index/index.html`
- `http://localhost:3000/pages/links/index.html`
- `http://localhost:3000/pages/tools/index.html`

### Сборка

```bash
npm run build              # Собрать все страницы
npm run build:analyze      # Собрать с анализом размера бандла
npm run preview            # Предпросмотр собранного проекта
```

### Проверка кода

```bash
npm run type-check         # Проверка типов TypeScript
npm run lint               # Проверка линтером
npm run lint:fix           # Автоисправление линтером
```

### Деплой

```bash
npm run deploy             # Собрать и задеплоить на Firebase
npm run deploy:preview     # Деплой на preview канал
npm run firebase:serve     # Локальный тест Firebase hosting
```

## ➕ Добавление новой страницы

1. **Создайте новую директорию** в папке `pages/`:

```bash
mkdir pages/my-new-page
```

2. **Создайте файлы страницы**:

```
pages/my-new-page/
├── index.html      # HTML шаблон
├── main.ts         # TypeScript код
└── style.css       # Стили (опционально)
```

3. **index.html** - минимальный шаблон:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My New Page - Doctorina">
    <meta name="theme-color" content="#667eea">
    <title>My New Page - Doctorina</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/pages/my-new-page/main.ts"></script>
</body>
</html>
```

4. **main.ts** - код страницы:

```typescript
import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('My New Page - Doctorina');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <h1>My New Page</h1>
      <p>Welcome to my new page!</p>
    </div>
  `;
}
```

5. **Добавьте npm скрипт** (опционально) в `package.json`:

```json
"dev:my-new-page": "vite --open /pages/my-new-page/index.html"
```

6. **Готово!** Vite автоматически найдет вашу страницу при сборке.

## 🔧 Использование общих утилит

В `src/shared/utils/` доступны готовые утилиты:

```typescript
import { initPage } from '~/shared/utils/page-init';
import { copyToClipboard } from '~/shared/utils/clipboard';
import { formatDate, getRelativeTime } from '~/shared/utils/date';
import { isValidEmail, isValidUrl } from '~/shared/utils/validation';

// Инициализация страницы
initPage('Page Title');

// Работа с буфером обмена
await copyToClipboard('Text to copy');

// Форматирование дат
const formatted = formatDate(new Date());
const relative = getRelativeTime(new Date());

// Валидация
if (isValidEmail(email)) { /* ... */ }
if (isValidUrl(url)) { /* ... */ }
```

## 🎨 Общие стили

Подключите общие CSS переменные и утилиты:

```typescript
import '~/shared/styles/common.css';
```

Доступные CSS переменные:

```css
var(--primary-color)      /* #667eea */
var(--success-color)      /* #28a745 */
var(--shadow-lg)          /* 0 10px 40px rgba(0,0,0,0.2) */
var(--radius-md)          /* 8px */
/* и другие... */
```

## 📦 Структура сборки

После `npm run build` в `dist/` будет создана структура:

```
dist/
├── index.html              # Главная страница
├── links.html              # Страница Links
├── tools.html              # Страница Tools
├── assets/                 # JS, CSS, и другие ассеты
└── ...
```

Каждая страница собирается независимо с минимальными зависимостями.

## 🔥 Firebase Hosting

Конфигурация для деплоя на `pages.doctorina.com`.

Первичная настройка:

```bash
npm run firebase:login
npm run firebase:init
```

Деплой:

```bash
npm run deploy
```
