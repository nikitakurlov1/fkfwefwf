import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.footerLogo}>
              <svg className={styles.heartIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>ONENIGHT</span>
            </Link>
            <p className={styles.footerTagline}>Премиум эскорт услуги</p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Компания</h4>
              <Link to="/about">О проекте</Link>
              <Link to="/contact">Контакты</Link>
              <Link to="/create-profile">Стать моделью</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Информация</h4>
              <Link to="/terms">Правила</Link>
              <Link to="/privacy">Конфиденциальность</Link>
              <Link to="/agreement">Соглашение</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Поддержка</h4>
              <Link to="/help">Помощь</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/safety">Безопасность</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <div className={styles.footerLegal}>
              <span className={styles.footerBadge}>DMCA PROTECTED</span>
              <span className={styles.footerBadge}>18+</span>
            </div>
            <p className={styles.footerCopyright}>© 2024 OneNight. Все модели подтверждают, что им исполнилось 18 лет.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

