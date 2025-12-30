import './App.css'
import LoginPage from './pages/LogInPage'
import SignUpPage from './pages/SignupPage'
import TodoPage from './pages/TodoPage'
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
