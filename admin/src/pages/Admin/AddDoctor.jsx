import React, { useContext, useRef, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import assets from '../../assets/assets';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    experience: '1 year',
    fees: '',
    speciality: 'General physician',
    degree: '',
    address1: '',
    address2: '',
    about: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const { backendUrl, aToken } = useContext(AdminContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.speciality ||
      !formData.degree ||
      !formData.experience ||
      !formData.about ||
      !formData.fees ||
      !formData.address1 || // At least address1 is required
      !selectedFile
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    // Combine address1 and address2 into a JSON string
    const address = JSON.stringify({
      line1: formData.address1,
      line2: formData.address2 || '', // address2 is optional
    });

    // Prepare FormData for API request
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    submissionData.append('experience', formData.experience);
    submissionData.append('fees', formData.fees);
    submissionData.append('speciality', formData.speciality);
    submissionData.append('degree', formData.degree);
    submissionData.append('about', formData.about);
    submissionData.append('address', address);
    submissionData.append('image', selectedFile);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        submissionData,
        {
          headers: {
            aToken,
            'Content-Type': 'multipart/form-data',
          },
        }
      );


      if (data.success) {
        toast.success(data.message);
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          experience: '1 year',
          fees: '',
          speciality: 'General physician',
          degree: '',
          address1: '',
          address2: '',
          about: '',
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Upload Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div
              onClick={triggerFileInput}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64 w-full hover:bg-gray-50 transition relative"
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="text-white font-medium">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={assets.upload_area}
                    alt="Upload area"
                    className="w-24 h-24 object-contain mb-3"
                  />
                  <p className="text-center text-gray-600">
                    Upload Doctor <br /> Picture
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              id="doc-img"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <div className="mt-2 w-full text-center">
              {selectedFile ? (
                <p className="text-sm text-gray-700 truncate">{selectedFile.name}</p>
              ) : (
                <p className="text-sm text-gray-500">JPEG, PNG (Max 2MB)</p>
              )}
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={`${i + 1} year`}>{i + 1} Year</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  placeholder="Fees"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="Degree"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="space-y-2">
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  placeholder="Address Line 1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  placeholder="Address Line 2 (Optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Doctor</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Write about the doctor"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;