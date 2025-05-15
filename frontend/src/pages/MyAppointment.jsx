import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  // Initialize Razorpay payment
  const initPay = (order, appointmentId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment",
      description: `Payment for Appointment #${order.receipt}`,
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-payment`,
            {
              appointmentId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
          if (data.success) {
            toast.success("Payment successful!");
            await fetchAppointments();
            await getDoctorsData();
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Payment verification error");
        }
      },
      theme: { color: "#1a73e8" },
      modal: {
        ondismiss: () => toast.info("Payment window closed"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      toast.error(response.error.description || "Payment failed");
    });
    rzp.open();
  };

  // Handle online payment
  const handlePayOnline = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order, appointmentId);
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment initiation error");
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointments`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Appointment cancelled successfully");
        await fetchAppointments();
        await getDoctorsData();
      } else {
        toast.error(data.message || "Cancellation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling appointment");
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return moment(timestamp).format("MMMM Do YYYY, h:mm a");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Determine appointment status and styling
  const getAppointmentStatus = (appointment) => {
    if (appointment.isCompleted) {
      return {
        label: "Completed",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-500",
      };
    }
    if (appointment.cancelled) {
      return {
        label: "Cancelled",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-500",
      };
    }
    if (appointment.payment) {
      return {
        label: "Confirmed",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-500",
      };
    }
    return {
      label: "Pending Payment",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-500",
    };
  };

  // Render action buttons or status message
  const renderAppointmentActions = (appointment) => {
    const { isCompleted, cancelled, payment, _id } = appointment;

    if (isCompleted) {
      return (
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
          <div className="flex items-center text-blue-800">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">Appointment completed.</p>
          </div>
        </div>
      );
    }

    if (cancelled) {
      return (
        <div className="bg-red-50 px-6 py-4 border-t border-red-200">
          <div className="flex items-center text-red-800">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">Appointment cancelled.</p>
          </div>
        </div>
      );
    }

    if (payment) {
      return (
        <div className="bg-green-50 px-6 py-4 border-t border-green-200">
          <div className="flex items-center text-green-800">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">Payment successful! Appointment confirmed.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
        <button
          onClick={() => handlePayOnline(_id)}
          className="flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          Pay Online
        </button>
        <button
          onClick={() => handleCancelAppointment(_id)}
          className="flex items-center justify-center px-6 py-2 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Cancel Appointment
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your scheduled appointments</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments</h3>
            <p className="mt-1 text-gray-500">You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => {
              const status = getAppointmentStatus(appointment);

              return (
                <div
                  key={appointment._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${status.borderColor}`}
                >
                  <div className="p-6 md:flex md:space-x-6">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                      <img
                        src={appointment.docData.image}
                        alt={appointment.docData.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {appointment.docData.name}
                          </h2>
                          <p className="text-blue-600 font-medium">{appointment.docData.speciality}</p>
                          <p className="text-gray-600 text-sm">{appointment.docData.degree}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <svg
                            className="h-5 w-5 text-gray-500 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">
                              {appointment.docData.address.line1}, {appointment.docData.address.line2}
                            </p>
                            <p className="text-gray-600 text-sm">Doctor's Address</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <svg
                            className="h-5 w-5 text-gray-500 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">
                              {moment(appointment.slotDate).format("MMMM Do YYYY")} at{" "}
                              {appointment.slotTime}
                            </p>
                            <p className="text-gray-600 text-sm">Appointment Time</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <svg
                            className="h-5 w-5 text-gray-500 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">{formatCurrency(appointment.amount)}</p>
                            <p className="text-gray-600 text-sm">Consultation Fee</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <svg
                            className="h-5 w-5 text-gray-500 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-gray-800 font-medium">
                              Booked on {formatDate(appointment.date)}
                            </p>
                            <p className="text-gray-600 text-sm">Booking Date</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons or Status */}
                  {renderAppointmentActions(appointment)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;