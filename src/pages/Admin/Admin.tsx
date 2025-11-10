import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Model } from '../../types/Model'
import { settingsStorage } from '../../utils/settingsStorage'
import styles from './Admin.module.css'

interface AdminModel extends Model {
  status: 'active' | 'inactive'
  bookings?: number
}

const Admin = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'models' | 'settings'>('models')
  const [models, setModels] = useState<AdminModel[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<AdminModel | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    siteName: '',
    supportEmail: '',
    supportTelegram: '',
    adminCode: ''
  })
  const [settingsSaved, setSettingsSaved] = useState(false)

  useEffect(() => {
    loadModels()
    loadSettings()
  }, [])

  const loadSettings = () => {
    const currentSettings = settingsStorage.getSettings()
    setSettings(currentSettings)
  }

  const loadModels = async () => {
    try {
      // Загружаем из localStorage или из JSON
      const stored = localStorage.getItem('onenight_models')
      let data: Model[]
      
      if (stored) {
        data = JSON.parse(stored)
      } else {
        const response = await fetch('/data/models.json')
        data = await response.json()
        localStorage.setItem('onenight_models', JSON.stringify(data))
      }
      
      const adminModels: AdminModel[] = data.map(model => ({
        ...model,
        status: model.available ? 'active' : 'inactive',
        bookings: Math.floor(Math.random() * 100)
      }))
      setModels(adminModels)
    } catch (error) {
      console.error('Error loading models:', error)
    }
  }

  const saveModelsToStorage = (updatedModels: AdminModel[]) => {
    // Сохраняем в localStorage
    localStorage.setItem('onenight_models', JSON.stringify(updatedModels))
    // Отправляем событие для обновления других страниц
    window.dispatchEvent(new Event('modelsUpdated'))
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAccess')
    localStorage.removeItem('adminAccessTime')
    navigate('/')
  }

  const deleteModel = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту модель?')) {
      const updatedModels = models.filter(model => model.id !== id)
      setModels(updatedModels)
      saveModelsToStorage(updatedModels)
    }
  }

  const openAddModal = () => {
    setEditingModel(null)
    setIsModalOpen(true)
  }

  const openEditModal = (model: AdminModel) => {
    setEditingModel(model)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingModel(null)
  }

  const saveModel = (modelData: Partial<AdminModel>) => {
    let updatedModels: AdminModel[]
    
    // Убедимся что price синхронизирован с prices.apartment.oneHour
    const syncedPrice = modelData.prices?.apartment?.oneHour || modelData.price || 0
    const finalData = {
      ...modelData,
      price: syncedPrice
    }
    
    if (editingModel) {
      // Редактирование
      updatedModels = models.map(m => 
        m.id === editingModel.id 
          ? { ...m, ...finalData }
          : m
      )
    } else {
      // Добавление
      const newModel: AdminModel = {
        ...finalData,
        id: Math.max(...models.map(m => m.id), 0) + 1,
        name: finalData.name || '',
        age: finalData.age || 18,
        location: finalData.location || '',
        price: syncedPrice,
        description: finalData.description || '',
        photos: finalData.photos || [],
        services: finalData.services || [],
        languages: finalData.languages || [],
        available: true,
        status: 'active',
        views: 0,
        bookings: 0,
        verified: false,
        vip: false,
        online: false,
        newThisWeek: true,
        withVideo: false
      }
      updatedModels = [...models, newModel]
    }
    
    setModels(updatedModels)
    saveModelsToStorage(updatedModels)
    closeModal()
  }

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Menu Button */}
      <button 
        className={styles.mobileMenuBtn}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>ONENIGHT</span>
          </div>
          <p className={styles.adminBadge}>Админ-панель</p>
        </div>

        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'models' ? styles.active : ''}`}
            onClick={() => setActiveTab('models')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Модели
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            Настройки
          </button>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Выйти
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{activeTab === 'models' ? 'Управление моделями' : 'Настройки'}</h1>
          <div className={styles.headerActions}>
            {activeTab === 'models' && (
              <button className={styles.addBtn} onClick={openAddModal}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span className={styles.addBtnText}>Добавить модель</span>
              </button>
            )}
          </div>
        </header>

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div className={styles.content}>
            {/* Mobile Cards View */}
            <div className={styles.mobileCards}>
              {models.map(model => (
                <div key={model.id} className={styles.modelCard}>
                  <div className={styles.modelCardHeader}>
                    <div className={styles.modelCardInfo}>
                      <h3>{model.name}</h3>
                      <p>{model.age} лет • {model.location}</p>
                    </div>
                  </div>
                  <div className={styles.modelCardStats}>
                    <div className={styles.modelCardStat}>
                      <span className={styles.statLabel}>Цена</span>
                      <span className={styles.statValue}>{model.price}₽</span>
                    </div>
                    <div className={styles.modelCardStat}>
                      <span className={styles.statLabel}>ID</span>
                      <span className={styles.statValue}>#{model.id}</span>
                    </div>
                  </div>
                  <div className={styles.modelCardActions}>
                    <button 
                      className={styles.cardActionBtn}
                      onClick={() => openEditModal(model)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Редактировать
                    </button>
                    <button 
                      className={`${styles.cardActionBtn} ${styles.deleteBtn}`}
                      onClick={() => deleteModel(model.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Возраст</th>
                    <th>Город</th>
                    <th>Цена</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(model => (
                    <tr key={model.id}>
                      <td>{model.id}</td>
                      <td className={styles.nameCell}>{model.name}</td>
                      <td>{model.age}</td>
                      <td>{model.location}</td>
                      <td className={styles.priceCell}>{model.price}₽</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.actionBtn} 
                            onClick={() => openEditModal(model)}
                            title="Редактировать"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.delete}`}
                            onClick={() => deleteModel(model.id)}
                            title="Удалить"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={styles.content}>
            <div className={styles.settingsContainer}>
              {settingsSaved && (
                <div className={styles.successMessage}>
                  ✓ Настройки успешно сохранены!
                </div>
              )}

              <div className={styles.settingSection}>
                <h3>Общие настройки</h3>
                <div className={styles.settingItem}>
                  <label>Название сайта</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div className={styles.settingItem}>
                  <label>Email для уведомлений</label>
                  <input 
                    type="email" 
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  />
                </div>
                <div className={styles.settingItem}>
                  <label>Telegram для поддержки</label>
                  <input 
                    type="text" 
                    value={settings.supportTelegram}
                    onChange={(e) => setSettings({...settings, supportTelegram: e.target.value})}
                    placeholder="@username"
                  />
                  <small style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                    Этот Telegram будет использоваться в виджете поддержки
                  </small>
                </div>
                <button 
                  className={styles.saveBtn}
                  onClick={() => {
                    settingsStorage.saveSettings({
                      siteName: settings.siteName,
                      supportEmail: settings.supportEmail,
                      supportTelegram: settings.supportTelegram
                    })
                    setSettingsSaved(true)
                    setTimeout(() => setSettingsSaved(false), 3000)
                  }}
                >
                  Сохранить общие настройки
                </button>
              </div>

              <div className={styles.settingSection}>
                <h3>Безопасность</h3>
                <div className={styles.settingItem}>
                  <label>Изменить админ-код</label>
                  <input 
                    type="text" 
                    value={settings.adminCode}
                    onChange={(e) => setSettings({...settings, adminCode: e.target.value})}
                    placeholder="Новый код доступа"
                  />
                  <small style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                    Этот код нужно будет вводить в чат для входа в админку
                  </small>
                </div>
                <button 
                  className={styles.saveBtn}
                  onClick={() => {
                    if (window.confirm('Вы уверены, что хотите изменить код доступа?')) {
                      settingsStorage.saveSettings({ adminCode: settings.adminCode })
                      setSettingsSaved(true)
                      setTimeout(() => setSettingsSaved(false), 3000)
                      alert(`Новый код доступа: ${settings.adminCode}`)
                    }
                  }}
                >
                  Изменить код доступа
                </button>
              </div>

              <div className={styles.settingSection}>
                <h3>Управление данными</h3>
                <p style={{ color: '#bdc3c7', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Все изменения моделей сохраняются в браузере и отображаются на сайте в реальном времени.
                </p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    if (window.confirm('Вы уверены? Все изменения будут удалены и данные вернутся к оригинальным.')) {
                      localStorage.removeItem('onenight_models')
                      window.dispatchEvent(new Event('modelsUpdated'))
                      loadModels()
                      alert('Данные сброшены к оригинальным')
                    }
                  }}
                >
                  Сбросить к оригинальным данным
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Model Edit/Add Modal */}
      {isModalOpen && (
        <ModelModal
          model={editingModel}
          onClose={closeModal}
          onSave={saveModel}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

// Model Modal Component
interface ModelModalProps {
  model: AdminModel | null
  onClose: () => void
  onSave: (model: Partial<AdminModel>) => void
}

const ModelModal = ({ model, onClose, onSave }: ModelModalProps) => {
  // Функция автозаполнения
  const autoFillForm = () => {
    const sampleData: Partial<AdminModel> = {
      name: 'Анастасия',
      age: 23,
      location: 'Москва',
      height: 170,
      weight: 55,
      bust: 3,
      hair: 'Блондинка',
      eyes: 'Голубые',
      nationality: 'Русская',
      phone: '+7 (999) 123-45-67',
      description: 'Очаровательная и элегантная девушка с безупречными манерами. Обожаю интересные беседы и романтические встречи. Гарантирую незабываемое времяпрепровождение в приятной атмосфере.',
      photos: [
        'https://i.imgur.com/sample1.jpg',
        'https://i.imgur.com/sample2.jpg',
        'https://i.imgur.com/sample3.jpg'
      ],
      services: [
        'Классический секс',
        'Оральный секс',
        'Массаж эротический',
        'Стриптиз'
      ],
      languages: ['Русский', 'Английский'],
      verified: true,
      vip: true,
      online: true,
      available: true,
      newThisWeek: false,
      withVideo: false,
      prices: {
        apartment: {
          oneHour: 15000,
          twoHours: 25000,
          night: 50000
        },
        outcall: {
          oneHour: 20000,
          twoHours: 35000,
          night: 70000
        }
      }
    }
    setFormData({ ...formData, ...sampleData })
  }

  const [formData, setFormData] = useState<Partial<AdminModel>>({
    name: model?.name || '',
    age: model?.age || 18,
    location: model?.location || '',
    price: model?.price || 0,
    description: model?.description || '',
    height: model?.height || 0,
    weight: model?.weight || 0,
    bust: model?.bust || 0,
    hair: model?.hair || '',
    eyes: model?.eyes || '',
    nationality: model?.nationality || '',
    phone: model?.phone || '',
    photos: model?.photos || [],
    services: model?.services || [],
    languages: model?.languages || [],
    verified: model?.verified || false,
    vip: model?.vip || false,
    online: model?.online || false,
    newThisWeek: model?.newThisWeek || false,
    withVideo: model?.withVideo || false,
    available: model?.available !== false,
    prices: model?.prices || {
      apartment: {
        oneHour: model?.price || 0,
        twoHours: 0,
        night: 0
      },
      outcall: {
        oneHour: 0,
        twoHours: 0,
        night: 0
      }
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof AdminModel, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2>{model ? 'Редактировать модель' : 'Добавить модель'}</h2>
            {!model && (
              <button 
                type="button"
                className={styles.autoFillBtn} 
                onClick={autoFillForm}
                title="Заполнить примером"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                Автозаполнение
              </button>
            )}
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Имя *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Возраст *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                min="18"
                max="99"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Город *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Рост (см)</label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
                min="140"
                max="200"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Вес (кг)</label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
                min="40"
                max="120"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Грудь</label>
              <input
                type="number"
                value={formData.bust || ''}
                onChange={(e) => handleChange('bust', parseInt(e.target.value) || 0)}
                min="1"
                max="10"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Цвет волос</label>
              <select
                value={formData.hair}
                onChange={(e) => handleChange('hair', e.target.value)}
              >
                <option value="">Выберите</option>
                <option value="Блондинка">Блондинка</option>
                <option value="Брюнетка">Брюнетка</option>
                <option value="Шатенка">Шатенка</option>
                <option value="Рыжая">Рыжая</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Цвет глаз</label>
              <select
                value={formData.eyes}
                onChange={(e) => handleChange('eyes', e.target.value)}
              >
                <option value="">Выберите</option>
                <option value="Карие">Карие</option>
                <option value="Голубые">Голубые</option>
                <option value="Зеленые">Зеленые</option>
                <option value="Серые">Серые</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Национальность</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className={styles.statusSection}>
            <h3>Статусы и метки</h3>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.verified || false}
                  onChange={(e) => handleChange('verified', e.target.checked)}
                />
                <span>✓ Верифицирована</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.vip || false}
                  onChange={(e) => handleChange('vip', e.target.checked)}
                />
                <span>⭐ VIP</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.online || false}
                  onChange={(e) => handleChange('online', e.target.checked)}
                />
                <span>🟢 Онлайн</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.newThisWeek || false}
                  onChange={(e) => handleChange('newThisWeek', e.target.checked)}
                />
                <span>🆕 Новая на этой неделе</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.withVideo || false}
                  onChange={(e) => handleChange('withVideo', e.target.checked)}
                />
                <span>🎥 С видео</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.available !== false}
                  onChange={(e) => handleChange('available', e.target.checked)}
                />
                <span>✅ Доступна</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="Расскажите о модели..."
            />
          </div>

          {/* Photos Section */}
          <div className={styles.photosSection}>
            <h3>Фотографии</h3>
            <p className={styles.photoHint}>Загрузите фото с устройства или добавьте ссылки</p>
            
            {/* File Upload */}
            <div className={styles.formGroup}>
              <label>Загрузить фото с устройства</label>
              <div className={styles.fileUploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    files.forEach(file => {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string
                        const currentPhotos = formData.photos || []
                        handleChange('photos', [...currentPhotos, base64])
                      }
                      reader.readAsDataURL(file)
                    })
                    // Очищаем input для возможности повторной загрузки
                    e.target.value = ''
                  }}
                  className={styles.fileInput}
                  id="photoUpload"
                />
                <label htmlFor="photoUpload" className={styles.fileUploadLabel}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                  </svg>
                  <span>Выбрать фото</span>
                  <small>Можно выбрать несколько</small>
                </label>
              </div>
            </div>

            {/* URL Input */}
            <div className={styles.formGroup}>
              <label>Или добавьте ссылки на фото</label>
              <textarea
                value={(formData.photos || []).filter(p => p.startsWith('http')).join('\n')}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim())
                  const base64Photos = (formData.photos || []).filter(p => p.startsWith('data:'))
                  handleChange('photos', [...base64Photos, ...urls])
                }}
                rows={4}
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
              />
            </div>

            {formData.photos && formData.photos.length > 0 && (
              <div className={styles.photoPreview}>
                <h4>Предпросмотр ({formData.photos.length} фото)</h4>
                <div className={styles.photoGrid}>
                  {formData.photos.map((photo, index) => (
                    <div key={index} className={styles.photoItem}>
                      <img src={photo} alt={`Фото ${index + 1}`} />
                      <button
                        type="button"
                        className={styles.removePhotoBtn}
                        onClick={() => {
                          const newPhotos = formData.photos?.filter((_, i) => i !== index) || []
                          handleChange('photos', newPhotos)
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className={styles.servicesSection}>
            <h3>Услуги</h3>
            <p className={styles.serviceHint}>Добавьте услуги (по одной на строку)</p>
            
            <div className={styles.formGroup}>
              <label>Список услуг</label>
              <textarea
                value={(formData.services || []).join('\n')}
                onChange={(e) => {
                  const services = e.target.value.split('\n').filter(s => s.trim())
                  handleChange('services', services)
                }}
                rows={8}
                placeholder="Классический секс&#10;Оральный секс&#10;Массаж&#10;Стриптиз&#10;..."
              />
            </div>

            {formData.services && formData.services.length > 0 && (
              <div className={styles.servicesList}>
                <h4>Выбрано услуг: {formData.services.length}</h4>
                <div className={styles.serviceTags}>
                  {formData.services.map((service, index) => (
                    <span key={index} className={styles.serviceTag}>
                      {service}
                      <button
                        type="button"
                        onClick={() => {
                          const newServices = formData.services?.filter((_, i) => i !== index) || []
                          handleChange('services', newServices)
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Languages Section */}
          <div className={styles.languagesSection}>
            <h3>Языки</h3>
            
            <div className={styles.formGroup}>
              <label>Список языков</label>
              <textarea
                value={(formData.languages || []).join('\n')}
                onChange={(e) => {
                  const languages = e.target.value.split('\n').filter(l => l.trim())
                  handleChange('languages', languages)
                }}
                rows={4}
                placeholder="Русский&#10;Английский&#10;Французский&#10;..."
              />
            </div>

            {formData.languages && formData.languages.length > 0 && (
              <div className={styles.languagesList}>
                <div className={styles.languageTags}>
                  {formData.languages.map((language, index) => (
                    <span key={index} className={styles.languageTag}>
                      {language}
                      <button
                        type="button"
                        onClick={() => {
                          const newLanguages = formData.languages?.filter((_, i) => i !== index) || []
                          handleChange('languages', newLanguages)
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prices Section */}
          <div className={styles.pricesSection}>
            <h3>Цены</h3>
            
            <div className={styles.priceCategory}>
              <h4>У себя (апартаменты)</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>1 час (₽) *</label>
                  <input
                    type="number"
                    value={formData.prices?.apartment?.oneHour || formData.price || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setFormData(prev => ({
                        ...prev,
                        price: value,
                        prices: {
                          ...prev.prices,
                          apartment: {
                            ...prev.prices?.apartment,
                            oneHour: value
                          }
                        }
                      }))
                    }}
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>2 часа (₽)</label>
                  <input
                    type="number"
                    value={formData.prices?.apartment?.twoHours || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setFormData(prev => ({
                        ...prev,
                        prices: {
                          ...prev.prices,
                          apartment: {
                            ...prev.prices?.apartment,
                            twoHours: value
                          }
                        }
                      }))
                    }}
                    min="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Ночь (₽)</label>
                  <input
                    type="number"
                    value={formData.prices?.apartment?.night || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setFormData(prev => ({
                        ...prev,
                        prices: {
                          ...prev.prices,
                          apartment: {
                            ...prev.prices?.apartment,
                            night: value
                          }
                        }
                      }))
                    }}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className={styles.priceCategory}>
              <h4>Выезд</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>1 час (₽)</label>
                  <input
                    type="number"
                    value={formData.prices?.outcall?.oneHour || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setFormData(prev => ({
                        ...prev,
                        prices: {
                          ...prev.prices,
                          outcall: {
                            ...prev.prices?.outcall,
                            oneHour: value
                          }
                        }
                      }))
                    }}
                    min="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>2 часа (₽)</label>
                  <input
                    type="number"
                    value={formData.prices?.outcall?.twoHours || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setFormData(prev => ({
                        ...prev,
                        prices: {
                          ...prev.prices,
                          outcall: {
                            ...prev.prices?.outcall,
                            twoHours: value
                          }
                        }
                      }))
                    }}
                    min="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Ночь (₽)</label>
                  <input
                    type="number"
                    value={formData.prices?.outcall?.night || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setFormData(prev => ({
                        ...prev,
                        prices: {
                          ...prev.prices,
                          outcall: {
                            ...prev.prices?.outcall,
                            night: value
                          }
                        }
                      }))
                    }}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.saveBtn}>
              {model ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Admin
