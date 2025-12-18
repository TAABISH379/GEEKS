require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Dining Certainty API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
