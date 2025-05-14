import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContect'

const AllAppointments = () => {
  const { getAllAppointments, appointments, aToken, cancelAppointment } = useContext(AdminContext)
  const { calculateAge } = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    } else {
      console.log('no token')
    }
  }, [aToken])


  const getStatusBadge = (cancelled, isCompleted) => {
    if (cancelled) {
      return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Cancelled</span>;
    }
    if (isCompleted) {
      return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Completed</span>;
    }
    return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Upcoming</span>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Appointments</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Patient</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Date & Time</th>
              <th scope="col" className="px-6 py-3">Doctor</th>
              <th scope="col" className="px-6 py-3">Speciality</th>
              <th scope="col" className="px-6 py-3">Fees</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={appointment.userData.image}
                      alt={appointment.userData.name}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{appointment.userData.name}</div>
                      <div className="text-gray-500 text-xs">{appointment.userData.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{calculateAge(appointment.userData.dob)}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{appointment.slotDate}</div>
                  <div className="text-gray-500">{appointment.slotTime}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={appointment.docData.image}
                      alt={appointment.docData.name}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{appointment.docData.name}</div>
                      <div className="text-gray-500 text-xs">{appointment.docData.degree}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{appointment.docData.speciality}</td>
                <td className="px-6 py-4">₹{appointment.amount}</td>
                <td className="px-6 py-4">
                  {getStatusBadge(appointment.cancelled, appointment.isCompleted)}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="font-medium text-blue-600 hover:underline mr-3"
                    onClick={() => {/* View details action */ }}
                  >
                    View
                  </button>
                  {!appointment.cancelled && !appointment.isCompleted && (
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => { cancelAppointment(appointment._id) }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllAppointments