import { Model } from '../types/Model'

/**
 * Генерирует уникальный ID для модели
 * Формат: name-location-age
 */
export const generateUniqueId = (model: Partial<Model>): string => {
  const name = model.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
  const location = model.location?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
  const age = model.age || 0
  return `${name}-${location}-${age}`
}

/**
 * Генерирует теги для модели на основе характеристик
 */
export const generateTags = (model: Model): string[] => {
  const tags: string[] = []
  
  // Физические характеристики
  if (model.hair) tags.push(model.hair.toLowerCase())
  if (model.eyes) tags.push(model.eyes.toLowerCase())
  if (model.nationality) tags.push(model.nationality.toLowerCase())
  
  // Услуги
  if (model.detailedServices?.sex?.includes('Секс анальный')) tags.push('анальный')
  if (model.detailedServices?.toys) tags.push('игрушки')
  if (model.detailedServices?.massage?.length) tags.push('массаж')
  if (model.detailedServices?.sadoMaso) tags.push('садо-мазо')
  if (model.detailedServices?.mistress) tags.push('госпожа')
  if (model.detailedServices?.slave) tags.push('рабыня')
  if (model.detailedServices?.lightDomination) tags.push('доминация')
  
  // Статусы
  if (model.verified) tags.push('проверенная')
  if (model.vip) tags.push('vip')
  if (model.online) tags.push('онлайн')
  if (model.newThisWeek) tags.push('новая')
  if (model.withVideo) tags.push('видео')
  
  // Дополнительные теги
  if (model.additionalInfo?.toLowerCase().includes('крипт')) tags.push('крипта')
  if (model.additionalInfo?.toLowerCase().includes('студент')) tags.push('студентка')
  if (model.additionalInfo?.toLowerCase().includes('образован')) tags.push('образованная')
  
  return [...new Set(tags)] // Убираем дубликаты
}

/**
 * Проверяет, соответствует ли модель фильтрам
 */
export const matchesFilters = (model: Model, filters: any): boolean => {
  // Проверка статуса
  if (filters.verified && !model.verified) return false
  if (filters.vip && !model.vip) return false
  if (filters.online && !model.online) return false
  if (filters.newThisWeek && !model.newThisWeek) return false
  if (filters.withVideo && !model.withVideo) return false
  
  // Проверка параметров
  if (filters.heightFrom && model.height && model.height < filters.heightFrom) return false
  if (filters.heightTo && model.height && model.height > filters.heightTo) return false
  if (filters.ageFrom && model.age < filters.ageFrom) return false
  if (filters.ageTo && model.age > filters.ageTo) return false
  if (filters.weightFrom && model.weight && model.weight < filters.weightFrom) return false
  if (filters.weightTo && model.weight && model.weight > filters.weightTo) return false
  if (filters.bustFrom && model.bust && model.bust < filters.bustFrom) return false
  if (filters.bustTo && model.bust && model.bust > filters.bustTo) return false
  
  // Проверка характеристик
  if (filters.nationality && model.nationality !== filters.nationality) return false
  if (filters.hair && model.hair !== filters.hair) return false
  if (filters.eyes && model.eyes !== filters.eyes) return false
  if (filters.language && !model.languages.includes(filters.language)) return false
  
  return true
}

/**
 * Сортирует модели по популярности
 */
export const sortByPopularity = (models: Model[]): Model[] => {
  return [...models].sort((a, b) => {
    const scoreA = (a.views || 0) + (a.likes || 0) * 2 + (a.reviews?.rating || 0) * 10
    const scoreB = (b.views || 0) + (b.likes || 0) * 2 + (b.reviews?.rating || 0) * 10
    return scoreB - scoreA
  })
}

/**
 * Сортирует модели по дате добавления
 */
export const sortByDate = (models: Model[]): Model[] => {
  return [...models].sort((a, b) => {
    const dateA = new Date(a.addedDate || 0)
    const dateB = new Date(b.addedDate || 0)
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Сортирует модели по цене
 */
export const sortByPrice = (models: Model[], ascending: boolean = true): Model[] => {
  return [...models].sort((a, b) => {
    const priceA = a.price || 0
    const priceB = b.price || 0
    return ascending ? priceA - priceB : priceB - priceA
  })
}

/**
 * Получает уникальные значения для фильтров
 */
export const getUniqueValues = (models: Model[], field: keyof Model): any[] => {
  const values = models.map(model => model[field]).filter(Boolean)
  return [...new Set(values)]
}

/**
 * Группирует модели по локации
 */
export const groupByLocation = (models: Model[]): Record<string, Model[]> => {
  return models.reduce((acc, model) => {
    const location = model.location
    if (!acc[location]) {
      acc[location] = []
    }
    acc[location].push(model)
    return acc
  }, {} as Record<string, Model[]>)
}

/**
 * Поиск моделей по тексту
 */
export const searchModels = (models: Model[], query: string): Model[] => {
  if (!query.trim()) return models
  
  const searchTerm = query.toLowerCase()
  return models.filter(model => 
    model.name.toLowerCase().includes(searchTerm) ||
    model.location.toLowerCase().includes(searchTerm) ||
    model.description.toLowerCase().includes(searchTerm) ||
    model.services.some(service => service.toLowerCase().includes(searchTerm)) ||
    model.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}
