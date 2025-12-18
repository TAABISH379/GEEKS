const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hour: { // 0-23
    type: Number,
    required: true,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  averagePartySize: {
    type: Number,
    default: 0,
  },
  // Could add more metrics like average waiting time, actual dining duration, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
