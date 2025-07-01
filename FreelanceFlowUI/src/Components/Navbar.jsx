import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { setCurrentUser, setIsAuthnticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthnticated(null);
    navigate("/login");
  };

  // Extract the last segment of the pathname for the page title
  const getPageTitle = (pathname) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    return segments[segments.length - 1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center relative z-30">
      {/* Page title on the left */}
      <h1 className="text-lg font-semibold capitalize">{pageTitle}</h1>

      {/* Profile icon on the right */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
        >
          <FiUser className="text-xl" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border-gray-600 rounded-md shadow-lg py-2 text-sm z-50">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
