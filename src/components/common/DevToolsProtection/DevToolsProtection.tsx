import { useEffect } from 'react'

const DevToolsProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return false
      }
    }

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
    }

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)

    // DevTools detection
    let devtools = {
      open: false,
      orientation: null
    }

    const threshold = 160

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true
          // Redirect or show warning
          console.clear()
          console.log('%cСтоп!', 'color: red; font-size: 50px; font-weight: bold;')
          console.log('%cЭто браузерная функция, предназначенная для разработчиков. Если кто-то сказал вам скопировать и вставить что-то здесь, чтобы включить функцию или "взломать" чужой аккаунт, это мошенничество.', 'color: red; font-size: 16px;')
        }
      } else {
        devtools.open = false
      }
    }, 500)

    // Hide source files from devtools
    const hideSourceFiles = () => {
      // Override console methods to hide source info
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn
      const originalInfo = console.info

      console.log = (...args) => {
        // Filter out source file paths
        const filteredArgs = args.map(arg => {
          if (typeof arg === 'string' && (arg.includes('/src/') || arg.includes('\\src\\'))) {
            return '[Скрыто]'
          }
          return arg
        })
        originalLog.apply(console, filteredArgs)
      }

      console.error = (...args) => {
        const filteredArgs = args.map(arg => {
          if (typeof arg === 'string' && (arg.includes('/src/') || arg.includes('\\src\\'))) {
            return '[Скрыто]'
          }
          return arg
        })
        originalError.apply(console, filteredArgs)
      }

      console.warn = (...args) => {
        const filteredArgs = args.map(arg => {
          if (typeof arg === 'string' && (arg.includes('/src/') || arg.includes('\\src\\'))) {
            return '[Скрыто]'
          }
          return arg
        })
        originalWarn.apply(console, filteredArgs)
      }

      console.info = (...args) => {
        const filteredArgs = args.map(arg => {
          if (typeof arg === 'string' && (arg.includes('/src/') || arg.includes('\\src\\'))) {
            return '[Скрыто]'
          }
          return arg
        })
        originalInfo.apply(console, filteredArgs)
      }
    }

    hideSourceFiles()

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  return null
}

export default DevToolsProtection
