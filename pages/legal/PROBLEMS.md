# Юридические документы — Проблемы и несоответствия

## КРИТИЧЕСКИЕ: Опечатки и ошибки в тексте

### 1. "ChatGBP" вместо "ChatGPT" (Privacy ES)
- **Файлы:** `privacy/data/latest/es.json:44`, `privacy/data/latest/es-apple.json:44`
- **Текст:** `"ChatGBP / OpenAI"` — должно быть `"ChatGPT / OpenAI"`
- В EN-версии правильно: "ChatGPT / Open AI"

### 2. "Google Cloud A" вместо "Google Cloud AI" (Privacy EN)
- **Файлы:** `privacy/data/latest/en.json:146`, `privacy/data/latest/en-apple.json:146`
- **Текст:** `"Amazon Web Services (AWS) AI, Anthropic, Google Cloud A, and OpenAI"`
- В ES-версии правильно: `"Google Cloud AI"`

### 3. "Open AI" вместо "OpenAI" (Privacy EN)
- **Файл:** `privacy/data/latest/en.json:44`, `privacy/data/latest/en-apple.json:44`
- **Текст:** `"ChatGPT / Open AI"` — пробел в названии компании
- Во всех остальных местах (в том числе EN строка 13, строка 146) правильно: `"OpenAI"`
- В ES-версии тоже правильно: `"OpenAI"`

### 4. Грамматическая ошибка "You are have" (Terms EN-Apple)
- **Файл:** `terms/data/latest/en-apple.json:21`
- **Текст:** `"You are have the legal capability to contract the Services."`
- Должно быть: `"You have the legal capability to contract the Services."`
- В обычной EN-версии правильно: `"You are at least 18 years of age and have the legal capability..."`

### 5. Двойная запятая (Privacy EN)
- **Файлы:** `privacy/data/latest/en.json:164`, `privacy/data/latest/en-apple.json:164`
- **Текст:** `"including your personal data,, in connection with a business transaction"`
- Двойная запятая после "personal data"

### 6. Двойная точка после адреса (Terms, много файлов)
- **Файлы:** `terms/data/latest/en.json:24,159,162,163`, `terms/data/latest/en-apple.json:25`, `terms/data/latest/es.json:24,159`, `terms/data/latest/es-apple.json:24`
- **Текст:** `"...4041, Limassol, Cyprus.."`
- Встречается в `generalConditions.binding`, `noticeDispute`, `optOut`, `changes` и в нескольких местах в `disputeResolution`

### 7. Двойной пробел и сломанное предложение (Terms Apple)
- **Файл:** `terms/data/latest/en-apple.json:31`
- **Текст:** `"...a specific feature of the Services,  All outputs are..."` — двойной пробел + отсутствует точка перед "All"

### 8. Сломанное предложение в Terms Apple (3.3 aiContent)
- **Файл:** `terms/data/latest/en-apple.json`
- **Текст:** `"verified with and are provided"` — обрезанная фраза, отсутствует контекст
- В обычной EN-версии текст полный и связный

---

## КРИТИЧЕСКИЕ: Незаполненные плейсхолдеры

### 9. "[link]" плейсхолдер в Terms
- **Файлы:** `terms/data/latest/en.json:72`, `terms/data/latest/en-apple.json:73`, `terms/data/latest/es.json:72`, `terms/data/latest/es-apple.json:72`
- **Текст:** `"governed by our Privacy Policy [link]"` / `"Política de Privacidad [enlace]"`
- Должна быть настоящая `<a href>` ссылка, как в других местах документов

### 10. "[...]" плейсхолдер в Terms
- **Файлы:** `terms/data/latest/en.json:133`, `terms/data/latest/en-apple.json:134`, `terms/data/latest/es.json:133`, `terms/data/latest/es-apple.json:133`
- **Текст:** `"Permission requests may be sent to [...]"` / `"Las solicitudes de permiso pueden enviarse a [...]"`
- Не указана контактная информация

### 11. "[ENLACE]" плейсхолдер в Terms ES
- **Файлы:** `terms/data/latest/es.json:19`, `terms/data/latest/es-apple.json:19`
- **Текст:** `"incluida la Política de Privacidad disponible en [ENLACE]"`
- В EN-версии есть настоящая ссылка `<a href="/legal/privacy/">Privacy Policy</a>`; в ES — незаполненный плейсхолдер

---

## КРИТИЧЕСКИЕ: Массовое сокращение юридического текста в ES

### 12. Секция 13.7 (ограничение ответственности) — радикально сокращена в ES
- **EN** (`terms/data/latest/en.json:152`): Подробный текст с перечислением всех ответственных лиц (officers, directors, agents, affiliates, employees, representatives, suppliers, partners, advertisers, data providers), детальным списком типов ущерба, пунктами (A)-(E), указаниями о юрисдикциях, ответственности за personal injury/death
- **ES** (`terms/data/latest/es.json:152`): Сжат до ~40% от объёма EN. Отсутствуют:
  - Полный список ответственных лиц (только "representantes")
  - Развёрнутые ситуации (A)-(E)
  - Текст "SOME JURISDICTIONS DO NOT ALLOW"
  - Ссылки на personal injury и death liability
  - Детальное "WHERE ANY PROVISION IS EXPRESSED" положение

### 13. Секция 14.3.1 (уведомление о споре) — критически сокращена в ES
- **EN** (`terms/data/latest/en.json:159`): Полная процедура: 30 дней до инициации, что должно содержать уведомление (имя, контакт, описание, требуемая компенсация), процедура подачи в AAA через www.adr.org
- **ES** (`terms/data/latest/es.json:159`): Только 2 предложения. Отсутствуют:
  - Требование "At least 30 days prior"
  - Конкретные компоненты Notice of Dispute (4 пункта)
  - Ссылка на www.adr.org и инструкция по подаче в AAA

### 14. Секция 14.3.3 (арбитражное решение) — сокращена в ES
- **EN** (`terms/data/latest/en.json:161`): Подробный текст о юрисдикции, типах компенсации, ограничениях injunctive relief
- **ES** (`terms/data/latest/es.json:161`): Одно предложение: "El laudo arbitral será vinculante..."

### 15. Секция 14.3.4 (отказ от арбитража) — сокращена в ES
- **EN** (`terms/data/latest/en.json:162`): Полный адрес, требования к письменному уведомлению (имя, email, заявление об отказе), срок "postmarked within 30 days"
- **ES** (`terms/data/latest/es.json:162`): Упрощено до одного предложения без деталей

### 16. Секция 14.3.5 (изменения арбитражной оговорки) — сокращена в ES
- **EN** (`terms/data/latest/en.json:163`): Полный текст с адресом, сроками, оговоркой "Rejecting a change does not revoke prior consent"
- **ES** (`terms/data/latest/es.json:163`): Упрощено, отсутствует оговорка о сохранении прежнего согласия

### 17. Секция 14.4 (дополнительные положения) — структурная ошибка и сокращение в ES
- **EN** (`terms/data/latest/en.json:165-172`): 4 пункта — time-bar (подробный), class action waiver (caps), consolidated proceeding waiver, jury trial waiver (caps)
- **ES** (`terms/data/latest/es.json:165-172`): 4 пункта, но:
  - Пункт 1: Сокращён до одного предложения (потеряны детали о приостановке срока при переговорах)
  - Пункт 3: "consolidated proceeding waiver" полностью **отсутствует** — вместо него стоит текст о jury trial
  - **Пункт 4 содержит текст governing law** (`"Este Acuerdo se rige por la ley inglesa..."`) — который **дублирует** секцию 14.5 (строка 174)
  - Итого: пункт о consolidated proceedings потерян, governing law дублируется

---

## Несоответствия Apple vs не-Apple

### 18. Privacy Apple-файлы ИДЕНТИЧНЫ обычным
- `privacy/data/latest/en-apple.json` полностью идентичен `privacy/data/latest/en.json`
- `privacy/data/latest/es-apple.json` полностью идентичен `privacy/data/latest/es.json`
- Если Apple-версии должны иметь другие формулировки (как в Terms Apple), их нужно обновить
- Если они специально идентичны, Apple-варианты излишни

### 19. Terms ES-Apple идентичен Terms ES (нет Apple-специфичных изменений)
- `terms/data/latest/es-apple.json` идентичен `terms/data/latest/es.json`
- Но `terms/data/latest/en-apple.json` имеет множество Apple-специфичных отличий от `en.json`:
  - Дополнительное поле `notAMedicalDevice` в introduction
  - Ссылки ведут на `/legal/privacy/?variant=apple`
  - Другое описание в `theAgreement.description` (упоминает WHO, Cochrane, PubMed)
  - Другой текст `aiContent`
  - Другой текст `aiLimitations`
  - Дополнительный текст в `prohibitedContent.intro`
  - Убрано требование "18 лет" из generalConditions
- **Испанская Apple-версия должна иметь аналогичные Apple-адаптации**

### 20. Требование возраста убрано только в EN-Apple, но не в ES-Apple
- EN обычная: `"You are at least 18 years of age and have the legal capability..."`
- EN Apple: `"You are have the legal capability..."` (возраст убран, но с грамматической ошибкой — см. #4)
- ES обычная и ES-Apple обе содержат: `"Tienes al menos 18 años de edad..."`
- Apple-версия намеренно убрала возрастное требование (политика Apple), но в ES это не применено

---

## Проблемы с нумерацией секций

### 21. Privacy EN использует номер "5" для двух секций
- `dataSharing.title`: "5. Will we share your personal data?"
- `otherSharing.title`: "5. How else can we share your personal data?"
- Обе под номером "5" — `otherSharing` вложен в `dataSharing` в JSON, но визуально это путает

### 22. Privacy EN vs ES — нумерация секций полностью расходится
- EN имеет 11 секций, ES — 12 секций
- EN `otherSharing` в секции 5 (подсекция); ES выделяет его в отдельную секцию 6
- Это сдвигает все последующие номера:
  - EN: privacyRights=6, otherSites=7, dataSecurity=8, crossBorder=9, children=10, contact=11
  - ES: privacyRights=7, otherSites=8, dataSecurity=9, crossBorder=10, children=11, contact=12
- Перекрёстные ссылки на номера секций становятся некорректными

---

## Несоответствия между EN и ES

### 23. "Privacy Notice" vs "Privacy Policy" (Privacy EN и ES)
- **EN** (`privacy/data/latest/en.json:227`): В `crossBorderTransfers` написано `"this Privacy Notice"`, но везде в документе — `"Privacy Policy"`
- **ES** (`privacy/data/latest/es.json:227`): Аналогично `"Aviso de Privacidad"` вместо `"Política de Privacidad"` — непоследовательная терминология

### 24. Контактная информация в cross-border различается между EN и ES
- EN: `"For further information, please contact us at support@doctorina.com"` (email)
- ES: `"Para más información, puedes contactarnos a través de 13 Myrtiotissis Street, AQUA MANSIONS..."` (почтовый адрес)
- Юридически значимое различие: способ обращения должен быть одинаковым

### 25. Terms ES "Disposiciones adicionales" — отличия в структуре от EN
- ES объединяет пункт о применимом праве (governing law) в список `additionalProvisions.items` как 4-й пункт
- EN выносит его в отдельное поле `governingLaw`
- При этом governing law текст дублируется в ES (строки 171 и 174) — см. #17

### 26. Privacy ES — семантическое смягчение в секции о клинических решениях
- **EN** (`privacy/data/latest/en.json:116`): `"You should not rely on the outputs provided by the Services."`
- **ES** (`privacy/data/latest/es.json:116`): `"No debes basarte únicamente en los resultados proporcionados por los Servicios."`
- ES добавляет слово **"únicamente"** (исключительно) — смягчает запрет: "не полагайся **исключительно**" vs "не полагайся"
- Юридически значимое отличие: ES допускает частичное использование, EN — нет

---

## Отсутствующие файлы

### 27. Нет Apple-варианта для Cookies
- `cookies/data/latest/` содержит только `en.json` и `es.json` — нет `en-apple.json` и `es-apple.json`
- Privacy и Terms имеют Apple-варианты

### 28. Нет предыдущей версии (v1) для Cookies
- В `cookies/data/` нет папки `v1/`
- Privacy и Terms имеют папки `v1/`
- Cookies пишет "Previous versions are available upon request" вместо ссылки на версию

### 29. Отсутствует `privacy/data/v1/es-apple.json`
- Privacy v1 содержит `en.json`, `en-apple.json`, `es.json` — но нет `es-apple.json`

### 30. Отсутствуют `terms/data/v1/es.json` и `terms/data/v1/es-apple.json`
- Terms v1 содержит только `en.json` и `en-apple.json` — нет испанских версий

---

## Проблемы в v1 (предыдущие версии)

### 31. terms/data/v1/en-apple.json — это НЕ настоящий v1
- Этот файл имеет `effectiveDate: "2025-05-29"` и ссылается на "Version 1 (2024-09-02)" как на предыдущую
- Это копия **текущей** Apple-версии, ошибочно помещённая в папку v1
- Реальный v1 Terms (от 2024-09-02) есть только в `terms/data/v1/en.json`

### 32. privacy/data/v1/en-apple.json — это НЕ настоящий v1
- Файл идентичен `privacy/data/latest/en-apple.json` (effectiveDate: "2025-05-29")
- Это копия текущей версии, ошибочно помещённая в папку v1
- Реальный v1 Privacy (от 2025-02-20) представлен в `privacy/data/v1/en.json` (с другой структурой)

### 33. Privacy v1 EN — используется другой email DPO
- v1 использует `dpo@doctorina.com`
- Текущая версия — `support@doctorina.com`
- Ожидаемо для разных версий, но email DPO должен продолжать работать для читателей v1

### 34. Privacy v1 ES — заголовок секции 2 не соответствует содержимому
- **Файл:** `privacy/data/v1/es.json:10`
- Заголовок: `"2. Aviso sobre la Versión de Prueba"` ("Уведомление о тестовой версии")
- Содержимое: рассказывает о контроллере данных, а не о тестовой версии
- В EN v1 заголовок корректный: `"2. Data Controller"`

### 35. Privacy v1 EN — заголовок "Data Controller" используется дважды
- Секция 2: `"2. Data Controller"` (о контроллере данных)
- Секция 6: `"6. Data Controller"` (о совместном использовании данных)
- Секция 6 должна называться "Data Sharing" или "Access and Sharing of Data"

### 36. Privacy v1 — в футере нет ссылки на "Cookies"
- Оба файла `privacy/data/v1/en.json` и `privacy/data/v1/es.json` имеют footer только с `terms` и `privacy`
- Отсутствует `cookies`, который есть в текущих версиях

### 37. Terms v1 EN — "laws of common sense" в Governing Law
- **Файл:** `terms/data/v1/en.json:58`
- `"governed by and construed in accordance with the laws of common sense"`
- Очевидно плейсхолдер/шутка — должна быть ссылка на реальное право (в текущей версии: "English law")

### 38. Terms v1 EN — используется старый email
- `avs@doctorina.com` вместо `support@doctorina.com`

### 39. Terms v1 EN — заголовок "Terms & Conditions", текущая версия — "Terms of Use"
- Несогласованное наименование. При этом footer в текущих версиях по-прежнему пишет "Terms and Conditions"

---

## Структурные несоответствия

### 40. Адрес в Cookies ES не локализован
- ES-версия: `"Dirección Postal:\n13 Myrtiotissis Street, AQUA MANSIONS\nApartment/Office 1 Germasogeia..."`
- "Apartment/Office" можно перевести как "Apartamento/Oficina"

### 41. Privacy EN introduction одинаковый в Apple и не-Apple
- Оба `en.json` и `en-apple.json` используют описание "personal health information companion"
- Но Terms Apple использует другие формулировки (упоминает WHO, Cochrane, PubMed)
- Если Privacy Apple должен отражать другое позиционирование для Apple, он этого не делает

### 42. Terms Apple — ссылка на Privacy с `?variant=apple`, но разницы нет
- `terms/data/latest/en-apple.json` ссылается на `/legal/privacy/?variant=apple`
- Но содержимое Privacy Apple идентично обычному (см. #18), поэтому эта ссылка ничего не меняет

### 43. Поле `meta.description` есть не везде
- Terms-файлы имеют `meta.description`; Privacy и Cookies — нет

### 44. Privacy v1 EN имеет другую структуру данных, чем latest
- v1 использует плоский формат: `sections.{name}.title` + `sections.{name}.content`
- Текущая версия: вложенные структуры с `items`, `list`, `table` и т.д.
- Рендерер должен уметь обрабатывать обе структуры, иначе v1 не отобразится правильно

### 45. footer.legal — несогласованная структура между документами
- **Cookies:** `footer.lastUpdated` + `footer.previousVersions` (нет `footer.legal`)
- **Privacy latest:** `footer.legal.{terms, privacy, cookies}`
- **Terms latest:** `footer.legal.{terms, privacy, cookies}`
- **Privacy v1:** `footer.legal.{terms, privacy}` (нет cookies)
- **Terms v1:** `footer.legal.{terms, privacy}` (нет cookies)
- У Cookies совершенно другая структура футера по сравнению с Privacy/Terms

### 46. Наименование "Terms and Conditions" в футере vs "Terms of Use" в заголовке
- Все текущие файлы latest (privacy, terms, cookies) в `footer.legal.terms` пишут "Terms and Conditions"
- Но сам документ Terms latest называется "Terms of Use" (`title: "Terms of Use"`)
- Несогласованное наименование документа

### 47. Privacy v1 en-apple.json использует `dpo@doctorina.com` вместо `support@doctorina.com`
- **Файл:** `privacy/data/v1/en-apple.json:11,58,81`
- Файл является копией latest (см. #32), но при этом использует email `dpo@doctorina.com`
- В настоящем latest (`privacy/data/latest/en-apple.json`) используется `support@doctorina.com`
- Это подтверждает, что файл был скопирован из устаревшего промежуточного состояния
