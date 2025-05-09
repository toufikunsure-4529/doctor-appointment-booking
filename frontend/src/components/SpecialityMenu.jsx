import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div className='bg-gray-50 py-20 px-4 sm:px-6 lg:px-8' id='speciality'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>Find by Speciality</h2>
                    <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
                        Browse our network of trusted specialists and book appointments with ease.
                    </p>
                </div>
                
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
                    {specialityData.map((item, index) => (
                        <Link 
                            onClick={() => scrollTo(0, 0)} 
                            to={`/doctors/${item.speciality}`} 
                            key={index} 
                            className='group bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300 hover:border-blue-500 border border-transparent'
                        >
                            <div className='mb-4 p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300'>
                                <img 
                                    className='w-12 h-12 object-contain' 
                                    src={item.image} 
                                    alt={item.speciality} 
                                />
                            </div>
                            <h3 className='text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300'>
                                {item.speciality}
                            </h3>
                        </Link>
                    ))}
                </div>
                
                <div className='mt-12 text-center'>
                    <Link 
                        to="/doctors" 
                        className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300'
                    >
                        View All Specialities
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SpecialityMenu