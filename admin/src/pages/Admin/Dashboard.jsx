import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'

const Dashboard = () => {
  const { cancelAppointment, dashData, getDashData, aToken } = useContext(AdminContext)
  
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Doctors</h3>
          <p className="text-3xl font-bold text-blue-600">{dashData.doctors}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Patients</h3>
          <p className="text-3xl font-bold text-green-600">{dashData.patients}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Appointments</h3>
          <p className="text-3xl font-bold text-purple-600">{dashData.appointments}</p>
        </div>
      </div>
      
      {/* Latest Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
        
        {dashData.latestAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashData.latestAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={appointment.userData.image} alt={appointment.userData.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.userData.name}</div>
                          <div className="text-sm text-gray-500">{appointment.userData.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={appointment.docData.image} alt={appointment.docData.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.docData.name}</div>
                          <div className="text-sm text-gray-500">{appointment.docData.speciality}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.slotDate}</div>
                      <div className="text-sm text-gray-500">{appointment.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{appointment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.cancelled ? 'bg-red-100 text-red-800' : 
                          appointment.isCompleted ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.cancelled ? 'Cancelled' : 
                         appointment.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent appointments found</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard