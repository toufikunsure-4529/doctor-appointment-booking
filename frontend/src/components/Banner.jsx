import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
    return (
        <div className=' flex bg-primary rounded-lg px-6 sm:px-10 lg:px-12 my-20 md:mx-10'>
            {/* Left Side */}
            <div className='flex-1 sm:py-10 py-8 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg-text-5xl font-semibold text-white'>
                    <p>Book Appointment </p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                <button onClick={() => { navigate("/login"); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base to-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Create Account </button>

            </div>

            {/* Right Side */}
            <div className=' hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img src={assets.appointment_img} alt="appointment_img" className='w-full absolute max-w-md bottom-0 right-0' />
            </div>
        </div>
    )
}

export default Banner