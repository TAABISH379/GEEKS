import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import restaurantService from '../services/restaurantService';
// bookingService is imported, but its admin-specific functions will need token too.
// For now, I'll update the fetch call for restaurant bookings to use getAuthHeaders from a utility.

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [restaurantBookings, setRestaurantBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminMessage, setAdminMessage] = useState(null);

  // Form states for creating restaurant
  const [newRestaurantData, setNewRestaurantData] = useState({
    name: '', address: '', phone: '', email: '', description: ''
  });

  // Form states for adding tables
  const [newTableData, setNewTableData] = useState({
    tableNumber: '', capacity: 1
  });

  // Form states for adjusting buffer rules
  const [bufferRules, setBufferRules] = useState({
    earlyBuffer: 15, lateBuffer: 15
  });

  // Helper to get auth headers
  const getAuthHeaders = () => {
    if (user && user.token) {
      return {
        'Content-Type': 'application/json',
        'x-auth-token': user.token,
      };
    }
    return { 'Content-Type': 'application/json' };
  };


  const fetchAdminData = async () => {
    if (!user || !user.token || user.user.role !== 'admin') return;
    try {
      setLoading(true);
      setError(null);
      const allRestaurants = await restaurantService.getAllRestaurants();
      setRestaurants(allRestaurants);
      if (allRestaurants.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(allRestaurants[0]._id);
        setBufferRules(allRestaurants[0].bufferRules);
      } else if (selectedRestaurant) {
          const currentSelected = allRestaurants.find(r => r._id === selectedRestaurant);
          if (currentSelected) {
            setBufferRules(currentSelected.bufferRules);
          }
      }
    } catch (err) {
      setError('Failed to fetch admin data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchAdminData();
    }
  }, [user, authLoading, adminMessage]); // Refetch if user changes or after an admin action

  useEffect(() => {
    const fetchRestaurantBookings = async () => {
        if (selectedRestaurant && user && user.token) {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/restaurant/${selectedRestaurant}`, {
                    headers: getAuthHeaders(),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.msg || 'Failed to fetch restaurant bookings');
                }
                setRestaurantBookings(data);
            } catch (err) {
                setError('Failed to fetch restaurant bookings.');
                console.error(err);
            }
        } else {
            setRestaurantBookings([]);
        }
    };
    fetchRestaurantBookings();
  }, [selectedRestaurant, user]); // Depend on selectedRestaurant and user token

  const handleRestaurantSelectChange = (e) => {
    const resId = e.target.value;
    setSelectedRestaurant(resId);
    const currentSelected = restaurants.find(r => r._id === resId);
    if (currentSelected) {
      setBufferRules(currentSelected.bufferRules);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setAdminMessage(null);
    try {
      await restaurantService.createRestaurant(newRestaurantData);
      setAdminMessage('Restaurant created successfully!');
      setNewRestaurantData({ name: '', address: '', phone: '', email: '', description: '' });
      fetchAdminData(); // Refresh list
    } catch (err) {
      setAdminMessage(err.message || 'Failed to create restaurant.');
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    setAdminMessage(null);
    if (!selectedRestaurant) {
      setAdminMessage('Please select a restaurant first.');
      return;
    }
    try {
      await restaurantService.addTablesToRestaurant(selectedRestaurant, [newTableData]);
      setAdminMessage('Table added successfully!');
      setNewTableData({ tableNumber: '', capacity: 1 });
      fetchAdminData(); // Refresh to potentially show updated table count
    } catch (err) {
      setAdminMessage(err.message || 'Failed to add table.');
    }
  };

  const handleAdjustBufferRules = async (e) => {
    e.preventDefault();
    setAdminMessage(null);
    if (!selectedRestaurant) {
      setAdminMessage('Please select a restaurant first.');
      return;
    }
    try {
      await restaurantService.adjustRestaurantBufferRules(selectedRestaurant, bufferRules);
      setAdminMessage('Buffer rules updated successfully!');
      fetchAdminData(); // Refresh to ensure data consistency
    } catch (err) {
      setAdminMessage(err.message || 'Failed to adjust buffer rules.');
    }
  };

  if (loading || authLoading) return <div className="text-center">Loading admin dashboard...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user || user.user.role !== 'admin') return <div className="text-center text-red-500">Access Denied. Admins only.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {adminMessage && <p className={`text-center mb-4 ${adminMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>{adminMessage}</p>}

      {/* Create New Restaurant */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Restaurant</h2>
        <form onSubmit={handleCreateRestaurant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Restaurant Name" name="name" value={newRestaurantData.name} onChange={(e) => setNewRestaurantData({...newRestaurantData, name: e.target.value})} className="p-2 border rounded" required />
          <input type="text" placeholder="Address" name="address" value={newRestaurantData.address} onChange={(e) => setNewRestaurantData({...newRestaurantData, address: e.target.value})} className="p-2 border rounded" required />
          <input type="text" placeholder="Phone" name="phone" value={newRestaurantData.phone} onChange={(e) => setNewRestaurantData({...newRestaurantData, phone: e.target.value})} className="p-2 border rounded" />
          <input type="email" placeholder="Email" name="email" value={newRestaurantData.email} onChange={(e) => setNewRestaurantData({...newRestaurantData, email: e.target.value})} className="p-2 border rounded" />
          <textarea placeholder="Description" name="description" value={newRestaurantData.description} onChange={(e) => setNewRestaurantData({...newRestaurantData, description: e.target.value})} className="p-2 border rounded md:col-span-2" rows="2"></textarea>
          <button type="submit" className="md:col-span-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Create Restaurant</button>
        </form>
      </div>

      {/* Select Restaurant for Actions */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <label htmlFor="restaurantSelect" className="block text-lg font-medium text-gray-700 mb-2">Select Restaurant for Actions:</label>
        <select
          id="restaurantSelect"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          value={selectedRestaurant}
          onChange={handleRestaurantSelectChange}
        >
          <option value="">-- Select a Restaurant --</option>
          {restaurants.map((res) => (
            <option key={res._id} value={res._id}>{res.name}</option>
          ))}
        </select>
      </div>

      {selectedRestaurant && (
        <>
          {/* Add Tables */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add Tables to {restaurants.find(r => r._id === selectedRestaurant)?.name}</h2>
            <form onSubmit={handleAddTable} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Table Number (e.g., A1, T5)" name="tableNumber" value={newTableData.tableNumber} onChange={(e) => setNewTableData({...newTableData, tableNumber: e.target.value})} className="p-2 border rounded" required />
              <input type="number" placeholder="Capacity" name="capacity" value={newTableData.capacity} onChange={(e) => setNewTableData({...newTableData, capacity: parseInt(e.target.value)})} className="p-2 border rounded" min="1" required />
              <button type="submit" className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add Table</button>
            </form>
          </div>

          {/* Adjust Buffer Rules */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Adjust Buffer Rules for {restaurants.find(r => r._id === selectedRestaurant)?.name}</h2>
            <form onSubmit={handleAdjustBufferRules} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="earlyBuffer" className="block text-sm font-medium text-gray-700">Early Buffer (mins)</label>
                <input type="number" id="earlyBuffer" name="earlyBuffer" value={bufferRules.earlyBuffer} onChange={(e) => setBufferRules({...bufferRules, earlyBuffer: parseInt(e.target.value)})} className="p-2 border rounded w-full" min="0" required />
              </div>
              <div>
                <label htmlFor="lateBuffer" className="block text-sm font-medium text-gray-700">Late Buffer (mins)</label>
                <input type="number" id="lateBuffer" name="lateBuffer" value={bufferRules.lateBuffer} onChange={(e) => setBufferRules({...bufferRules, lateBuffer: parseInt(e.target.value)})} className="p-2 border rounded w-full" min="0" required />
              </div>
              <button type="submit" className="md:col-span-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">Update Buffer Rules</button>
            </form>
          </div>

          {/* View Bookings for Selected Restaurant */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Bookings for {restaurants.find(r => r._id === selectedRestaurant)?.name}</h2>
            {restaurantBookings.length === 0 ? (
              <p className="text-gray-600">No bookings for this restaurant yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurantBookings.map((booking) => (
                  <div key={booking._id} className="border p-4 rounded-md">
                    <p><strong>User:</strong> {booking.user?.name || 'N/A'}</p>
                    <p><strong>Party Size:</strong> {booking.partySize}</p>
                    <p><strong>Date/Time:</strong> {new Date(booking.requestedDateTime).toLocaleString()}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Confidence:</strong> {booking.certaintyScore}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
