import React, { useEffect, useState } from 'react';
import restaurantService from '../services/restaurantService';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <div className="text-center">Loading restaurants...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
            <p className="text-gray-600 mb-1">{restaurant.address}</p>
            <p className="text-gray-600 mb-4">{restaurant.phone}</p>
            <p className="text-gray-700">{restaurant.description}</p>
            <a href={`/restaurants/${restaurant._id}`} className="mt-4 inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
