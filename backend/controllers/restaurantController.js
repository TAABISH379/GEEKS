const Restaurant = require('../models/Restaurant');
const User = require('../models/User'); // To link owner

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email');
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (Admin)
exports.createRestaurant = async (req, res) => {
  const { name, address, phone, email, description, tables } = req.body;

  try {
    const newRestaurant = new Restaurant({
      name,
      address,
      phone,
      email,
      description,
      owner: req.user.id, // Set owner to the authenticated user
      tables: tables || [],
    });

    const restaurant = await newRestaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Admin)
exports.updateRestaurant = async (req, res) => {
  const { name, address, phone, email, description, tables, bufferRules } = req.body;

  // Build restaurant object
  const restaurantFields = {};
  if (name) restaurantFields.name = name;
  if (address) restaurantFields.address = address;
  if (phone) restaurantFields.phone = phone;
  if (email) restaurantFields.email = email;
  if (description) restaurantFields.description = description;
  if (tables) restaurantFields.tables = tables;
  if (bufferRules) restaurantFields.bufferRules = bufferRules;


  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    // Make sure user owns restaurant or is admin (later authorization)
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: restaurantFields },
      { new: true }
    );

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Admin)
exports.deleteRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    // Make sure user owns restaurant or is admin (later authorization)
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Restaurant removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add tables to a restaurant
// @route   POST /api/restaurants/:id/tables
// @access  Private (Admin)
exports.addTables = async (req, res) => {
  const { tables } = req.body; // array of { tableNumber, capacity }

  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (!Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({ msg: 'Please provide an array of tables' });
    }

    restaurant.tables.push(...tables);
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Adjust buffer rules for a restaurant
// @route   PUT /api/restaurants/:id/buffer
// @access  Private (Admin)
exports.adjustBufferRules = async (req, res) => {
  const { earlyBuffer, lateBuffer } = req.body;

  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (earlyBuffer !== undefined) restaurant.bufferRules.earlyBuffer = earlyBuffer;
    if (lateBuffer !== undefined) restaurant.bufferRules.lateBuffer = lateBuffer;

    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
