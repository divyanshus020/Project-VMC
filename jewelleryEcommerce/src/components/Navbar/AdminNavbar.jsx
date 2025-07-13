import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate('/admin/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/enquiry', label: 'Enquiry', icon: '📧' },
    { to: '/admin/add-product', label: 'Add Product', icon: '➕' },
    { to: '/admin/admins', label: 'Admins', icon: '👨‍💼' },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 text-gray-800 shadow-lg border-b border-blue-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand - Left aligned */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md transform hover:scale-105 transition-all duration-300">
                <span className="text-xl font-bold text-white">💎</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                    isActiveLink(link.to)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-blue-100'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActiveLink(link.to) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></div>
                  )}
                </Link>
              ))}
              
              <div className="ml-4 pl-4 border-l border-gray-300">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-red-200 flex items-center space-x-2 text-white"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all duration-300 transform hover:scale-105"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 text-gray-700 ${menuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            menuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-2 border border-blue-200 shadow-lg">
              {navLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isActiveLink(link.to)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-blue-100'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-blue-200">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <span className="text-xl">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-pulse-once border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Confirm Logout
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to logout? You will need to sign in again to access the admin portal.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-once {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-pulse-once {
          animation: pulse-once 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default AdminNavbar;