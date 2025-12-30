import './App.css'
import { useAuth } from './context/AuthContext'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {

  const {isAuthenticated} = useAuth()

  return (
      isAuthenticated ? <ProtectedRoute /> : <PublicRoute />
  )
}

export default App
