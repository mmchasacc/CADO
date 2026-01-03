import './App.css'
import { useAuth } from './context/AuthContext'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'
import Router from './routes/Routes'

function App() {

  const {isAuthenticated} = useAuth()

  return (
      /* isAuthenticated ? <ProtectedRoute /> : <PublicRoute /> */
      <Router />
  )
}

export default App
