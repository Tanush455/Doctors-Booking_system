import { NavBar } from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      {/* Navbar at the top - first row */}
      <div className="row-start-1">
        <NavBar />
      </div>

      {/* Main content area - second row */}
      <div className="grid grid-cols-[auto_1fr] row-start-2 h-full">
        {/* Sidebar - full height */}
        <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 shadow-xl">
          <SideBar />
        </div>

        {/* Main content outlet */}
        <div className="p-8 bg-gray-50 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}