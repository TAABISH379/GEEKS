import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && user && user.token) {
      const fetchBookings = async () => {
        try {
          const data = await bookingService.getUserBookings();
          setBookings(data);
        } catch (err) {
          setError('Failed to fetch bookings.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    } else if (!authLoading && (!user || !user.token)) {
        setLoading(false); // No user, no bookings to load
    }
  }, [user, authLoading]);

  if (loading || authLoading) return <div className="text-center">Loading your bookings...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user || !user.token) return <div className="text-center text-gray-600">Please log in to view your bookings.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no upcoming bookings.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{booking.restaurant.name}</h2>
              <p className="text-gray-700"><strong>Date & Time:</strong> {new Date(booking.requestedDateTime).toLocaleString()}</p>
              <p className="text-gray-700"><strong>Party Size:</strong> {booking.partySize}</p>
              <p className="text-gray-700"><strong>Status:</strong> <span className={`font-bold ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</span></p>
              <p className="text-sm text-gray-500 mt-2">Booked at: {new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
