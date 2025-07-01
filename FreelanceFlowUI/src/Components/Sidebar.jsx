import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiCheckSquare,
  FiFileText,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const [isMasterOpen, setIsMasterOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isOpen);

  return (
    <div
      className={`h-full bg-[#F1F5F9] shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? "w-64" : "w-15"
      }`}
    >
      {/* Header + Toggle */}
      <div className="p-4 border-b border-gray-300 flex justify-between items-center">
        <h2
          className={`text-xl text-[#0F172A] font-bold transition-all duration-200 ${
            !isOpen && "hidden"
          }`}
        >
          Freelance Flow
        </h2>
        <button onClick={toggleSidebar} className="text-xl">
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-4 text-gray-700">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-md transition ${
              isActive
                ? "bg-[#4F46E5] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <FiHome />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-md transition ${
              isActive
                ? "bg-[#4F46E5] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <FiUsers />
          {isOpen && <span>Clients</span>}
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-md transition ${
              isActive
                ? "bg-[#4F46E5] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <FiCheckSquare />
          {isOpen && <span>Tasks</span>}
        </NavLink>
        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2 rounded-md transition ${
              isActive
                ? "bg-[#4F46E5] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <FiFileText />

          {isOpen && <span>Invoices</span>}
        </NavLink>

        {/* Masters Dropdown */}
        <div>
          <button
            onClick={() => setIsMasterOpen(!isMasterOpen)}
            className="w-full flex justify-between items-center hover:text-blue-600"
          >
            <span className="flex items-center space-x-2">
              <FiSettings />
              {isOpen && <span>Masters</span>}
            </span>
            {isOpen && (isMasterOpen ? <FiChevronDown /> : <FiChevronRight />)}
          </button>

          {isOpen && isMasterOpen && (
            <div className="ml-6 mt-2 space-y-2">
              <NavLink
                to="/masters/project-types"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md transition ${
                    isActive
                      ? "bg-[#4F46E5] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                Project Types
              </NavLink>
              <NavLink
                to="/masters/task-statuses"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md transition ${
                    isActive
                      ? "bg-[#4F46E5] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                Task Statuses
              </NavLink>
              <NavLink
                to="/masters/categories"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md transition ${
                    isActive
                      ? "bg-[#4F46E5] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                Categories
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
