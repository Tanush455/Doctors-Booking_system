import { useNavigate } from "react-router";
import websitelogo from '../assets/logo-website.png';
import { useAdminContext } from "../context/AdminContext";

export const NavBar = () => {
    const { token, setToken } = useAdminContext();
    const navigate = useNavigate();
    // Extract token if it starts with 'Bearer '
    const extractedToken = token?.startsWith("Bearer") ? token.split(" ")[1] : token;

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("authToken");
        navigate('/');
    };

    if (!extractedToken) return null;

    return (
        <nav className="bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left Section - Logo and Admin Text */}
                    <div className="flex items-center space-x-4 hover:transform hover:scale-105 transition duration-300 ">
                        <img 
                            src={websitelogo} 
                            alt="Admin Logo" 
                            className="h-[50px] w-[100px] rounded-full border-4 border-white/20 shadow-md bg-amber-200"
                        />
                        <span className="text-white font-bold text-2xl font-mono tracking-wide">
                            Admin Dashboard
                        </span>
                    </div>

                    {/* Right Section - Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-xl 
                        transition-all duration-300 flex items-center space-x-3 shadow-md
                        hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                        <span className="text-lg font-semibold">Log Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};