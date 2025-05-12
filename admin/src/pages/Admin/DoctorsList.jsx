import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Plus, Edit, Trash2, UserX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailablityContext } = useContext(AdminContext);
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aToken) {
      setLoading(true);
      getAllDoctors().finally(() => setLoading(false));
    }
  }, [aToken]);

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleAvailabilityChange = async () => {
    if (selectedDoctor) {
      setLoading(true);
      try {
        await changeAvailablityContext(selectedDoctor._id);
      } finally {
        setLoading(false);
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Doctors Directory
        </h1>
        <button
          onClick={() => navigate("/add-doctor")}
          className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      )}

      {/* Doctors Grid */}
      {!loading && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-indigo-600 text-sm font-medium mt-1">
                      {doctor.speciality}
                    </p>
                    <div className="mt-3 flex items-center">
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full mr-2 ${doctor.available ? "bg-green-100" : "bg-gray-200"
                          }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${doctor.available ? "bg-green-500" : "bg-gray-500"
                            }`}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-medium ${doctor.available ? "text-green-600" : "text-gray-600"
                          }`}
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500 font-medium">
                    <p>ID: {doctor._id}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditClick(doctor)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-150"
                      title="Edit Doctor"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150"
                      title="Delete Doctor"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && doctors.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <UserX size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            No Doctors Registered
          </h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            Start by adding new doctors to populate the directory.
          </p>
          <button
            onClick={() => navigate("/add-doctor")}
            className="mt-6 inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all duration-200"
          >
            <Plus size={18} className="mr-2" />
            Add Your First Doctor
          </button>
        </div>
      )}

      {/* Doctor Details Modal */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Doctor Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 flex flex-col items-center">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                  />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mt-1">
                    {selectedDoctor.speciality}
                  </p>
                  <div className="mt-3 flex items-center">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${selectedDoctor.available ? "bg-green-100" : "bg-gray-200"
                        }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${selectedDoctor.available ? "bg-green-500" : "bg-gray-500"
                          }`}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${selectedDoctor.available ? "text-green-600" : "text-gray-600"
                        }`}
                    >
                      {selectedDoctor.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-gray-900">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Degree</h4>
                      <p className="mt-1 text-gray-900">{selectedDoctor.degree}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                      <p className="mt-1 text-gray-900">{selectedDoctor.experience}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Consultation Fee</h4>
                      <p className="mt-1 text-gray-900">${selectedDoctor.fees}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p className="mt-1 text-gray-900">
                      {selectedDoctor.address?.line1}
                      <br />
                      {selectedDoctor.address?.line2}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">About</h4>
                    <p className="mt-1 text-gray-900">{selectedDoctor.about}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500 font-medium">
                  <p>ID: {selectedDoctor._id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selectedDoctor.available}
                        onChange={handleAvailabilityChange}
                        disabled={loading}
                      />
                      <div
                        className={`block w-14 h-8 rounded-full ${selectedDoctor.available ? "bg-indigo-600" : "bg-gray-300"
                          }`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${selectedDoctor.available ? "transform translate-x-6" : ""
                          }`}
                      ></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                      {selectedDoctor.available ? "Available" : "Unavailable"}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;