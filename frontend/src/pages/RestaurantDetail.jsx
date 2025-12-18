import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import restaurantService from '../services/restaurantService';
import bookingService from '../services/bookingService';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [selectedTime, setSelectedTime] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkError, setCheckError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const restaurantMockData = {
    1: { name: 'The Italian Garden', cuisine: 'Italian', address: '123 Main St', description: 'Authentic Italian cuisine', rating: 4.8 },
    2: { name: 'Sakura Sushi', cuisine: 'Japanese', address: '456 Oak Ave', description: 'Fresh sushi and Japanese dishes', rating: 4.7 },
    3: { name: 'Le Petit Bistro', cuisine: 'French', address: '789 Pine Rd', description: 'Classic French dining', rating: 4.9 },
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const mockData = restaurantMockData[id] || restaurantMockData[1];
        setRestaurant({
          _id: id,
          ...mockData,
          image: ['🍝', '🍣', '🥖'][id - 1] || '🍽️',
          hours: '11:00 AM - 10:00 PM',
          phone: '+1 (555) 123-4567',
          email: 'contact@restaurant.com'
        });
      } catch (err) {
        setError('Failed to fetch restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const generateAvailableTimes = (selectedDate) => {
    const times = [];
    const startHour = 11;
    const endHour = 22;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        times.push(timeStr);
      }
    }
    return times;
  };

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setCheckError('Please select date and time');
      return;
    }

    setCheckLoading(true);
    setCheckError(null);
    setAvailability(null);
    setAvailableTimes([]);

    try {
      const times = generateAvailableTimes(date);
      setAvailableTimes(times);
      
      const mockAvailability = {
        date: date,
        time: time,
        partySize: parseInt(partySize),
        available: true,
        confidence: Math.floor(Math.random() * 40) + 60,
        diningDuration: 60 + (parseInt(partySize) * 10),
        tables: ['Table 5', 'Table 8', 'Table 12'],
        message: 'Great! Tables are available for your requested time.'
      };
      
      setAvailability(mockAvailability);
    } catch (err) {
      setCheckError(err.message || 'Failed to check availability.');
    } finally {
      setCheckLoading(false);
    }
  };

  const handleBookTable = async () => {
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    setBookingError(null);
    setCheckLoading(true);

    try {
      const bookingData = {
        restaurantId: id,
        date: `${date}T${time}:00`,
        partySize: parseInt(partySize),
        name: user.user?.name || 'Guest',
        email: user.user?.email || '',
        phone: user.user?.phone || '',
        specialRequests: ''
      };

      await bookingService.createBooking(bookingData);
      setBookingSuccess(true);
      
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setBookingError(err.message || 'Failed to book table. Please try again.');
    } finally {
      setCheckLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-2xl font-bold animate-pulse">🍽️ Loading restaurant details...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 text-xl mt-8">{error}</div>
  );

  if (!restaurant) return (
    <div className="text-center text-gray-500 text-xl mt-8">Restaurant not found.</div>
  );

  return (
    <div className="py-8 px-4">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-6xl mb-4">{restaurant.image}</div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">{restaurant.name}</h1>
            <p className="text-lg text-orange-100 mb-4">{restaurant.cuisine} • ⭐ {restaurant.rating}</p>
            <p className="text-orange-50 mb-6">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Restaurant Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-bold text-gray-800 mb-2">📍 Address</h3>
              <p className="text-gray-600">{restaurant.address}</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-bold text-gray-800 mb-2">🕐 Hours</h3>
              <p className="text-gray-600">{restaurant.hours}</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-bold text-gray-800 mb-2">📞 Contact</h3>
              <p className="text-gray-600">{restaurant.phone}</p>
              <p className="text-gray-600">{restaurant.email}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ <strong>Tip:</strong> Book in advance for guaranteed seating!
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">🔖 Check Availability & Book Table</h2>
            
            {bookingSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
                <p className="text-green-700 font-bold">✅ Booking Confirmed!</p>
                <p className="text-green-600">Redirecting to your bookings...</p>
              </div>
            )}

            {bookingError && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                <p className="text-red-700 font-bold">❌ Error</p>
                <p className="text-red-600">{bookingError}</p>
              </div>
            )}

            <form onSubmit={handleCheckAvailability} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">📅 Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">🕐 Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">👥 Number of Guests</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    min="1"
                    max="20"
                    required
                  />
                  <div className="text-4xl">
                    {partySize <= 2 ? '👤' : partySize <= 5 ? '👥' : '👨‍👩‍👧‍👦'}
                  </div>
                </div>
              </div>

              {/* Check Error */}
              {checkError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-red-600 text-sm">{checkError}</p>
                </div>
              )}

              {/* Check Button */}
              <button
                type="submit"
                disabled={checkLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                {checkLoading ? '⏳ Checking...' : '✨ Check Availability'}
              </button>
            </form>

            {/* Availability Results */}
            {availability && (
              <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">✅ {availability.message}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-bold text-gray-800">{date} {time}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Party Size</p>
                      <p className="font-bold text-gray-800">{partySize} guests</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="font-bold text-green-600">{availability.confidence}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Est. Duration</p>
                      <p className="font-bold text-gray-800">{availability.diningDuration} mins</p>
                    </div>
                    {availability.tables && (
                      <div className="bg-white rounded-lg p-3 col-span-2 md:col-span-1">
                        <p className="text-sm text-gray-600">Available Tables</p>
                        <p className="font-bold text-gray-800">{availability.tables.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Button */}
                {availability.confidence > 50 ? (
                  <button
                    onClick={handleBookTable}
                    disabled={checkLoading || bookingSuccess}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  >
                    {checkLoading ? '⏳ Booking...' : bookingSuccess ? '✅ Booked!' : '🎉 Confirm & Book Table'}
                  </button>
                ) : (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 font-bold">⚠️ Low Confidence Score</p>
                    <p className="text-yellow-600 text-sm">Booking not recommended due to low certainty ({availability.confidence}%). Please try a different time.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
