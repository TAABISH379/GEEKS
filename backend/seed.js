require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Booking = require('./models/Booking');
const { getDiningDurationToken } = require('./services/bookingService');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Booking.deleteMany();
    console.log('Existing data cleared.');

    // 1. Create Sample Users
    const salt = await bcrypt.genSalt(10);

    const hashedPasswordUser = await bcrypt.hash('password123', salt);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', salt);

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPasswordUser,
      role: 'user',
    });

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: 'admin',
    });
    console.log('Sample users created.');

    // 2. Create Sample Restaurants
    const restaurant1 = await Restaurant.create({
      name: 'The Fancy Fork',
      address: '123 Main St, Anytown',
      phone: '555-1234',
      email: 'fancyfork@example.com',
      description: 'A fine dining experience.',
      owner: adminUser._id,
      tables: [
        { tableNumber: 'A1', capacity: 2 },
        { tableNumber: 'A2', capacity: 2 },
        { tableNumber: 'B1', capacity: 4 },
        { tableNumber: 'B2', capacity: 4 },
        { tableNumber: 'C1', capacity: 6 },
      ],
      bufferRules: {
        earlyBuffer: 10,
        lateBuffer: 20,
      },
    });

    const restaurant2 = await Restaurant.create({
      name: 'Burger Palace',
      address: '456 Oak Ave, Anytown',
      phone: '555-5678',
      email: 'burgerpalace@example.com',
      description: 'Casual burger joint.',
      owner: adminUser._id,
      tables: [
        { tableNumber: 'T1', capacity: 2 },
        { tableNumber: 'T2', capacity: 2 },
        { tableNumber: 'T3', capacity: 3 },
        { tableNumber: 'T4', capacity: 4 },
      ],
      bufferRules: {
        earlyBuffer: 5,
        lateBuffer: 10,
      },
    });
    console.log('Sample restaurants created.');

    // 3. Create Sample Bookings
    const today = new Date();
    today.setHours(19, 0, 0, 0); // 7:00 PM today

    // Booking 1: User 1 at Fancy Fork for 2 people
    const booking1DDT = getDiningDurationToken(2);
    await Booking.create({
      user: user1._id,
      restaurant: restaurant1._id,
      table: restaurant1.tables[0]._id, // Table A1
      partySize: 2,
      requestedDateTime: today,
      diningDurationToken: booking1DDT,
      confidenceWindowStart: new Date(today.getTime() - 10 * 60 * 1000), // Example
      confidenceWindowEnd: new Date(today.getTime() + 20 * 60 * 1000), // Example
      certaintyScore: 90, // Example
      status: 'confirmed',
    });

    // Booking 2: User 1 at Fancy Fork for 4 people, a bit later
    const later = new Date(today.getTime() + 60 * 60 * 1000); // 8:00 PM
    const booking2DDT = getDiningDurationToken(4);
    await Booking.create({
      user: user1._id,
      restaurant: restaurant1._id,
      table: restaurant1.tables[2]._id, // Table B1
      partySize: 4,
      requestedDateTime: later,
      diningDurationToken: booking2DDT,
      confidenceWindowStart: new Date(later.getTime() - 10 * 60 * 1000),
      confidenceWindowEnd: new Date(later.getTime() + 20 * 60 * 1000),
      certaintyScore: 80,
      status: 'confirmed',
    });

    // Booking 3: User 1 at Burger Palace for 3 people tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(13, 0, 0, 0); // 1:00 PM tomorrow
    const booking3DDT = getDiningDurationToken(3);
    await Booking.create({
      user: user1._id,
      restaurant: restaurant2._id,
      table: restaurant2.tables[2]._id, // Table T3
      partySize: 3,
      requestedDateTime: tomorrow,
      diningDurationToken: booking3DDT,
      confidenceWindowStart: new Date(tomorrow.getTime() - 5 * 60 * 1000),
      confidenceWindowEnd: new Date(tomorrow.getTime() + 10 * 60 * 1000),
      certaintyScore: 95,
      status: 'pending',
    });

    console.log('Sample bookings created.');
    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
