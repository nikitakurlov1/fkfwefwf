import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../../components/common/Footer/Footer'
import ChatWidget from '../../components/common/ChatWidget/ChatWidget'
import styles from './CreateProfile.module.css'

const CreateProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    price: '',
    description: '',
    services: [] as string[],
    languages: [] as string[],
    phone: '',
    email: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const serviceOptions = [
    'Сопровождение', 'Романтический ужин', 'Путешествия', 'Деловое сопровождение',
    'Культурные мероприятия', 'Спорт', 'Развлечения', 'Танцы', 'Пляж',
    'Деловые события', 'Конференции', 'Экскурсии', 'Искусство',
    'Фотосессии', 'Креативные проекты'
  ]

  const languageOptions = [
    'Русский', 'Английский', 'Немецкий', 'Французский', 'Итальянский', 'Испанский', 'Китайский'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    }

    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
      newErrors.age = 'Возраст должен быть от 18 до 65 лет'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Город обязателен'
    }

    if (!formData.price || parseInt(formData.price) < 1000) {
      newErrors.price = 'Цена должна быть не менее 1000 рублей'
    }

    if (!formData.description.trim() || formData.description.length < 50) {
      newErrors.description = 'Описание должно содержать минимум 50 символов'
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Выберите хотя бы одну услугу'
    }

    if (formData.languages.length === 0) {
      newErrors.languages = 'Выберите хотя бы один язык'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен'
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        console.log('Form submitted:', formData)
        setShowSuccess(true)
        
        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: '',
            age: '',
            location: '',
            price: '',
            description: '',
            services: [],
            languages: [],
            phone: '',
            email: ''
          })
          setShowSuccess(false)
          navigate('/')
        }, 3000)
        
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className={styles.createProfilePage}>
      {/* Dark Header */}
      <div className="header-dark">
        <div className="header-dark-content">
          <Link to="/" className="logo-dark">
            <svg className="heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            ONENIGHT
          </Link>
          <div className="header-actions-dark">
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Success Notification */}
      {showSuccess && (
        <div className={styles.successNotification}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✅</div>
            <div className={styles.successText}>
              <h3>Заявка отправлена!</h3>
              <p>Мы получили вашу информацию и свяжемся с вами в ближайшее время.</p>
              <p>Наша служба поддержки рассмотрит вашу анкету и даст обратную связь.</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.createProfileContainer}>
        <div className={styles.createProfile}>
          <h1>Создание анкеты модели</h1>
          <p>Заполните форму ниже, чтобы создать вашу анкету. Наша служба поддержки свяжется с вами для верификации.</p>

          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formSection}>
              <h2>Основная информация</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Имя *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
                    placeholder="Ваше имя"
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Возраст *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${errors.age ? styles.error : ''}`}
                    placeholder="Ваш возраст"
                    min="18"
                    max="65"
                  />
                  {errors.age && <span className={styles.errorMessage}>{errors.age}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Город *</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`${styles.formSelect} ${errors.location ? styles.error : ''}`}
                  >
                    <option value="">Выберите город</option>
                    <option value="Москва">Москва</option>
                    <option value="Санкт-Петербург">Санкт-Петербург</option>
                    <option value="Новосибирск">Новосибирск</option>
                    <option value="Екатеринбург">Екатеринбург</option>
                    <option value="Казань">Казань</option>
                    <option value="Нижний Новгород">Нижний Новгород</option>
                    <option value="Другое">Другое</option>
                  </select>
                  {errors.location && <span className={styles.errorMessage}>{errors.location}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Цена (руб/час) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${errors.price ? styles.error : ''}`}
                    placeholder="Цена за час"
                    min="1000"
                  />
                  {errors.price && <span className={styles.errorMessage}>{errors.price}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Описание *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${styles.formTextarea} ${errors.description ? styles.error : ''}`}
                  placeholder="Опишите себя, свои преимущества и что вы можете предложить..."
                  rows={4}
                />
                {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Услуги</h2>
              <div className={styles.servicesGrid}>
                {serviceOptions.map(service => (
                  <label key={service} className={styles.serviceCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
              {errors.services && <span className={styles.errorMessage}>{errors.services}</span>}
            </div>

            <div className={styles.formSection}>
              <h2>Языки</h2>
              <div className={styles.languagesGrid}>
                {languageOptions.map(language => (
                  <label key={language} className={styles.languageCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={() => handleLanguageToggle(language)}
                    />
                    <span>{language}</span>
                  </label>
                ))}
              </div>
              {errors.languages && <span className={styles.errorMessage}>{errors.languages}</span>}
            </div>

            <div className={styles.formSection}>
              <h2>Контактная информация</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${errors.phone ? styles.error : ''}`}
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                  {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
              </button>
              <button 
                type="button" 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default CreateProfile

