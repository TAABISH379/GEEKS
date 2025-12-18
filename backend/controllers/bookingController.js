const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const { getDiningDurationToken, calculateConfidenceWindow, calculateCertaintyScore } = require('../services/bookingService');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res) => {
  const { restaurantId, requestedDateTime, partySize } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    const diningDurationToken = getDiningDurationToken(partySize);
    if (diningDurationToken === 0) {
      return res.status(400).json({ msg: 'Invalid party size' });
    }

    const requestedDate = new Date(requestedDateTime);

    const { confidenceWindowStart, confidenceWindowEnd } = await calculateConfidenceWindow(
      restaurantId,
      requestedDate,
      partySize
    );

    const certaintyScore = await calculateCertaintyScore(
      restaurantId,
      requestedDate,
      partySize,
      confidenceWindowStart,
      confidenceWindowEnd
    );

    // Find an available table based on capacity and booking time
    let availableTable = null;
    for (const table of restaurant.tables) {
        if (table.capacity >= partySize) {
            // Check if this table is free during the proposed booking time + DDT
            const overlappingBookingsOnTable = await Booking.find({
                restaurant: restaurantId,
                table: table._id,
                status: 'confirmed',
                $or: [
                    {
                        requestedDateTime: { $lt: new Date(requestedDate.getTime() + diningDurationToken * 60 * 1000) },
                        $expr: {
                            $gt: [
                                { $add: ['$requestedDateTime', { $multiply: ['$diningDurationToken', 60 * 1000] }] },
                                requestedDate
                            ]
                        }
                    },
                    {
                        requestedDateTime: { $gte: requestedDate, $lt: new Date(requestedDate.getTime() + diningDurationToken * 60 * 1000) },
                    }
                ]
            });
            if (overlappingBookingsOnTable.length === 0) {
                availableTable = table._id;
                break;
            }
        }
    }

    if (!availableTable) {
        return res.status(400).json({ msg: 'No suitable table available for this party size and time' });
    }


    const newBooking = new Booking({
      user: req.user.id,
      restaurant: restaurantId,
      table: availableTable,
      partySize,
      requestedDateTime: requestedDate,
      diningDurationToken,
      confidenceWindowStart,
      confidenceWindowEnd,
      certaintyScore,
      status: 'confirmed', // Assuming instant confirmation for now
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's booking history
// @route   GET /api/bookings/me
// @access  Private (User)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('restaurant', 'name address')
      .sort({ requestedDateTime: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all bookings for a restaurant
// @route   GET /api/bookings/restaurant/:restaurantId
// @access  Private (Admin)
exports.getRestaurantBookings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    // Ensure admin owns the restaurant
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const bookings = await Booking.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email')
      .sort({ requestedDateTime: 1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let booking = await Booking.findById(req.params.id).populate('restaurant');

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Ensure admin owns the restaurant
    if (booking.restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get availability, confidence window, and certainty score
// @route   GET /api/bookings/availability
// @access  Public
exports.getAvailability = async (req, res) => {
  const { restaurantId, date, partySize } = req.query;

  try {
    if (!restaurantId || !date || !partySize) {
      return res.status(400).json({ msg: 'Please provide restaurantId, date, and partySize' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    const requestedDate = new Date(date);
    const parsedPartySize = parseInt(partySize);

    const diningDurationToken = getDiningDurationToken(parsedPartySize);
    if (diningDurationToken === 0) {
      return res.status(400).json({ msg: 'Invalid party size' });
    }

    const { confidenceWindowStart, confidenceWindowEnd } = await calculateConfidenceWindow(
      restaurantId,
      requestedDate,
      parsedPartySize
    );

    const certaintyScore = await calculateCertaintyScore(
      restaurantId,
      requestedDate,
      parsedPartySize,
      confidenceWindowStart,
      confidenceWindowEnd
    );

    res.json({
      restaurantId,
      requestedDateTime: requestedDate,
      partySize: parsedPartySize,
      diningDurationToken,
      confidenceWindow: {
        start: confidenceWindowStart,
        end: confidenceWindowEnd,
      },
      certaintyScore,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
