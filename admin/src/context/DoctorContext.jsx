import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || null);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
      try {
        const token_decode = JSON.parse(atob(dToken.split(".")[1]));
        setDoctorId(token_decode.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      localStorage.removeItem("dToken");
      setDoctorId(null);
    }
  }, [dToken]);

  const getAppointments = async () => {
    try {
      if (!dToken) {
        toast.error("Please log in to view appointments");
        return;
      }
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { "d-token": dToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId, docId: doctorId },
        { headers: { "d-token": dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error(error.response?.data?.message || "Failed to complete appointment");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId, docId: doctorId },
        { headers: { "d-token": dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const getDashData = async () => {
    try {
      if (!dToken) {
        toast.error("Please log in to view dashboard");
        return;
      }
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { "d-token": dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { "d-token": dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile data");
    }
  };

  const updateProfile = async (profileUpdates) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        profileUpdates,
        { headers: { "d-token": dToken } }
      );
      if (data.success) {
        setProfileData(data.updatedProfile);
        toast.success("Profile updated successfully!");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    doctorId,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    updateProfile,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;