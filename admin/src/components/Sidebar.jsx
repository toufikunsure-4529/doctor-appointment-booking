import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import assets from '../assets/assets'
import { Menu, X } from 'lucide-react'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { to: '/admin-dasboard', label: 'Dashboard', icon: assets.home_icon },
    { to: '/all-appointments', label: 'Appointments', icon: assets.appointment_icon },
    { to: '/add-doctor', label: 'Add Doctor', icon: assets.add_icon },
    { to: '/doctor-list', label: 'Doctors List', icon: assets.people_icon },
  ]

  if (!aToken) return null

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
      </button>

      <aside
        className={`w-64 min-h-screen bg-white shadow-lg border-r border-gray-200 fixed top-0 left-0 h-full z-20 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium
                    ${isActive ? 'bg-blue-50 text-blue-600 font-semibold border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-100'}`
                  }
                >
                  <img src={item.icon} alt={`${item.label} icon`} className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="p-4 text-sm text-gray-400 border-t border-gray-200">
            © 2025 Admin Dashboard
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}

export default Sidebar