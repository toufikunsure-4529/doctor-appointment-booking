import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 md:ml-64 transition-all duration-300">
          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<></>} />
            <Route path="/admin-dasboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllApointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorsList />} />
            {/* Doctor Routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />

          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App