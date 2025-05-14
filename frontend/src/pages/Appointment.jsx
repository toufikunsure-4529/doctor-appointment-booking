import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    userData,
    getDoctorsData,
  } = useContext(AppContext);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  // Fetch doctor info
  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };

  // Generate all slots (booked and available)
  const getAvailableSlots = () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(19, 0, 0, 0); // End at 7 PM

      // Set start time
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      const slotDateStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // Check if slot is booked
        const isSlotBooked = docInfo?.slots_booked?.[slotDateStr]?.includes(formattedTime) || false;

        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
          isBooked: isSlotBooked,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [
        ...prev,
        {
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
          dateStr: slotDateStr,
          slots: timeSlots,
        },
      ]);
    }
  };

  // Book appointment
  const handleBookAppointment = async () => {
    if (!token || !userData?._id) {
      toast.warn("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedTime) {
      toast.warn("Please select a time slot");
      return;
    }

    setIsBooking(true);
    try {
      const slotDate = docSlots[selectedDateIndex].dateStr; // YYYY-MM-DD
      const slotTime = selectedTime;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { userId: userData._id, docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment booked successfully");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="w-3 h-3 mr-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <Link
                  to="/doctors"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  Doctors
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Appointment
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Doctor Profile Card */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <img
                      src={docInfo.image}
                      alt={docInfo.name}
                      className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-4 bg-white p-1 rounded-full shadow">
                      <img
                        src={assets.verified_icon}
                        alt="Verified"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    {docInfo.name}
                  </h2>
                  <p className="text-blue-600 font-medium text-center">
                    {docInfo.speciality}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    <span className="text-gray-700">{docInfo.degree}</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-gray-700">
                      {docInfo.experience} years experience
                    </span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-gray-700">{docInfo.address.line1}</p>
                      <p className="text-gray-700">{docInfo.address.line2}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-2xl font-bold text-green-600">
                      {currencySymbol}
                      {docInfo.fees}
                    </span>
                    <span className="text-gray-500 ml-1">
                      / consultation
                    </span>
                  </div>
                </div>

 insurance                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <img
                      src={assets.info_icon}
                      alt="Info"
                      className="w-5 h-5 mr-2"
                    />
                    About {docInfo.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {docInfo.about}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Book Appointment
                </h2>
                <p className="text-gray-600 mb-6">
                  Select an available time slot for your consultation
                </p>

                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Select Date
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {docSlots.map((day, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedDateIndex(index);
                          setSelectedTime("");
                        }}
                        className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedDateIndex === index
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        <span className="text-sm font-medium">
                          {shortDays[day.date.getDay()]}
                        </span>
                        <span className="text-lg font-bold">
                          {day.date.getDate()}
                        </span>
                        <span className="text-xs">
                          {months[day.date.getMonth()]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Available Time Slots for{" "}
                    {daysOfWeek[docSlots[selectedDateIndex]?.date.getDay()]},{" "}
                    {docSlots[selectedDateIndex]?.date.getDate()}{" "}
                    {months[docSlots[selectedDateIndex]?.date.getMonth()]}
                  </h3>
                  {docSlots[selectedDateIndex]?.slots.length === 0 && (
                    <p className="text-gray-500 text-center">
                      No available slots for this date
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {docSlots[selectedDateIndex]?.slots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => !slot.isBooked && setSelectedTime(slot.time)}
                        disabled={slot.isBooked}
                        className={`py-2 px-4 rounded-md text-center transition-colors ${
                          slot.isBooked
                            ? "bg-gray-200 text-gray-500 opacity-50 cursor-not-allowed"
                            : selectedTime === slot.time
                              ? "bg-blue-600 text-white"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {slot.time.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedTime && (
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Appointment Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {
                            daysOfWeek[
                            docSlots[selectedDateIndex].date.getDay()
                            ]
                          }
                          , {docSlots[selectedDateIndex].date.getDate()}{" "}
                          {months[docSlots[selectedDateIndex].date.getMonth()]}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">
                          {selectedTime.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium">{docInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fee</p>
                        <p className="font-medium text-green-600">
                          {currencySymbol}
                          {docInfo.fees}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedTime || isBooking}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${!selectedTime
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    } flex items-center justify-center`}
                >
                  {isBooking ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </button>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Appointment duration: 30 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;