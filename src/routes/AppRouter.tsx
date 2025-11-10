import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import ModelPage from '../pages/ModelPage/ModelPage'
import CreateProfile from '../pages/CreateProfile/CreateProfile'
import Privacy from '../pages/Privacy/Privacy'
import Terms from '../pages/Terms/Terms'
import Admin from '../pages/Admin/Admin'
import ProtectedRoute from '../components/common/ProtectedRoute/ProtectedRoute'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/model/:id" element={<ModelPage />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default AppRouter

