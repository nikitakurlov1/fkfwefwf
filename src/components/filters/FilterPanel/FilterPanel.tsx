import { useState } from 'react'
import './FilterPanel.module.css'

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
}

interface FilterState {
  location: string
  minPrice: number
  maxPrice: number
  minAge: number
  maxAge: number
  services: string[]
  available: boolean | null
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: 0,
    maxPrice: 2000,
    minAge: 18,
    maxAge: 50,
    services: [],
    available: null
  })

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service]
    handleFilterChange('services', newServices)
  }

  const resetFilters = () => {
    const resetFilters = {
      location: '',
      minPrice: 0,
      maxPrice: 2000,
      minAge: 18,
      maxAge: 50,
      services: [],
      available: null
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const serviceOptions = [
    'Сопровождение', 'Романтический ужин', 'Путешествия', 'Бизнес-сопровождение',
    'Культурные мероприятия', 'Спорт', 'Развлечения', 'Танцы', 'Пляж',
    'Бизнес-события', 'Конференции', 'Экскурсии', 'Искусство',
    'Фотосессии', 'Креативные проекты'
  ]

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3 className="filter-title">Фильтры поиска</h3>
        <button className="filter-toggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
          Открыть фильтр
        </button>
      </div>
      
      <div className="filter-content">
        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label">Город</label>
            <select
              className="form-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Все города</option>
              <option value="Москва">Москва</option>
              <option value="Санкт-Петербург">Санкт-Петербург</option>
              <option value="Новосибирск">Новосибирск</option>
              <option value="Екатеринбург">Екатеринбург</option>
              <option value="Казань">Казань</option>
              <option value="Нижний Новгород">Нижний Новгород</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Цена (руб/час)</label>
            <div className="price-range">
              <input
                type="number"
                className="form-input"
                placeholder="От"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
              />
              <span>-</span>
              <input
                type="number"
                className="form-input"
                placeholder="До"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 20000)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Возраст</label>
            <div className="age-range">
              <input
                type="number"
                className="form-input"
                placeholder="От"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', parseInt(e.target.value) || 18)}
              />
              <span>-</span>
              <input
                type="number"
                className="form-input"
                placeholder="До"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', parseInt(e.target.value) || 50)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Доступность</label>
            <select
              className="form-select"
              value={filters.available === null ? '' : filters.available.toString()}
              onChange={(e) => handleFilterChange('available', e.target.value === '' ? null : e.target.value === 'true')}
            >
              <option value="">Все</option>
              <option value="true">Доступны</option>
              <option value="false">Заняты</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Услуги</label>
          <div className="services-grid">
            {serviceOptions.map(service => (
              <label key={service} className="service-checkbox">
                <input
                  type="checkbox"
                  checked={filters.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <button className="model-btn" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel

