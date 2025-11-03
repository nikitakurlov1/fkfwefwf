import { useState } from 'react'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

const FilterModal = ({ isOpen, onClose, onApply }: FilterModalProps) => {
  const [filters, setFilters] = useState({
    verified: false,
    vip: false,
    online: false,
    newThisWeek: false,
    withVideo: false,
    heightFrom: '',
    heightTo: '',
    ageFrom: '',
    ageTo: '',
    weightFrom: '',
    weightTo: '',
    bustFrom: '',
    bustTo: '',
    nationality: '',
    hair: '',
    eyes: '',
    language: '',
    location: '',
    priceFrom: '',
    priceTo: '',
    services: [],
    meetingPlace: ''
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="filter-modal">
      <div className="filter-modal-header">
        <h2 className="filter-modal-title">Фильтр</h2>
        <button className="filter-modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="filter-modal-content">
        {/* По статусу анкеты */}
        <div className="filter-section">
          <h3 className="filter-section-title">По статусу анкеты</h3>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.checked)}
              />
              <svg className="filter-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="filter-option-label">Проверенные</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.vip}
                onChange={(e) => handleFilterChange('vip', e.target.checked)}
              />
              <svg className="filter-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="filter-option-label">VIP</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.online}
                onChange={(e) => handleFilterChange('online', e.target.checked)}
              />
              <svg className="filter-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="filter-option-label">Онлайн</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.newThisWeek}
                onChange={(e) => handleFilterChange('newThisWeek', e.target.checked)}
              />
              <svg className="filter-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="filter-option-label" style={{borderBottom: '2px dotted #e74c3c'}}>Новые за неделю</span>
            </label>
          </div>
        </div>

        {/* По содержанию анкеты */}
        <div className="filter-section">
          <h3 className="filter-section-title">По содержанию анкеты</h3>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.withVideo}
                onChange={(e) => handleFilterChange('withVideo', e.target.checked)}
              />
              <svg className="filter-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span className="filter-option-label">С видео</span>
            </label>
          </div>
        </div>

        {/* По параметрам модели */}
        <div className="filter-section">
          <h3 className="filter-section-title">По параметрам модели</h3>
          
          {/* Рост */}
          <div className="filter-range">
            <div>
              <label className="filter-range-label">Рост от (см)</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="150"
                value={filters.heightFrom}
                onChange={(e) => handleFilterChange('heightFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="filter-range-label">Рост до (см)</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="180"
                value={filters.heightTo}
                onChange={(e) => handleFilterChange('heightTo', e.target.value)}
              />
            </div>
          </div>

          {/* Возраст */}
          <div className="filter-range">
            <div>
              <label className="filter-range-label">Возраст от</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="18"
                value={filters.ageFrom}
                onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="filter-range-label">Возраст до</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="35"
                value={filters.ageTo}
                onChange={(e) => handleFilterChange('ageTo', e.target.value)}
              />
            </div>
          </div>

          {/* Вес */}
          <div className="filter-range">
            <div>
              <label className="filter-range-label">Вес от (кг)</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="45"
                value={filters.weightFrom}
                onChange={(e) => handleFilterChange('weightFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="filter-range-label">Вес до (кг)</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="70"
                value={filters.weightTo}
                onChange={(e) => handleFilterChange('weightTo', e.target.value)}
              />
            </div>
          </div>

          {/* Грудь */}
          <div className="filter-range">
            <div>
              <label className="filter-range-label">Грудь от</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="1"
                value={filters.bustFrom}
                onChange={(e) => handleFilterChange('bustFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="filter-range-label">Грудь до</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="5"
                value={filters.bustTo}
                onChange={(e) => handleFilterChange('bustTo', e.target.value)}
              />
            </div>
          </div>

          {/* Национальность */}
          <div style={{marginBottom: '1rem'}}>
            <label className="filter-range-label">Национальность</label>
            <select
              className="filter-select"
              value={filters.nationality}
              onChange={(e) => handleFilterChange('nationality', e.target.value)}
            >
              <option value="">Любая</option>
              <option value="russian">Русская</option>
              <option value="ukrainian">Украинка</option>
              <option value="belarusian">Белоруска</option>
              <option value="kazakh">Казахстанка</option>
              <option value="other">Другая</option>
            </select>
          </div>

          {/* Волосы */}
          <div style={{marginBottom: '1rem'}}>
            <label className="filter-range-label">Волосы</label>
            <select
              className="filter-select"
              value={filters.hair}
              onChange={(e) => handleFilterChange('hair', e.target.value)}
            >
              <option value="">Любые</option>
              <option value="blonde">Блондинка</option>
              <option value="brunette">Брюнетка</option>
              <option value="redhead">Рыжая</option>
              <option value="black">Темные</option>
            </select>
          </div>

          {/* Глаза */}
          <div style={{marginBottom: '1rem'}}>
            <label className="filter-range-label">Глаза</label>
            <select
              className="filter-select"
              value={filters.eyes}
              onChange={(e) => handleFilterChange('eyes', e.target.value)}
            >
              <option value="">Любые</option>
              <option value="blue">Голубые</option>
              <option value="brown">Карие</option>
              <option value="green">Зеленые</option>
              <option value="gray">Серые</option>
            </select>
          </div>

          {/* Разговорный язык */}
          <div style={{marginBottom: '1rem'}}>
            <label className="filter-range-label">Разговорный язык</label>
            <select
              className="filter-select"
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">Любой</option>
              <option value="russian">Русский</option>
              <option value="english">Английский</option>
              <option value="french">Французский</option>
              <option value="german">Немецкий</option>
            </select>
          </div>
        </div>

        {/* По локации и цене */}
        <div className="filter-section">
          <h3 className="filter-section-title">По локации и цене</h3>
          
          {/* Локация */}
          <div style={{marginBottom: '1rem'}}>
            <label className="filter-range-label">Город</label>
            <select
              className="filter-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Любой город</option>
              <option value="Москва">Москва</option>
              <option value="Санкт-Петербург">Санкт-Петербург</option>
              <option value="Ростов-на-Дону">Ростов-на-Дону</option>
              <option value="Екатеринбург">Екатеринбург</option>
              <option value="Тюмень">Тюмень</option>
              <option value="Новосибирск">Новосибирск</option>
              <option value="Казань">Казань</option>
            </select>
          </div>

          {/* Цена */}
          <div className="filter-range">
            <div>
              <label className="filter-range-label">Цена от (₽)</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="5000"
                value={filters.priceFrom}
                onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="filter-range-label">Цена до (₽)</label>
              <input
                type="number"
                className="filter-range-input"
                placeholder="50000"
                value={filters.priceTo}
                onChange={(e) => handleFilterChange('priceTo', e.target.value)}
              />
            </div>
          </div>

          {/* Место встречи */}
          <div style={{marginBottom: '1rem'}}>
            <label className="filter-range-label">Место встречи</label>
            <select
              className="filter-select"
              value={filters.meetingPlace}
              onChange={(e) => handleFilterChange('meetingPlace', e.target.value)}
            >
              <option value="">Любое</option>
              <option value="Выезд">Выезд</option>
              <option value="У меня">У меня</option>
              <option value="Отель">Отель</option>
            </select>
          </div>
        </div>

        {/* По услугам */}
        <div className="filter-section">
          <h3 className="filter-section-title">По услугам</h3>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.services.includes('Секс классический')}
                onChange={(e) => {
                  const newServices = e.target.checked 
                    ? [...filters.services, 'Секс классический']
                    : filters.services.filter(s => s !== 'Секс классический')
                  handleFilterChange('services', newServices)
                }}
              />
              <span className="filter-option-label">Классический секс</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.services.includes('Секс анальный')}
                onChange={(e) => {
                  const newServices = e.target.checked 
                    ? [...filters.services, 'Секс анальный']
                    : filters.services.filter(s => s !== 'Секс анальный')
                  handleFilterChange('services', newServices)
                }}
              />
              <span className="filter-option-label">Анальный секс</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.services.includes('Массаж')}
                onChange={(e) => {
                  const newServices = e.target.checked 
                    ? [...filters.services, 'Массаж']
                    : filters.services.filter(s => s !== 'Массаж')
                  handleFilterChange('services', newServices)
                }}
              />
              <span className="filter-option-label">Массаж</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.services.includes('Игрушки')}
                onChange={(e) => {
                  const newServices = e.target.checked 
                    ? [...filters.services, 'Игрушки']
                    : filters.services.filter(s => s !== 'Игрушки')
                  handleFilterChange('services', newServices)
                }}
              />
              <span className="filter-option-label">Игрушки</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.services.includes('Ролевые игры')}
                onChange={(e) => {
                  const newServices = e.target.checked 
                    ? [...filters.services, 'Ролевые игры']
                    : filters.services.filter(s => s !== 'Ролевые игры')
                  handleFilterChange('services', newServices)
                }}
              />
              <span className="filter-option-label">Ролевые игры</span>
            </label>
          </div>
        </div>
      </div>

      <div className="filter-modal-footer">
        <button className="filter-apply-btn" onClick={handleApply}>
          Применить
        </button>
      </div>
    </div>
  )
}

export default FilterModal
