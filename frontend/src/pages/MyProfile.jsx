import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets_frontend/assets';

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    image: assets.profile_pic,
    email: "john@info.com",
    phone: "+91 1234568780",
    address: {
      line1: "123 Medical Lane,",
      line2: "Health City, USA",
    },
    gender: "male",
    dob: "2000-01-01"
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);

  // Function to check if today is the user's birthday
  const checkBirthday = () => {
    const today = new Date();
    const dob = new Date(userData.dob);
    if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {
      setIsBirthday(true);
    } else {
      setIsBirthday(false);
    }
  };

  useEffect(() => {
    checkBirthday();
  }, [userData.dob]);

  const handleAddressChange = (e, field) => {
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: e.target.value
      }
    }));
  };

  const handleGenderChange = (e) => {
    setUserData(prev => ({
      ...prev,
      gender: e.target.value
    }));
  };

  const handleDobChange = (e) => {
    setUserData(prev => ({
      ...prev,
      dob: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img 
                  src={userData.image} 
                  alt={userData.name} 
                  className="w-24 h-24 rounded-full border-4 border-white border-opacity-80 object-cover shadow-md"
                />
                {isBirthday && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-lg animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {isEdit ? 
                  <input 
                    type="text" 
                    value={userData.name} 
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                    className="text-2xl font-bold bg-white bg-opacity-20 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-white"
                  /> 
                  : 
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                }
                <p className="text-blue-100 mt-1">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {/* Birthday Banner */}
            {isBirthday && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-800">Happy Birthday, {userData.name}!</span>
                </div>
                <span className="text-gray-700">🎉</span>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  {isEdit ? 
                    <select 
                      value={userData.gender} 
                      onChange={handleGenderChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select> 
                    : 
                    <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{userData.gender}</p>
                  }
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  {isEdit ? 
                    <input 
                      type="date" 
                      value={userData.dob} 
                      onChange={handleDobChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    /> 
                    : 
                    <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{userData.dob}</p>
                  }
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  {isEdit ? 
                    <input 
                      type="text" 
                      value={userData.phone} 
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    /> 
                    : 
                    <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{userData.phone}</p>
                  }
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Address
              </h3>

              {isEdit ? 
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1</label>
                    <input 
                      type="text" 
                      value={userData.address.line1} 
                      onChange={(e) => handleAddressChange(e, 'line1')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Street address, P.O. box"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                    <input 
                      type="text" 
                      value={userData.address.line2} 
                      onChange={(e) => handleAddressChange(e, 'line2')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>
                </div>
                : 
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{userData.address.line1}</p>
                  <p className="text-gray-800">{userData.address.line2}</p>
                </div>
              }
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <button 
                onClick={() => setIsEdit(prev => !prev)} 
                className={`px-6 py-3 rounded-lg font-medium transition-all ${isEdit 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
              >
                {isEdit ? (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;