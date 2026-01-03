import './App.css'
import { useAuth } from './context/AuthContext'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'

import TodoPage from './pages/TodoPage'
import { Router } from 'react-router-dom'

function App() {

  const { isAuthenticated } = useAuth()

  return (
    <Router />
  )
}

export default App
