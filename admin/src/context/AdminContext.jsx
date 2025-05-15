import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAtoken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        {
          headers: {
            atoken: aToken,
          },
        }
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailablityContext = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availablity`,
        { docId }, // Ensure docId is sent as { docId: string }
        { headers: { atoken: aToken } } // Consistent header key
      );
      if (data.success) {
        toast.success(data.message);
        await getAllDoctors(); // Refresh doctors list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
      if (data.success) {
        setAppointments(data.appointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {

    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);

    }
  }


  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);

    }
  }


  const value = {
    aToken,
    setAtoken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailablityContext,
    getAllAppointments,
    setAppointments,
    appointments,
    cancelAppointment,
    dashData, getDashData

  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;