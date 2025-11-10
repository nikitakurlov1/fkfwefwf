import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const adminAccess = localStorage.getItem('adminAccess')
    const accessTime = localStorage.getItem('adminAccessTime')
    
    if (!adminAccess || !accessTime) {
      navigate('/')
      return
    }

    // Проверка времени доступа (24 часа)
    const currentTime = Date.now()
    const timeDiff = currentTime - parseInt(accessTime)
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      localStorage.removeItem('adminAccess')
      localStorage.removeItem('adminAccessTime')
      navigate('/')
    }
  }, [navigate])

  return <>{children}</>
}

export default ProtectedRoute
