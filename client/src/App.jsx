import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import CarDetails from './components/CarDetails'
import Register from './pages/Register'
import Login from './pages/Login'
import Nav from './components/Nav'
import Profile from './pages/Profile'
import { CheckSession } from './services/Auth'

const App = () => {
  console.log()
  const [user, setUser] = useState(null)

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }

  const checkToken = async () => {
    const user = await CheckSession()
    setUser(user)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <div>
      <BrowserRouter>
        <Nav user={user} handleLogOut={handleLogOut} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
