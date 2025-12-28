import './App.css'
import LoginPage from './pages/LogInPage'
import SignUpPage from './pages/SignupPage'
import TodoPage from './pages/TodoPage'
import { useAuth } from './context/AuthContext'

function App() {

  const {isAuthenticated} = useAuth()

  return (
      isAuthenticated ? <TodoPage /> : <LoginPage />
  )
}

export default App
