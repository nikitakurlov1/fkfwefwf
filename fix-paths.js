const fs = require('fs');
const path = require('path');

// Читаем models.json
const modelsPath = path.join(__dirname, 'src/data/models.json');
const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));

// Функция для исправления путей
function fixPaths(obj) {
  if (typeof obj === 'string') {
    // Заменяем /src/assets/ на ./src/assets/
    return obj.replace(/^\/src\/assets\//, './src/assets/');
  } else if (Array.isArray(obj)) {
    return obj.map(fixPaths);
  } else if (obj && typeof obj === 'object') {
    const fixed = {};
    for (const key in obj) {
      fixed[key] = fixPaths(obj[key]);
    }
    return fixed;
  }
  return obj;
}

// Исправляем все пути
const fixedModels = fixPaths(models);

// Сохраняем исправленный файл
fs.writeFileSync(modelsPath, JSON.stringify(fixedModels, null, 2));

console.log('✅ Все пути к изображениям исправлены!');
console.log(`📊 Обработано ${models.length} моделей`);
