import './App.css'
import { useAuth } from './context/AuthContext'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

import TodoPage from './pages/TodoPage'

function App() {

  const { isAuthenticated } = useAuth()

  return (
    <TodoPage />
  )
}

export default App
