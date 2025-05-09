import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 text-gray-700">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
                
                {/* Logo & About */}
                <div>
                    <div className="flex items-center mb-4 space-x-2">
                        <img src={assets.logo} alt="MedBook Logo" className="h-10" />
                        <span className="text-xl font-semibold text-blue-600">MedBook</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        MedBook helps you book doctor appointments effortlessly. Trusted by thousands, we connect patients with the right healthcare providers for timely and quality care.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h4 className="text-base font-semibold mb-4 text-gray-900">Navigation</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                        <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                        <li><Link to="/doctors" className="hover:text-blue-600">Our Doctors</Link></li>
                        <li><Link to="/services" className="hover:text-blue-600">Services</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h4 className="text-base font-semibold mb-4 text-gray-900">Services</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/appointments" className="hover:text-blue-600">Book Appointment</Link></li>
                        <li><Link to="/specialists" className="hover:text-blue-600">Find a Specialist</Link></li>
                        <li><Link to="/consultation" className="hover:text-blue-600">Online Consultation</Link></li>
                        <li><Link to="/faq" className="hover:text-blue-600">FAQs</Link></li>
                    </ul>
                </div>

                {/* Contact & Newsletter */}
                <div>
                    <h4 className="text-base font-semibold mb-4 text-gray-900">Get in Touch</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <i className="fas fa-map-marker-alt text-blue-600 mt-1" />
                            <span>123 Medical Lane, Health City, USA</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-phone text-blue-600" />
                            <span>+1 (212) 456-7890</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-envelope text-blue-600" />
                            <span>support@medbook.com</span>
                        </li>
                    </ul>

                    <div className="mt-5">
                        <h5 className="font-medium mb-2">Subscribe to our Newsletter</h5>
                        <form className="flex">
                            <input
                                type="email"
                                aria-label="Email address"
                                placeholder="Your email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 py-6 px-6 text-sm flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600">© {new Date().getFullYear()} MedBook. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
                    <Link to="/cookies" className="hover:text-blue-600">Cookie Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
