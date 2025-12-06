# Исследование: Проблема с браузерным логином на Staging

**Дата начала:** 2025-12-05
**Статус:** РЕШЕНО - Найдена причина

## КОРНЕВАЯ ПРИЧИНА

**Secure cookie на HTTP соединении**

В `src/server/app.ts:56-59`:
```javascript
cookie: {
    secure: env.NODE_ENV === 'production',  // ← Причина!
    sameSite: 'lax',
}
```

Staging запускается с `NODE_ENV=production` → `secure: true`.
Но staging работает на `http://localhost:5252` (HTTP, не HTTPS).

**Результат:** Браузер НЕ отправляет session cookie при переходе на `/` после успешного логина, потому что cookie помечена как `secure` и может передаваться только через HTTPS.

### Доказательство из логов сервера:
```
Login attempt for user: v_haluza_2@exadel.com
User authenticated successfully: v_haluza_2@exadel.com  ✅ Логин успешен!
user is not authenticated, will redirected - /         ❌ Но cookie не пришла
```

### Решение

Изменить настройку cookie в `.env` staging или в коде:

**Вариант 1:** Использовать `NODE_ENV=development` для staging
**Вариант 2:** Добавить отдельную переменную `SYNGRISI_COOKIE_SECURE=false`
**Вариант 3:** Использовать HTTPS для staging (через reverse proxy)

---

## Описание проблемы

При попытке залогиниться через браузер (MCP Test Engine) на staging окружении (порт 5252), форма логина очищается после нажатия "Sign in" и остаётся на странице `/auth` без перехода в приложение.

## Что подтверждено

### 1. Пароли в .env.staging КОРРЕКТНЫ

Прямая проверка pbkdf2 хеширования:
```javascript
// Параметры passport-local-mongoose
const options = {
  iterations: 25000,
  keylen: 512,
  encoding: 'hex',
  digestAlgorithm: 'sha256',
};

// Результат теста
// Passwords match: true
```

### 2. API логин РАБОТАЕТ

```bash
curl -s 'http://localhost:5252/v1/auth/login' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username":"v_haluza_2@exadel.com","password":"Syngrisi-3214"}'
# {"message":"success"}

curl -s 'http://localhost:5252/v1/auth/login' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username":"Administrator","password":"Cakeisalie-1488"}'
# {"message":"success"}
```

### 3. Данные пользователей в БД корректны

```javascript
// Коллекция: vrsusers
{
  username: 'v_haluza_2@exadel.com',
  firstName: 'V',
  lastName: 'H',
  role: 'reviewer',
  password: 'c8c7f952f0017ea6840f0b5c03500978...', // 1024 hex chars (512 bytes)
  salt: '91d89efca8e19dbc96fc19c9b83d5015...',    // 64 hex chars (32 bytes)
}
```

### 4. Форма заполняется корректно

Скриншот `before_login.png` показывает:
- Email: `v_haluza_2@exadel.com`
- Password: `•••••••••••` (маскированный)

### 5. После нажатия "Sign in"

- Форма очищается (поля становятся пустыми)
- URL остаётся `/auth`
- Редирект в приложение не происходит

## Гипотезы

### Гипотеза 1: Cookie не сохраняется
Playwright в headed режиме может иметь проблемы с сохранением session cookie.

**Проверка:** Посмотреть cookies после попытки логина.

### Гипотеза 2: SameSite Cookie Policy
Современные браузеры строго относятся к SameSite cookie атрибуту.

**Проверка:** Проверить настройки cookie в express-session.

### Гипотеза 3: Redirect после успешного логина
Возможно, redirect возвращает на /auth из-за какой-то проверки.

**Проверка:** Проследить network requests в браузере.

### Гипотеза 4: Form submission vs API call
Форма может использовать другой механизм аутентификации чем API.

**Проверка:** Сравнить auth endpoints для формы и API.

### Гипотеза 5: CSRF token
Форма может требовать CSRF токен, который не передаётся.

**Проверка:** Проверить наличие CSRF middleware.

## Файлы для анализа

- `src/server/controllers/auth.controller.ts` - контроллер аутентификации
- `src/server/app.ts` - настройка passport и session
- `src/ui-app/auth/` - React компонент формы логина
- `src/server/routes/v1/auth.route.ts` - роуты аутентификации

## Следующие шаги

1. [ ] Проверить network requests в браузере DevTools
2. [ ] Проверить cookies после попытки логина
3. [ ] Проверить серверные логи на наличие ошибок аутентификации
4. [ ] Сравнить форму логина и API endpoint
5. [ ] Проверить настройки express-session

## Логи исследования

### 2025-12-05 - Начальное исследование

1. Запустил staging MCP сессию в headed режиме
2. Заполнил форму логина через MCP steps
3. Сделал скриншот - форма заполнена корректно
4. Нажал "Sign in"
5. Сделал скриншот - форма очистилась, URL остался /auth
6. Проверил API через curl - работает
7. Проверил хеширование напрямую - пароль совпадает

**Вывод промежуточный:** Проблема не в паролях и не в API, а в браузерной форме или cookie/session.

### 2025-12-05 - Продолжение: Найдена причина

8. Проверил серверные логи с фильтром `Login attempt|authenticated|auth`
9. Обнаружил паттерн:
   ```
   Login attempt for user: v_haluza_2@exadel.com
   User authenticated successfully: v_haluza_2@exadel.com
   user is not authenticated, will redirected - /
   ```
10. Это означает: логин УСПЕШЕН, но при redirect на `/` сессия не распознаётся
11. Проверил настройки express-session в `src/server/app.ts`
12. Нашёл: `cookie: { secure: env.NODE_ENV === 'production' }`
13. Staging использует `NODE_ENV=production` → `secure: true`
14. Но staging работает через HTTP (не HTTPS) → cookie не отправляется

**КОРНЕВАЯ ПРИЧИНА НАЙДЕНА:** Secure cookie flag на HTTP соединении.

### 2025-12-05 - Исправление применено и проверено

15. Закоммичено изменение `secure: false` в `src/server/app.ts`
16. Обновлён staging worktree: `git checkout 595356d8`
17. Пересобран сервер: `npm run build:server`
18. Перезапущен staging
19. **Логин через MCP работает!** URL после логина: `http://localhost:5252/?sortBy=startDate%3Adesc`
20. Скриншот `login_success.png` подтверждает успешный вход

**ПРОБЛЕМА РЕШЕНА ✅**
