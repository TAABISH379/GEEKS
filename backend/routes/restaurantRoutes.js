const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addTables,
  adjustBufferRules,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('admin'), createRestaurant); // Only admin can create

router.route('/:id')
  .get(getRestaurant)
  .put(protect, authorize('admin'), updateRestaurant) // Only admin can update
  .delete(protect, authorize('admin'), deleteRestaurant); // Only admin can delete

router.route('/:id/tables')
  .post(protect, authorize('admin'), addTables); // Only admin can add tables

router.route('/:id/buffer')
  .put(protect, authorize('admin'), adjustBufferRules); // Only admin can adjust buffer rules

module.exports = router;
