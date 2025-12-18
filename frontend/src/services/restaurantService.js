// frontend/services/restaurantService.js

const API_URL = 'http://localhost:5000/api/restaurants/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return {
      'Content-Type': 'application/json',
      'x-auth-token': user.token,
    };
  } else {
    // For public routes, return only content-type
    return {
      'Content-Type': 'application/json',
    };
  }
};

const getAllRestaurants = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to fetch restaurants');
  }
  return data;
};

const getRestaurantById = async (id) => {
  const response = await fetch(API_URL + id);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to fetch restaurant');
  }
  return data;
};

const createRestaurant = async (restaurantData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(restaurantData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to create restaurant');
  }
  return data;
};

const addTablesToRestaurant = async (restaurantId, tablesData) => {
  const response = await fetch(`${API_URL}${restaurantId}/tables`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tables: tablesData }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to add tables');
  }
  return data;
};

const adjustRestaurantBufferRules = async (restaurantId, bufferRules) => {
  const response = await fetch(`${API_URL}${restaurantId}/buffer`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(bufferRules),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to adjust buffer rules');
  }
  return data;
};


const restaurantService = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  addTablesToRestaurant,
  adjustRestaurantBufferRules,
};

export default restaurantService;
