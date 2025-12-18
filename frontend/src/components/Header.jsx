import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-2xl sticky top-0 z-50 glow transition-colors duration-300 dark:border-b-4 dark:border-orange-500">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="text-3xl float">🍽️</div>
          <span className="text-3xl font-black bg-gradient-to-r from-yellow-200 to-white dark:from-yellow-300 dark:to-orange-200 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">Dining Certainty</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 text-orange-600 dark:text-yellow-400 hover:scale-110 transition-all duration-300 shadow-lg btn-hover"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white text-2xl hover:scale-125 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/restaurants" className="relative group text-white font-semibold hover:text-yellow-200 transition-colors duration-300">
                🏪 Restaurants
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            {user && user.token ? (
              <>
                <li>
                  <Link to="/bookings" className="relative group text-white font-semibold hover:text-yellow-200 transition-colors duration-300">
                    📅 My Bookings
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                {user.user.role === 'admin' && (
                  <li>
                    <Link to="/admin/dashboard" className="relative group text-white font-semibold hover:text-yellow-200 transition-colors duration-300">
                      ⚙️ Admin
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg btn-hover">
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg btn-hover">
                    🔐 Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg btn-hover">
                    ✨ Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-orange-600 dark:bg-gray-800 p-4 slide-in-down transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 text-orange-600 dark:text-yellow-400 hover:scale-110 transition-all duration-300"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <ul className="space-y-3">
            <li>
              <Link to="/restaurants" className="text-white font-semibold hover:text-yellow-200">🏪 Restaurants</Link>
            </li>
            {user && user.token ? (
              <>
                <li>
                  <Link to="/bookings" className="text-white font-semibold hover:text-yellow-200">📅 My Bookings</Link>
                </li>
                {user.user.role === 'admin' && (
                  <li>
                    <Link to="/admin/dashboard" className="text-white font-semibold hover:text-yellow-200">⚙️ Admin</Link>
                  </li>
                )}
                <li>
                  <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="w-full block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full text-center">
                    🔐 Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="w-full block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-center">
                    ✨ Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
