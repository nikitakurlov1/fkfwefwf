import { Model } from '../types/Model'

const STORAGE_KEY = 'onenight_models'

export const modelStorage = {
  // Получить все модели
  getModels: async (): Promise<Model[]> => {
    // Сначала проверяем localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing stored models:', error)
      }
    }

    // Если нет в localStorage, загружаем из JSON
    try {
      const response = await fetch('/data/models.json')
      const data = await response.json()
      // Сохраняем в localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    } catch (error) {
      console.error('Error loading models:', error)
      return []
    }
  },

  // Сохранить все модели
  saveModels: (models: Model[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models))
    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('modelsUpdated', { detail: models }))
  },

  // Добавить модель
  addModel: async (model: Model): Promise<void> => {
    const models = await modelStorage.getModels()
    models.push(model)
    modelStorage.saveModels(models)
  },

  // Обновить модель
  updateModel: async (id: number, updates: Partial<Model>): Promise<void> => {
    const models = await modelStorage.getModels()
    const index = models.findIndex(m => m.id === id)
    if (index !== -1) {
      models[index] = { ...models[index], ...updates }
      modelStorage.saveModels(models)
    }
  },

  // Удалить модель
  deleteModel: async (id: number): Promise<void> => {
    const models = await modelStorage.getModels()
    const filtered = models.filter(m => m.id !== id)
    modelStorage.saveModels(filtered)
  },

  // Очистить кэш (вернуться к оригинальным данным)
  clearCache: (): void => {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('modelsUpdated'))
  }
}
