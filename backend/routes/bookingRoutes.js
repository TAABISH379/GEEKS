const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getRestaurantBookings,
  updateBookingStatus,
  getAvailability,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking); // User can create booking

router.route('/me')
  .get(protect, getUserBookings); // User can view their bookings

router.route('/restaurant/:restaurantId')
  .get(protect, authorize('admin'), getRestaurantBookings); // Admin can view restaurant bookings

router.route('/:id/status')
  .put(protect, authorize('admin'), updateBookingStatus); // Admin can update booking status

router.route('/availability')
  .get(getAvailability); // Public route for checking availability

module.exports = router;
