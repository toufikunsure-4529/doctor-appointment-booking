import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    } else {
      toast.error("Please log in to view dashboard");
    }
  }, [dToken]);

  const handleComplete = async (appointmentId) => {
    try {
      await completeAppointment(appointmentId);
      getDashData(); // Refresh dashboard data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete appointment");
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      getDashData(); // Refresh dashboard data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  if (!dashData) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h2>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Earnings Card */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <h3 className="text-xl font-bold text-gray-900">₹{dashData.earning || 0}</h3>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <h3 className="text-xl font-bold text-gray-900">{dashData.appointments || 0}</h3>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <h3 className="text-xl font-bold text-gray-900">{dashData.patients || 0}</h3>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-800 p-6">Latest Appointments</h3>
        {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
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
                    Amount
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
                {dashData.latestAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.userData?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.slotDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{appointment.amount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                            ? "Cancelled"
                            : "Upcoming"}
                      </span>
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
                              onClick={() => handleComplete(appointment._id)}
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
                              onClick={() => handleCancel(appointment._id)}
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
        ) : (
          <div className="p-6 text-center text-gray-500">No recent appointments.</div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;