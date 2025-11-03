/**
 * Скрипт для массового добавления моделей из Figma
 * Используйте этот скрипт для быстрого добавления 70+ моделей
 */

const fs = require('fs')
const path = require('path')

// Шаблон для новой модели
const modelTemplate = {
  id: 0,
  name: "",
  age: 0,
  location: "",
  price: 0,
  description: "",
  photos: [
    "/src/assets/images/models/[FOLDER_NAME]/photo1.jpg",
    "/src/assets/images/models/[FOLDER_NAME]/photo2.jpg",
    "/src/assets/images/models/[FOLDER_NAME]/photo3.jpg",
    "/src/assets/images/models/[FOLDER_NAME]/photo4.jpg",
    "/src/assets/images/models/[FOLDER_NAME]/photo5.jpg"
  ],
  services: [],
  languages: ["Русский"],
  available: true,
  height: 0,
  weight: 0,
  bust: 0,
  hair: "",
  eyes: "",
  nationality: "Русская",
  orientation: "Гетеро",
  meetingPlace: "Выезд",
  smoking: "Не курю",
  alcohol: "Иногда",
  additionalInfo: "",
  prices: {
    apartment: {
      oneHour: 0,
      twoHours: 0,
      night: 0
    },
    outcall: {
      oneHour: null,
      twoHours: 0,
      night: 0,
      anal: 0
    }
  },
  detailedServices: {
    sex: [],
    toys: false,
    striptease: [],
    massage: [],
    sadoMaso: false,
    mistress: false,
    slave: false,
    games: false,
    lightDomination: false,
    roleplay: []
  },
  views: 0,
  likes: 0,
  addedDate: new Date().toLocaleDateString('ru-RU'),
  verified: false,
  vip: false,
  online: true,
  newThisWeek: false,
  withVideo: false,
  phone: "+790",
  whatsapp: "+790",
  socialMedia: {
    vk: "",
    instagram: ""
  },
  reviews: {
    rating: 0,
    count: 0
  },
  uniqueId: "",
  tags: []
}

// Функция для создания уникального ID
function generateUniqueId(name, location, age) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '-')
  const cleanLocation = location.toLowerCase().replace(/\s+/g, '-')
  return `${cleanName}-${cleanLocation}-${age}`
}

// Функция для создания папки модели
function createModelFolder(folderName) {
  const folderPath = path.join(__dirname, '../assets/images/models', folderName)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`✅ Создана папка: ${folderPath}`)
  }
  return folderPath
}

// Функция для добавления новой модели
function addModel(modelData) {
  // Создаем папку для модели
  const folderName = modelData.uniqueId || generateUniqueId(modelData.name, modelData.location, modelData.age)
  createModelFolder(folderName)
  
  // Обновляем пути к фото
  modelData.photos = [
    `/src/assets/images/models/${folderName}/photo1.jpg`,
    `/src/assets/images/models/${folderName}/photo2.jpg`,
    `/src/assets/images/models/${folderName}/photo3.jpg`,
    `/src/assets/images/models/${folderName}/photo4.jpg`,
    `/src/assets/images/models/${folderName}/photo5.jpg`
  ]
  
  // Генерируем уникальный ID
  modelData.uniqueId = folderName
  
  return modelData
}

// Пример использования:
const newModels = [
  {
    name: "Анна",
    age: 25,
    location: "Москва",
    price: 8000,
    description: "Описание модели...",
    height: 165,
    weight: 55,
    bust: 3,
    hair: "Блондинка",
    eyes: "Голубые",
    services: ["Секс классический", "Массаж"],
    detailedServices: {
      sex: ["Секс классический"],
      massage: ["Классический"],
      toys: false,
      striptease: [],
      sadoMaso: false,
      mistress: false,
      slave: false,
      games: false,
      lightDomination: false,
      roleplay: []
    }
  },
  // Добавьте здесь остальные 69 моделей...
]

// Функция для обновления models.json
function updateModelsJson(newModels) {
  const modelsPath = path.join(__dirname, '../data/models.json')
  
  try {
    // Читаем существующие модели
    const existingModels = JSON.parse(fs.readFileSync(modelsPath, 'utf8'))
    
    // Добавляем новые модели
    const updatedModels = [...existingModels]
    let nextId = Math.max(...existingModels.map(m => m.id)) + 1
    
    newModels.forEach(modelData => {
      const newModel = { ...modelTemplate, ...modelData, id: nextId++ }
      const processedModel = addModel(newModel)
      updatedModels.push(processedModel)
    })
    
    // Сохраняем обновленный файл
    fs.writeFileSync(modelsPath, JSON.stringify(updatedModels, null, 2))
    console.log(`✅ Добавлено ${newModels.length} новых моделей`)
    console.log(`📊 Всего моделей: ${updatedModels.length}`)
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении models.json:', error)
  }
}

// Запуск скрипта
if (require.main === module) {
  console.log('🚀 Запуск скрипта добавления моделей...')
  updateModelsJson(newModels)
}

module.exports = {
  addModel,
  createModelFolder,
  generateUniqueId,
  updateModelsJson
}
