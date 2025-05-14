import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, setToken, userData } = useContext(AppContext)

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
    setToken('');
    localStorage.removeItem(token)
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm z-50 relative">
      <div className="mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
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
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {token && userData ? (
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={ userData.image}
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle Mobile Menu"
          >
            <img
              src={assets.menu_icon}
              alt="Menu Icon"
              className="w-6"
            />
          </button>

          {/* Profile Dropdown Menu */}
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <img src={assets.logo} alt="Clinic Logo" className="w-44" />
          </div>
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none"
            aria-label="Close Mobile Menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-start p-6 gap-6 text-lg font-medium text-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-primary border-l-4 border-primary pl-4"
                  : "hover:text-primary transition-colors duration-200 pl-4"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          {token ? (
            <>
              <NavLink
                to="/my-profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary border-l-4 border-primary pl-4"
                    : "hover:text-primary transition-colors duration-200 pl-4"
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </NavLink>
              <NavLink
                to="/my-appointments"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary border-l-4 border-primary pl-4"
                    : "hover:text-primary transition-colors duration-200 pl-4"
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                My Appointments
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition pl-4"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium w-full text-left pl-4"
            >
              Create Account
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;