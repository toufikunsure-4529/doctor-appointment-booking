import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAtoken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
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

  const value = {
    aToken,
    setAtoken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailablityContext,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;