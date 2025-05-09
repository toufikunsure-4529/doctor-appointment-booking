import React from 'react';
import { assets } from "../assets/assets_frontend/assets";

const Header = () => {
    return (
        <header className="bg-white py-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                
                {/* Left Column */}
                <div className="space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                        Find & Book Appointments <br />
                        With <span className="text-primary">Trusted Doctors</span>
                    </h1>

                    <p className="text-gray-600 text-base leading-relaxed">
                        Schedule consultations with top-rated healthcare professionals across specialties.
                        Seamless online booking. Trusted by thousands of patients.
                    </p>

                    <div className="flex items-center gap-4">
                        <img
                            src={assets.group_profiles}
                            alt="group_profiles"
                            className="w-24"
                            loading="lazy"
                        />
                        <span className="text-sm text-gray-500">
                            10K+ satisfied users and growing
                        </span>
                    </div>

                    <a
                        href="#speciality"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium shadow hover:bg-primary/90 transition-all duration-300"
                    >
                        Book Appointment
                        <img src={assets.arrow_icon} alt="arrow_icon" className="w-4" />
                    </a>
                </div>

                {/* Right Column */}
                <div className="relative">
                    <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                        <img
                            src={assets.header_img}
                            alt="header doctor"
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />
                    </div>
                    {/* Optional soft background shape */}
                    <div className="absolute -top-6 -right-6 w-full h-full bg-primary/10 rounded-3xl -z-10" />
                </div>
            </div>
        </header>
    );
};

export default Header;
