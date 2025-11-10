interface SiteSettings {
  siteName: string
  supportEmail: string
  supportTelegram: string
  adminCode: string
}

const SETTINGS_KEY = 'onenight_settings'

const defaultSettings: SiteSettings = {
  siteName: 'ONENIGHT',
  supportEmail: 'admin@onenight.com',
  supportTelegram: '@AndreyyyyyyyPer',
  adminCode: 'admin1236'
}

export const settingsStorage = {
  // Получить настройки
  getSettings: (): SiteSettings => {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) }
      } catch (error) {
        console.error('Error parsing settings:', error)
      }
    }
    return defaultSettings
  },

  // Сохранить настройки
  saveSettings: (settings: Partial<SiteSettings>): void => {
    const current = settingsStorage.getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: updated }))
  },

  // Получить конкретную настройку
  getSetting: (key: keyof SiteSettings): string => {
    const settings = settingsStorage.getSettings()
    return settings[key]
  },

  // Сбросить к дефолтным
  resetSettings: (): void => {
    localStorage.removeItem(SETTINGS_KEY)
    window.dispatchEvent(new Event('settingsUpdated'))
  }
}
