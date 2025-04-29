import React from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-700">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section - About */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img src={assets.logo} alt="logo" className="h-10" />
                            <span className="text-xl font-semibold text-blue-600">MedBook</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            MedBook is your trusted partner for seamless doctor appointments.
                            We connect patients with healthcare providers effortlessly,
                            ensuring you get the care you need when you need it.
                        </p>
                 
                    </div>

                    {/* Center Section - Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">COMPANY</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="#" className="hover:text-blue-600 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-600 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-600 transition-colors">Our Doctors</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-600 transition-colors">Services</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section - Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">GET IN TOUCH</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start space-x-2">
                                <i className="fas fa-map-marker-alt mt-1 text-blue-600"></i>
                                <span>123 Medical Drive, Health City, HC 12345</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <i className="fas fa-phone-alt text-blue-600"></i>
                                <span>+1-212-456-7890</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <i className="fas fa-envelope text-blue-600"></i>
                                <span>support@medbook.com</span>
                            </li>
                        </ul>
                        <div className="pt-2">
                            <h4 className="font-medium mb-2">Newsletter</h4>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                                />
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>Copyright © {new Date().getFullYear()} MedBook - All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-blue-600">Terms of Service</Link>
                        <Link to="#" className="hover:text-blue-600">Privacy Policy</Link>
                        <Link to="#" className="hover:text-blue-600">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;