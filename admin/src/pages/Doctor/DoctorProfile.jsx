import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, updateProfile } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    fees: "",
    address: { line1: "", line2: "" },
    available: false,
  });

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        fees: profileData.fees || "",
        address: {
          line1: profileData.address?.line1 || "",
          line2: profileData.address?.line2 || "",
        },
        available: profileData.available || false,
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setIsEdit(false);
      getProfileData();
    }
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Profile</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 md:flex">
          {/* Doctor Image */}
          <div className="md:w-1/4 mb-6 md:mb-0 md:pr-6 flex flex-col items-center">
            <img
              src={profileData.image || "https://via.placeholder.com/150"}
              alt="Doctor Profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-gray-800">{profileData.name}</h3>
              <p className="text-gray-600">{profileData.speciality}</p>
              <p className="text-sm text-gray-500 mt-2">{profileData.degree}</p>
            </div>
          </div>

          {/* Doctor Details or Edit Form */}
          <div className="md:w-3/4">
            {isEdit ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
                    <div>
                      <label className="text-sm text-gray-500">Consultation Fee</label>
                      <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Availability</label>
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Address</h4>
                    <div>
                      <label className="text-sm text-gray-500">Address Line 1</label>
                      <input
                        type="text"
                        name="address.line1"
                        value={formData.address.line1}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Address Line 2</label>
                      <input
                        type="text"
                        name="address.line2"
                        value={formData.address.line2}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEdit(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-gray-800">{profileData.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="text-gray-800">
                        {currency}
                        {profileData.fees}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          profileData.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {profileData.available ? "Available" : "Not Available"}
                      </p>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Address</h4>
                    <div>
                      <p className="text-sm text-gray-500">Address Line 1</p>
                      <p className="text-gray-800">{profileData.address?.line1 || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address Line 2</p>
                      <p className="text-gray-800">{profileData.address?.line2 || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">About</h4>
                  <p className="text-gray-800 mt-2">{profileData.about || "No description provided"}</p>
                </div>

                {/* Booked Slots */}
                {profileData.slots_booked && Object.keys(profileData.slots_booked).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Upcoming Booked Slots</h4>
                    <div className="mt-4 space-y-3">
                      {Object.entries(profileData.slots_booked).map(([date, slots]) => (
                        <div key={date} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-700">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {slots.map((slot, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {!isEdit && (
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={() => setIsEdit(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;