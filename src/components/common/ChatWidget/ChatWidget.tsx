import { useState, useEffect, useRef } from 'react'
import { settingsStorage } from '../../../utils/settingsStorage'
import styles from './ChatWidget.module.css'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [supportTelegram, setSupportTelegram] = useState('@AndreyyyyyyyPer')
  const [adminCode, setAdminCode] = useState('admin1236')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      text: "Привет! Если есть вопросы, то пиши нашему сутинеру в Telegram",
      time: "14:30"
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Загружаем настройки при монтировании
  useEffect(() => {
    const settings = settingsStorage.getSettings()
    setSupportTelegram(settings.supportTelegram)
    setAdminCode(settings.adminCode)

    // Слушаем обновления настроек
    const handleSettingsUpdate = () => {
      const updatedSettings = settingsStorage.getSettings()
      setSupportTelegram(updatedSettings.supportTelegram)
      setAdminCode(updatedSettings.adminCode)
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Показываем чат через 3 секунды после загрузки страницы
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // Проверка на админ-код (используем динамический код из настроек)
      if (newMessage.trim() === adminCode) {
        // Сохраняем токен доступа
        localStorage.setItem('adminAccess', 'true')
        localStorage.setItem('adminAccessTime', Date.now().toString())
        // Перенаправляем на админ-панель
        window.location.href = '/admin'
        return
      }

      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages([...messages, userMessage])
      setNewMessage('')
      
      // Автоответ агента
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          type: 'agent',
          text: "Спасибо за сообщение! Наш сутинер свяжется с вами в Telegram для обсуждения деталей.",
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, agentResponse])
      }, 1000)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setIsOpen(false)
  }

  const handleSupportClick = () => {
    // Убираем @ если он есть в начале
    const username = supportTelegram.startsWith('@') ? supportTelegram.slice(1) : supportTelegram
    window.open(`https://t.me/${username}`, '_blank')
  }

  if (!isVisible) return null

  return (
    <div className={styles.chatWidgetContainer}>
      {/* Fixed Button */}
      {!isOpen && !isMinimized && (
        <button 
          onClick={handleOpen}
          title="Открыть чат"
          className={styles.chatWidgetTrigger}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <button 
          onClick={handleOpen}
          title="Открыть чат"
          className={styles.chatWidgetMinimized}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
      )}

      {/* Full Chat Widget */}
      {isOpen && (
        <div className={styles.chatWidgetWindow}>
          {/* Header */}
          <div className={styles.chatWidgetHeader}>
            <div className={styles.chatWidgetAgentInfo}>
              <div className={styles.chatWidgetAvatar}>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
                  alt="Support"
                />
                <div className={styles.chatWidgetOnlineIndicator}></div>
              </div>
              <div className={styles.chatWidgetAgentDetails}>
                <div className={styles.chatWidgetAgentName}>Поддержка</div>
                <div className={styles.chatWidgetAgentStatus}>Онлайн</div>
              </div>
            </div>
            <div className={styles.chatWidgetHeaderActions}>
              <button 
                onClick={handleSupportClick}
                title="Перейти в Telegram"
                className={styles.chatWidgetSettingsBtn}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.95C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.95L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                </svg>
              </button>
              <button 
                onClick={handleClose}
                title="Закрыть"
                className={styles.chatWidgetCloseBtn}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.chatWidgetMessages}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${styles.chatWidgetMessage} ${message.type === 'user' ? styles.user : styles.agent}`}
              >
                {message.type === 'agent' && (
                  <div className={styles.chatWidgetMessageAvatar}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
                      alt="Support"
                    />
                  </div>
                )}
                <div className={styles.chatWidgetMessageContent}>
                  <div className={styles.chatWidgetMessageBubble}>
                    <div className={styles.chatWidgetMessageText}>
                      {message.text}
                    </div>
                    <div className={styles.chatWidgetMessageTime}>
                      {message.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.chatWidgetInput}>
            <form onSubmit={handleSendMessage} className={styles.chatWidgetForm}>
              <div className={styles.chatWidgetInputContainer}>
                <button 
                  type="button" 
                  title="Голосовое сообщение"
                  className={styles.chatWidgetMicBtn}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите ваше сообщение..."
                  className={styles.chatWidgetTextInput}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className={styles.chatWidgetSendBtn}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </form>
            <div className={styles.chatWidgetQuickActions}>
              <button 
                onClick={handleSupportClick}
                className={styles.chatWidgetQuickBtn}
              >
                Перейти в Telegram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWidget