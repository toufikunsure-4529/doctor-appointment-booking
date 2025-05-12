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

const App = () => {
  const { aToken } = useContext(AdminContext)

  return aToken ? (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 md:ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/admin-dasboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllApointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorsList />} />
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