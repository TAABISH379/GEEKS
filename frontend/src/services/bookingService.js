// frontend/services/bookingService.js

const API_URL = 'http://localhost:5000/api/bookings/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return {
      'Content-Type': 'application/json',
      'x-auth-token': user.token,
    };
  } else {
    return {
      'Content-Type': 'application/json',
    };
  }
};

const getAvailability = async (restaurantId, date, partySize) => {
  const response = await fetch(`${API_URL}availability?restaurantId=${restaurantId}&date=${date}&partySize=${partySize}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to get availability');
  }
  return data;
};

const createBooking = async (bookingData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to create booking');
  }
  return data;
};

const getUserBookings = async () => {
  const response = await fetch(API_URL + 'me', {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to fetch user bookings');
  }
  return data;
};


const bookingService = {
  getAvailability,
  createBooking,
  getUserBookings,
};

export default bookingService;
