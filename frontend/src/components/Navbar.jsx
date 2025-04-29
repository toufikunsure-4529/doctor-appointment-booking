import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Replace this with real authentication logic (e.g., from context or redux)
  const [token, setToken] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "All Doctors", to: "/doctors" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add actual logout logic here
    setToken(false);
    setDropdownOpen(false);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm z-50 relative">
      <div className=" mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img src={assets.logo} alt="Clinic Logo" className="w-44" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 font-medium text-sm text-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "hover:text-primary transition-colors duration-200 pb-1"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Profile / Auth */}
        <div className="relative" ref={dropdownRef}>
          {token ? (
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={assets.profile_pic}
                alt="User Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src={assets.dropdown_icon}
                alt="Toggle Dropdown"
                className="w-2.5"
              />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hidden md:block hover:bg-primary/90 transition"
            >
              Create Account
            </button>
          )}

          {/* Dropdown Menu */}
          {dropdownOpen && token && (
            <div className="absolute right-0 top-12 flex flex-col gap-2 bg-white border border-gray-200 shadow-lg rounded-md p-4 min-w-[160px] z-40">
              <button
                onClick={() => {
                  navigate("/my-profile");
                  setDropdownOpen(false);
                }}
                className="text-sm text-gray-700 hover:text-black transition text-left"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/my-appointments");
                  setDropdownOpen(false);
                }}
                className="text-sm text-gray-700 hover:text-black transition text-left"
              >
                My Appointments
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 transition text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
