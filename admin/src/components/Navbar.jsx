import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { aToken, setAtoken } = useContext(AdminContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    if (aToken) {
      setAtoken('')
      localStorage.removeItem('aToken')
    }
  }

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img
          src={assets.admin_logo}
          alt="Admin Dashboard Logo"
          className="w-32 sm:w-36 lg:w-40 cursor-pointer"
          onClick={() => navigate('/admin-dasboard')}
        />
        <span className="text-sm font-semibold text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
          {aToken ? 'Admin' : 'Doctor'}
        </span>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Logout"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar