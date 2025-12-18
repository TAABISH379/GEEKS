import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock restaurant data - up to 10 restaurants near you
  const nearbyRestaurants = [
    {
      id: 1,
      name: 'The Italian Garden',
      cuisine: 'Italian',
      rating: 4.8,
      distance: '0.5 km',
      image: '🍝'
    },
    {
      id: 2,
      name: 'Sakura Sushi',
      cuisine: 'Japanese',
      rating: 4.7,
      distance: '0.8 km',
      image: '🍣'
    },
    {
      id: 3,
      name: 'Le Petit Bistro',
      cuisine: 'French',
      rating: 4.9,
      distance: '1.2 km',
      image: '🥖'
    },
    {
      id: 4,
      name: 'Spice of India',
      cuisine: 'Indian',
      rating: 4.6,
      distance: '1.5 km',
      image: '🍛'
    },
    {
      id: 5,
      name: 'Dragon Palace',
      cuisine: 'Chinese',
      rating: 4.5,
      distance: '1.8 km',
      image: '🥢'
    },
    {
      id: 6,
      name: 'El Mariachi',
      cuisine: 'Mexican',
      rating: 4.7,
      distance: '2.0 km',
      image: '🌮'
    },
    {
      id: 7,
      name: 'The Burger House',
      cuisine: 'American',
      rating: 4.4,
      distance: '2.2 km',
      image: '🍔'
    },
    {
      id: 8,
      name: 'Thai Orchid',
      cuisine: 'Thai',
      rating: 4.8,
      distance: '2.5 km',
      image: '🍲'
    },
    {
      id: 9,
      name: 'Kebab King',
      cuisine: 'Middle Eastern',
      rating: 4.6,
      distance: '2.8 km',
      image: '🍖'
    },
    {
      id: 10,
      name: 'Pizza Paradise',
      cuisine: 'Italian',
      rating: 4.5,
      distance: '3.0 km',
      image: '🍕'
    }
  ];

  useEffect(() => {
    setRestaurants(nearbyRestaurants);
  }, []);

  return (
    <div className="py-10 px-4 perspective dark:text-white transition-colors duration-300">
      {/* Hero Section with 3D Effect */}
      <div className="perspective mb-16">
        <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 dark:from-orange-700 dark:via-red-700 dark:to-pink-700 rounded-2xl p-12 mb-12 text-white shadow-2xl relative overflow-hidden group hover-glow-3d transition-colors duration-300" style={{ perspective: '1000px' }}>
          {/* Animated background elements - 3D Depth */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500 depth-1 morph-shape dark:opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full opacity-10 translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-500 depth-2 morph-shape dark:opacity-20" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-yellow-200 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-500 depth-3 tilt3d dark:opacity-10"></div>
          
          <div className="relative z-10">
            <div className="text-6xl mb-4 float text-center pulse3d">⭐</div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-center bg-gradient-to-r from-yellow-200 to-white dark:from-yellow-100 dark:to-orange-100 bg-clip-text text-transparent drop-shadow-lg slide-in-down text-3d">Welcome to Dining Certainty!</h1>
            <p className="text-2xl mb-8 text-center text-yellow-100 dark:text-yellow-50 drop-shadow-lg slide-in-up">Your Zero-Waiting Restaurant Reservation System</p>
            <div className="flex justify-center space-x-6 flex-wrap">
              <button 
                onClick={() => navigate('/restaurants')}
                className="bg-white dark:bg-gray-800 text-orange-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-gray-700 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-xl btn-hover transform hover:-translate-y-1 hover-lift"
              >
                🔍 Find Restaurants
              </button>
              <button 
                onClick={() => navigate('/bookings')}
                className="border-4 border-white dark:border-gray-300 text-white dark:text-gray-100 hover:bg-white hover:text-orange-600 dark:hover:bg-gray-700 dark:hover:text-yellow-400 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-xl btn-hover transform hover:-translate-y-1 hover-lift"
              >
                📅 My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Near You Section */}
      <div className="mb-16">
        <div className="flex items-center justify-center mb-12">
          <div className="text-4xl mr-4 float bounce3d">🏪</div>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent text-3d">Restaurants Near You</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 grid-3d">
          {restaurants.map((restaurant, index) => (
            <div 
              key={restaurant.id}
              onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              onMouseEnter={() => setHoveredCard(restaurant.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer p-6 group perspective card-hover hover-tilt hover-glow-3d dark:hover:shadow-orange-500/20"
              style={{
                animation: `slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.12}s both`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Card glow effect - 3D Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 depth-1"></div>
              
              <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
                <div 
                  className="text-6xl mb-4 text-center group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12 transform preserve-3d" 
                  style={{
                    animation: hoveredCard === restaurant.id ? 'rotate3d 2s linear infinite' : 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {restaurant.image}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 text-3d">
                  {restaurant.name}
                </h3>
                
                <div className="mb-3 preserve-3d">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-semibold">{restaurant.cuisine}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cuisine Type</p>
                </div>
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 preserve-3d">
                  <span className="text-yellow-500 dark:text-yellow-400 font-bold text-lg hover:scale-110 transition-transform">⭐ {restaurant.rating}</span>
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full hover-scale-3d">{restaurant.distance}</span>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/restaurants/${restaurant.id}`);
                  }}
                  className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 hover:from-orange-600 hover:to-red-600 dark:hover:from-orange-700 dark:hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-lg group-hover:shadow-xl transform hover:-translate-y-1 btn-hover hover-lift preserve-3d"
                >
                  ✨ Reserve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section - 3D Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 grid-3d">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-2 hover-lift hover-glow-3d card-hover slide-in-left dark:shadow-blue-500/20" style={{ animationDelay: '0.1s' }}>
          <div className="text-5xl mb-4 bounce3d">⚡</div>
          <h3 className="text-2xl font-bold mb-2 text-3d">Zero Waiting</h3>
          <p className="text-blue-100 dark:text-blue-200">Reserve your table instantly and skip the queue</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-400 to-green-600 dark:from-green-700 dark:to-green-900 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-2 hover-lift hover-glow-3d card-hover slide-in-up dark:shadow-green-500/20" style={{ animationDelay: '0.2s' }}>
          <div className="text-5xl mb-4 rotate3d">🍽️</div>
          <h3 className="text-2xl font-bold mb-2 text-3d">Best Restaurants</h3>
          <p className="text-green-100 dark:text-green-200">Choose from thousands of amazing dining experiences</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-700 dark:to-purple-900 rounded-2xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-2 hover-lift hover-glow-3d card-hover slide-in-right dark:shadow-purple-500/20" style={{ animationDelay: '0.3s' }}>
          <div className="text-5xl mb-4 float">🎁</div>
          <h3 className="text-2xl font-bold mb-2 text-3d">Exclusive Deals</h3>
          <p className="text-purple-100 dark:text-purple-200">Enjoy special discounts and loyalty rewards</p>
        </div>
      </div>

      {/* Decorative 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 dark:opacity-10 animate-pulse tilt3d"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 dark:bg-orange-900 rounded-full filter blur-3xl opacity-20 dark:opacity-10 animate-pulse float-reverse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl opacity-10 dark:opacity-5 animate-pulse bounce3d"></div>
      </div>
    </div>
  );
};

export default Home;
