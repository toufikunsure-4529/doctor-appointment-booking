import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const MyAppointment = () => {
  const { doctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState(
    doctors.slice(0, 2).map(doctor => ({
      ...doctor,
      status: 'upcoming', // 'upcoming', 'paid', 'cancelled'
      showConfirmCancel: false,
      dateTime: '25, July, 2024 | 8:30PM'
    }))
  );

  const handlePayOnline = (index) => {
    setAppointments(prev => {
      const updated = [...prev];
      updated[index].status = 'paid';
      return updated;
    });
  };

  const handleCancelAppointment = (index) => {
    setAppointments(prev => {
      const updated = [...prev];
      updated[index].showConfirmCancel = true;
      return updated;
    });
  };

  const confirmCancel = (index) => {
    setAppointments(prev => {
      const updated = [...prev];
      updated[index].status = 'cancelled';
      updated[index].showConfirmCancel = false;
      return updated;
    });
  };

  const cancelCancel = (index) => {
    setAppointments(prev => {
      const updated = [...prev];
      updated[index].showConfirmCancel = false;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600 mt-2">View and manage your upcoming appointments</p>
        </div>

        <div className="space-y-6">
          {appointments.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${item.status === 'cancelled' ? 'opacity-70 border-l-4 border-red-500' :
                  item.status === 'paid' ? 'border-l-4 border-green-500' : ''
                }`}
            >
              <div className="p-6 md:flex md:space-x-6">
                {/* Doctor Image */}
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>

                {/* Appointment Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                      <p className="text-blue-600 font-medium">{item.speciality}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'paid' ? 'bg-green-100 text-green-800' :
                          item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {item.status === 'paid' ? 'Paid' :
                          item.status === 'cancelled' ? 'Cancelled' : 'Upcoming'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-start space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-gray-600">Address</p>
                        <p className="text-gray-800">{item.address.line1}</p>
                        <p className="text-gray-800">{item.address.line2}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mt-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-800 font-medium">{item.dateTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {item.status === 'upcoming' && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  {item.showConfirmCancel ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <p className="text-gray-700 mb-2 sm:mb-0">Are you sure you want to cancel this appointment?</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => confirmCancel(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => cancelCancel(index)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                        >
                          No, Keep It
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                      <button
                        onClick={() => handlePayOnline(index)}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        Pay Online
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(index)}
                        className="px-6 py-2 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {item.status === 'paid' && (
                <div className="bg-green-50 px-6 py-4 border-t border-green-200">
                  <div className="flex items-center text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">Payment successful! Your appointment is confirmed.</p>
                  </div>
                </div>
              )}

              {item.status === 'cancelled' && (
                <div className="bg-red-50 px-6 py-4 border-t border-red-200">
                  <div className="flex items-center text-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">Appointment cancelled successfully.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAppointment;