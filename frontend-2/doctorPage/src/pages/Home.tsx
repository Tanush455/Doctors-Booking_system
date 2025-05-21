import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">MediCare Portal</span>
            <Link 
              to="/login" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to Healthcare Management System
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Secure portal for medical professionals and administrators to manage patient care, 
            records, and healthcare operations efficiently.
          </p>

          {/* Login Button for Mobile Emphasis */}
          <div className="mt-12">
            <Link 
              to="/login" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started - Professional Login
            </Link>
          </div>

          {/* Security Badge */}
          <div className="mt-16 flex items-center justify-center space-x-2 text-gray-500">
            <svg 
              className="w-6 h-6 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
            <span className="text-sm">HIPAA Compliant & AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}