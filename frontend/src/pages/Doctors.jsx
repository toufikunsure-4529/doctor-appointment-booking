import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  const specialties = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Gastroenterologist',
  ];

  const applyFilter = () => {
    if (!doctors || !Array.isArray(doctors)) {
      setFilterDoc([]);
      return;
    }

    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (doc) =>
            doc.speciality &&
            doc.speciality.toLowerCase() === speciality.toLowerCase()
        )
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <p className="text-gray-600 mb-5">
        Browse through the doctors specialist.
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
          {specialties.map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality && spec.toLowerCase() === speciality.toLowerCase()
                  ? navigate('/doctors')
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-64 pl-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all duration-200 cursor-pointer select-none ${
                speciality && spec.toLowerCase() === speciality.toLowerCase()
                  ? 'bg-indigo-100 text-black'
                  : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-6 pt-5 gap-y-6 px-3 sm:px-3">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 ${
                  item.available
                    ? 'hover:shadow-lg hover:-translate-y-2 cursor-pointer'
                    : 'grayscale opacity-80'
                }`}
                onClick={
                  item.available
                    ? () => {
                        navigate(`/appointment/${item._id}`);
                        window.scrollTo(0, 0);
                      }
                    : undefined
                }
              >
                <div className="relative pb-48 overflow-hidden">
                  <img
                    className="absolute inset-0 w-full h-full object-cover bg-blue-50"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${
                          item.available ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <p className="text-xs text-gray-500">
                        {item.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.speciality}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{item.fees}
                    </span>
                    <button
                      className={`text-sm font-medium ${
                        item.available
                          ? 'text-blue-600 hover:text-blue-800'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item.available}
                    >
                      {item.available ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No doctors found for this specialty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;