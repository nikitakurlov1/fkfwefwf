# Инструкция по деплою на GitHub Pages

## Автоматический деплой через GitHub Actions

Проект настроен для автоматического деплоя на GitHub Pages при каждом push в ветку `main` или `master`.

### Шаги для настройки:

1. **Убедитесь, что репозиторий создан на GitHub:**
   ```bash
   git remote -v
   ```
   Должен быть: `https://github.com/nikitakurlov1/fkfwefwf`

2. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в Settings → Pages
   - В разделе "Build and deployment"
   - Source: выберите "GitHub Actions"

3. **Запушьте изменения:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

4. **Проверьте деплой:**
   - Перейдите во вкладку "Actions" в репозитории
   - Дождитесь завершения workflow "Deploy to GitHub Pages"
   - Сайт будет доступен по адресу: https://nikitakurlov1.github.io/fkfwefwf

## Ручной деплой (альтернативный способ)

Если нужно задеплоить вручную:

```bash
npm run deploy
```

Эта команда:
1. Соберет проект (`npm run build`)
2. Задеплоит содержимое папки `dist` в ветку `gh-pages`

## Проверка локально перед деплоем

```bash
# Собрать проект
npm run build

# Просмотреть собранный проект
npm run preview
```

## Важные файлы для деплоя

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vite.config.ts` - настройка base path для GitHub Pages
- `public/404.html` - обработка маршрутизации SPA
- `public/.nojekyll` - отключение Jekyll на GitHub Pages

## Устранение проблем

### Сайт не открывается
- Проверьте, что GitHub Pages включен в настройках
- Убедитесь, что выбран источник "GitHub Actions"
- Проверьте статус деплоя во вкладке Actions

### 404 ошибки на страницах
- Убедитесь, что файл `public/404.html` существует
- Проверьте, что в `index.html` добавлен скрипт для маршрутизации

### Стили не загружаются
- Проверьте, что в `vite.config.ts` указан правильный `base: '/fkfwefwf/'`
- Убедитесь, что все пути в коде относительные

## Обновление сайта

Просто запушьте изменения в ветку main:

```bash
git add .
git commit -m "Update site"
git push origin main
```

GitHub Actions автоматически задеплоит изменения.
