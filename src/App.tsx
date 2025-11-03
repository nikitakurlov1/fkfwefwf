import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import AppRouter from './routes/AppRouter'
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary'
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop'
import DevToolsProtection from './components/common/DevToolsProtection/DevToolsProtection'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DevToolsProtection />
        <ScrollToTop />
        <AppRouter />
        <Analytics />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

