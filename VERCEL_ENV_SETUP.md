# Настройка переменных окружения на Vercel

После деплоя на Vercel вы столкнётесь с ошибками Supabase, если не настроены переменные окружения.

## Как настроить

1. Перейдите в ваш проект на Vercel: https://vercel.com/dashboard
2. Выберите проект **dream-rent**
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте следующие переменные:

### Обязательные переменные для клиентской части:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL
Значение: https://quhcqhntmkinzidfixab.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Значение: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aGNxaG50bWtpbnppZGZpeGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODA1NTgsImV4cCI6MjA3NzY1NjU1OH0.jZu_PGDRwNmb4Cy7dZsWLBIiUmSU-0gzdgIVkauZAik
\`\`\`

### Опциональная переменная для серверной части:

\`\`\`
SUPABASE_SERVICE_ROLE_KEY
Значение: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aGNxaG50bWtpbnppZGZpeGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjA4MDU1OCwiZXhwIjoyMDc3NjU2NTU4fQ.tCoFuzEkAPTS7hixHGCkFPdQU44TX_c15LrtQzXZGcA
\`\`\`

⚠️ **ВАЖНО**: SUPABASE_SERVICE_ROLE_KEY имеет полные права доступа!

## После добавления переменных:

1. Выберите окружения (Environments):
   - ✅ **Production** (обязательно!)
   - ✅ **Preview** (опционально, для preview деплоев)
   - ✅ **Development** (опционально)

2. Нажмите **Save**

3. **ВАЖНО**: После сохранения нужно перезапустить деплой!
   - Перейдите во вкладку **Deployments**
   - Найдите последний деплой
   - Нажмите на три точки (...) → **Redeploy**
   - Или просто сделайте коммит и пуш в GitHub

## Проверка:

После редеплоя проверьте в консоли браузера:
- ❌ Не должно быть ошибок "supabaseKey is required"
- ❌ Не должно быть предупреждений о "Multiple GoTrueClient instances"
- ✅ Приложение должно загружаться корректно
- ✅ Данные должны синхронизироваться между браузерами

## Устранение неполадок:

Если ошибки остаются:

1. Убедитесь, что переменные названы **точно** как указано выше
2. Убедитесь, что для **Production** окружения они активны
3. Проверьте, что после добавления переменных вы сделали **Redeploy**
4. Очистите кеш браузера (Ctrl+Shift+Delete)
5. Проверьте логи Vercel: Deployments → Latest Deployment → View Function Logs

## Локальная разработка:

Для локальной разработки используйте файл `.env.local` в корне проекта:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://quhcqhntmkinzidfixab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

⚠️ Этот файл уже добавлен в `.gitignore` и не попадёт в репозиторий.
