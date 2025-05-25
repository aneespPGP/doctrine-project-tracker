import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import ProjectTracker from './components/ProjectTracker'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (username, password) => {
    // Static login check with === as requested
    // Note: In a real app, this should use a more secure approach
    if (username === 'admin' && password === 'admin1234') {
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
  }

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <ProjectTracker onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
