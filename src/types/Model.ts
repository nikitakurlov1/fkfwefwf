export interface Model {
  id: number
  name: string
  age: number
  location: string
  price: number
  description: string
  photos: string[]
  services: string[]
  languages: string[]
  available: boolean
  
  // Уникальные характеристики (как в примере Виктории)
  height?: number
  weight?: number
  bust?: number
  hair?: string
  eyes?: string
  nationality?: string
  orientation?: string
  meetingPlace?: string
  smoking?: string
  alcohol?: string
  additionalInfo?: string
  
  // Цены (как в примере)
  prices?: {
    apartment?: {
      oneHour?: number
      twoHours?: number
      night?: number
    }
    outcall?: {
      oneHour?: number
      twoHours?: number
      night?: number
      anal?: number
    }
  }
  
  // Расширенные услуги (как в примере)
  detailedServices?: {
    sex?: string[]
    toys?: boolean
    striptease?: string[]
    massage?: string[]
    sadoMaso?: boolean
    mistress?: boolean
    slave?: boolean
    games?: boolean
    lightDomination?: boolean
    roleplay?: string[]
  }
  
  // Статистика
  views?: number
  likes?: number
  addedDate?: string
  
  // Статусы
  verified?: boolean
  vip?: boolean
  online?: boolean
  newThisWeek?: boolean
  withVideo?: boolean
  
  // Контакты
  phone?: string
  whatsapp?: string
  socialMedia?: {
    vk?: string
    instagram?: string
    telegram?: string
  }
  
  // Отзывы
  reviews?: {
    rating: number
    count: number
  }
  
  // Уникальный идентификатор для поиска
  uniqueId?: string
  // Дополнительные теги для фильтрации
  tags?: string[]
}

