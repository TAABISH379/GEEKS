const Restaurant = require('../models/Restaurant');
const Booking = require('../models/Booking');

/**
 * Assigns average dining duration based on party size.
 * 1–2 people → 45 mins
 * 3–4 people → 75 mins
 * 5+ people → 90 mins
 * @param {number} partySize
 * @returns {number} Dining Duration Token in minutes
 */
exports.getDiningDurationToken = (partySize) => {
  if (partySize >= 1 && partySize <= 2) {
    return 45;
  } else if (partySize >= 3 && partySize <= 4) {
    return 75;
  } else if (partySize >= 5) {
    return 90;
  }
  return 0; // Should not happen with valid party sizes
};

/**
 * Calculates the confidence window for a booking.
 * @param {string} restaurantId
 * @param {Date} requestedDateTime
 * @param {number} partySize
 * @returns {{confidenceWindowStart: Date, confidenceWindowEnd: Date}}
 */
exports.calculateConfidenceWindow = async (restaurantId, requestedDateTime, partySize) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  const { earlyBuffer, lateBuffer } = restaurant.bufferRules;

  // Initial window based on requested time and buffers
  const windowStart = new Date(requestedDateTime.getTime() - earlyBuffer * 60 * 1000);
  const windowEnd = new Date(requestedDateTime.getTime() + lateBuffer * 60 * 1000);

  // Future improvement: Factor in current load and historical averages
  // For now, a simplified buffer-based window
  return {
    confidenceWindowStart: windowStart,
    confidenceWindowEnd: windowEnd,
  };
};

/**
 * Calculates the certainty score for a potential booking.
 * @param {string} restaurantId
 * @param {Date} requestedDateTime
 * @param {number} partySize
 * @param {Date} confidenceWindowStart
 * @param {Date} confidenceWindowEnd
 * @returns {number} Certainty Score (0-100)
 */
exports.calculateCertaintyScore = async (restaurantId, requestedDateTime, partySize, confidenceWindowStart, confidenceWindowEnd) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  const totalRestaurantCapacity = restaurant.tables.reduce((sum, table) => sum + table.capacity, 0);
  const proposedBookingDDT = exports.getDiningDurationToken(partySize); // Use exports.getDiningDurationToken here

  // Calculate the proposed booking's end time based on DDT
  const proposedBookingEndTime = new Date(requestedDateTime.getTime() + proposedBookingDDT * 60 * 1000);

  // Find overlapping bookings within the confidence window
  const overlappingBookings = await Booking.find({
    restaurant: restaurantId,
    status: 'confirmed', // Only confirmed bookings affect capacity
    $or: [
      {
        // Existing booking starts during the proposed booking's window
        requestedDateTime: { $lt: proposedBookingEndTime },
        $expr: {
          $gt: [
            { $add: ['$requestedDateTime', { $multiply: ['$diningDurationToken', 60 * 1000] }] },
            requestedDateTime
          ]
        }
      },
      {
        // Proposed booking starts during an existing booking's window
        requestedDateTime: { $gte: requestedDateTime, $lt: proposedBookingEndTime },
      }
    ]
  });

  let occupiedCapacity = 0;
  overlappingBookings.forEach(booking => {
    occupiedCapacity += booking.partySize;
  });

  const availableCapacity = Math.max(0, totalRestaurantCapacity - occupiedCapacity);

  // Simple scoring based on remaining capacity
  // This is a basic model and needs refinement with peak hour, historical punctuality, etc.
  let score = (availableCapacity / totalRestaurantCapacity) * 100;
  score = Math.min(100, Math.max(0, score)); // Ensure score is between 0 and 100

  // If there's no available capacity, the score should be very low or zero
  if (availableCapacity === 0) {
      score = 0;
  } else if (availableCapacity < partySize) {
      // If not enough capacity for the requested party size, penalize
      score /= 2; // Halve the score
  }


  // Further considerations (to be added later):
  // - Peak hour weighting: Decrease score during peak times if load is high
  // - Historical punctuality: Adjust based on how often tables clear on time

  return Math.round(score);
