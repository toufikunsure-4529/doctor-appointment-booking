import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } =
    useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    } else {
      toast.error("Please log in to view appointments");
    }
  }, [dToken]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Appointments</h2>
      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-600 text-lg">No appointments scheduled yet.</p>
          <p className="text-gray-500">When patients book appointments, they'll appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.reverse().map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={appointment.userData.image || "https://via.placeholder.com/150"}
                            alt={appointment.userData.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.userData.name}</div>
                          <div className="text-sm text-gray-500">
                            {appointment.userData.gender}, {appointment.userData.dob}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(appointment.slotDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{appointment.amount || 0}</div>
                      <div className="text-sm text-gray-500">{appointment.docData.speciality}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="flex flex-col space-y-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full text-center ${appointment.payment ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {appointment.payment ? "Paid" : "Payment Pending"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full text-center ${appointment.isCompleted
                            ? "bg-blue-100 text-blue-800"
                            : appointment.cancelled
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                            }`}
                        >
                          {appointment.isCompleted
                            ? "Completed"
                            : appointment.cancelled
                              ? "Appointment Cancelled"
                              : "Upcoming"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toast.info("View details functionality coming soon!")}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        {!appointment.isCompleted && !appointment.cancelled && (
                          <>
                            <button
                              onClick={() => completeAppointment(appointment._id)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                              title="Confirm Appointment"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => cancelAppointment(appointment._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Cancel Appointment"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;