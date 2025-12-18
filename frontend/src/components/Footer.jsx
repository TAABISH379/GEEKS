import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white mt-16 border-t-4 border-orange-500 dark:border-orange-400 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 justify-center md:justify-start mb-4">
              <div className="text-3xl">🍽️</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Dining Certainty</span>
            </div>
            <p className="text-gray-400 text-sm">Your Zero-Waiting Restaurant Reservation System</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-400">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors duration-300">🏠 Home</Link></li>
              <li><Link to="/restaurants" className="hover:text-orange-400 transition-colors duration-300">🏪 Restaurants</Link></li>
              <li><Link to="/bookings" className="hover:text-orange-400 transition-colors duration-300">📅 My Bookings</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-400">Contact Us</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>📧 support@diningcertainty.com</li>
              <li>📱 +1 (555) 123-4567</li>
              <li>🌐 www.diningcertainty.com</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-400">Follow Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start text-2xl">
              <a href="#" className="hover:text-orange-400 transition-all duration-300 hover:scale-125">👍</a>
              <a href="#" className="hover:text-orange-400 transition-all duration-300 hover:scale-125">📸</a>
              <a href="#" className="hover:text-orange-400 transition-all duration-300 hover:scale-125">🐦</a>
              <a href="#" className="hover:text-orange-400 transition-all duration-300 hover:scale-125">💼</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">&copy; 2025 Dining Certainty. All rights reserved. ✨</p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
