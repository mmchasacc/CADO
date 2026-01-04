import './App.css'
import { useAuth } from './context/AuthContext'
import Router from './routes/Routes'

function App() {

  const {isAuthenticated} = useAuth()

  return (
      /* isAuthenticated ? <ProtectedRoute /> : <PublicRoute /> */
      <Router />
  )
}

export default App
