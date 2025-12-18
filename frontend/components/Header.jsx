import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-primary-DEFAULT text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link to="/" className="text-2xl font-bold whitespace-nowrap">Dining Certainty</Link>

        {/* Hamburger menu button for small screens */}
        <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>

        {/* Navigation for large screens */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <Link to="/restaurants" className="hover:text-primary-100 transition duration-300">Restaurants</Link>
            </li>
            {user && user.token ? (
              <>
                <li>
                  <Link to="/bookings" className="hover:text-primary-100 transition duration-300">My Bookings</Link>
                </li>
                {user.user.role === 'admin' && (
                  <li>
                    <Link to="/admin/dashboard" className="hover:text-primary-100 transition duration-300">Admin Dashboard</Link>
                  </li>
                )}
                <li>
                  <button onClick={logout} className="hover:text-primary-100 transition duration-300">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary-100 transition duration-300">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-primary-100 transition duration-300">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile navigation menu */}
        {isOpen && (
          <nav className="md:hidden absolute top-full left-0 w-full bg-primary-DEFAULT shadow-lg py-2 z-10">
            <ul className="flex flex-col items-center space-y-2">
              <li>
                <Link to="/restaurants" onClick={toggleMenu} className="block w-full text-center py-2 hover:bg-primary-600 transition duration-300">Restaurants</Link>
              </li>
              {user && user.token ? (
                <>
                  <li>
                    <Link to="/bookings" onClick={toggleMenu} className="block w-full text-center py-2 hover:bg-primary-600 transition duration-300">My Bookings</Link>
                  </li>
                  {user.user.role === 'admin' && (
                    <li>
                      <Link to="/admin/dashboard" onClick={toggleMenu} className="block w-full text-center py-2 hover:bg-primary-600 transition duration-300">Admin Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={() => { logout(); toggleMenu(); }} className="block w-full text-center py-2 hover:bg-primary-600 transition duration-300">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={toggleMenu} className="block w-full text-center py-2 hover:bg-primary-600 transition duration-300">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={toggleMenu} className="block w-full text-center py-2 hover:bg-primary-600 transition duration-300">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
