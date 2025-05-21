// SideBar.tsx
import { NavLink } from "react-router-dom";
import websitelogo from '../assets/logo-website.png';
import { useAdminContext } from "../context/AdminContext";

export default function SideBar() {
  const { token } = useAdminContext();
  if (!token) return null;

  return (
    <div className="h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-500/30">
        <div className="flex items-center space-x-3">
          <img
            src={websitelogo}
            alt="Admin Logo"
            className="h-10 w-10 rounded-full border-2 border-white/20"
          />
          <span className="text-white font-bold text-xl font-mono">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 mt-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin/content/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive ?
                  'bg-blue-500/30 text-white border-l-4 border-blue-300' :
                  'text-blue-100 hover:bg-blue-700/30 hover:translate-x-2'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/content/appointments"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive ?
                  'bg-blue-500/30 text-white border-l-4 border-blue-300' :
                  'text-blue-100 hover:bg-blue-700/30 hover:translate-x-2'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Appointments</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/content/doctor-list"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive ?
                  'bg-blue-500/30 text-white border-l-4 border-blue-300' :
                  'text-blue-100 hover:bg-blue-700/30 hover:translate-x-2'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Doctor List</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/content/add-doctor"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive ?
                  'bg-blue-500/30 text-white border-l-4 border-blue-300' :
                  'text-blue-100 hover:bg-blue-700/30 hover:translate-x-2'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Add Doctor</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/content/addCaptha"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive ?
                  'bg-blue-500/30 text-white border-l-4 border-blue-300' :
                  'text-blue-100 hover:bg-blue-700/30 hover:translate-x-2'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add Captcha</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/content/chat"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive ?
                  'bg-blue-500/30 text-white border-l-4 border-blue-300' :
                  'text-blue-100 hover:bg-blue-700/30 hover:translate-x-2'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Message</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
