const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table', // Reference to the sub-document table in Restaurant
  },
  partySize: {
    type: Number,
    required: true,
  },
  requestedDateTime: {
    type: Date,
    required: true,
  },
  diningDurationToken: { // DDT in minutes
    type: Number,
    required: true,
  },
  confidenceWindowStart: {
    type: Date,
  },
  confidenceWindowEnd: {
    type: Date,
  },
  certaintyScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
