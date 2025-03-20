import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DriveSession as DriveSess } from './src/models/DriveSession';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://angadjeet22071:HEfzGEXbEuFZjhbI@cluster0.fvbex.mongodb.net/license-metrics';

// Add demo data for the demo user
const addDemoData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // Check if we already have demo data
    const existingDemoSessions = await DriveSess.countDocuments({ email: 'demo@example.com' });
    if (existingDemoSessions > 0) {
      console.log(`Found ${existingDemoSessions} existing demo sessions, skipping creation`);
      return;
    }

    // Demo data: Last 6 months of drive sessions
    const demoSessions = [];
    const now = new Date();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const timesOfDay = ['morning', 'afternoon', 'evening', 'night'];
    const weatherConditions = ['clear', 'cloudy', 'rain', 'snow', 'fog'];
    const locations = ['Home', 'Office', 'Gym', 'Shopping Mall', 'Park', 'Restaurant', 'School'];

    // Create 60 sessions (approximately 2-3 per week for 6 months)
    for (let i = 0; i < 60; i++) {
      // Random date within last 6 months
      const dayOffset = Math.floor(Math.random() * 180); // 180 days = 6 months
      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() - dayOffset);
      
      // Random parameters
      const distance = 5 + Math.random() * 45; // 5-50 miles
      const duration = distance * (2 + Math.random() * 2); // 2-4 minutes per mile
      const fuelUsed = distance / (15 + Math.random() * 15); // 15-30 mpg
      
      const cityPercent = Math.floor(Math.random() * 100); // 0-100% city driving
      const highwayPercent = 100 - cityPercent; // Remainder is highway
      
      const longTrip = distance > 30; // Long trips are over 30 miles
      
      // Random events
      const hardBraking = Math.floor(Math.random() * distance / 5); // More distance = more events
      const rapidAcceleration = Math.floor(Math.random() * distance / 6);
      const laneChanges = Math.floor(Math.random() * distance / 3);
      
      const dayOfWeek = daysOfWeek[sessionDate.getDay()];
      const timeOfDay = timesOfDay[Math.floor(Math.random() * timesOfDay.length)];
      const weatherCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      // Random start/end locations
      const startLocation = locations[Math.floor(Math.random() * locations.length)];
      const endLocation = locations[Math.floor(Math.random() * locations.length)];
      
      const session = new DriveSess({
        email: 'demo@example.com',
        distance,
        duration,
        fuelUsed,
        startLocation,
        endLocation,
        date: sessionDate,
        reportSent: Math.random() > 0.7, // 30% chance of report being sent
        drivingEvents: {
          hardBraking,
          rapidAcceleration,
          laneChanges
        },
        routeType: {
          city: cityPercent,
          highway: highwayPercent,
          longTrip
        },
        timeOfDay,
        dayOfWeek,
        weatherCondition
      });
      
      demoSessions.push(session);
    }
    
    // Also add some data for test@example.com user
    for (let i = 0; i < 30; i++) {
      // Similar random data generation as above
      const dayOffset = Math.floor(Math.random() * 90); // 90 days = 3 months
      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() - dayOffset);
      
      const distance = 5 + Math.random() * 35;
      const duration = distance * (2 + Math.random() * 2);
      const fuelUsed = distance / (18 + Math.random() * 10);
      
      const cityPercent = Math.floor(Math.random() * 100);
      const highwayPercent = 100 - cityPercent;
      const longTrip = distance > 30;
      
      const hardBraking = Math.floor(Math.random() * distance / 4);
      const rapidAcceleration = Math.floor(Math.random() * distance / 5);
      const laneChanges = Math.floor(Math.random() * distance / 2.5);
      
      const dayOfWeek = daysOfWeek[sessionDate.getDay()];
      const timeOfDay = timesOfDay[Math.floor(Math.random() * timesOfDay.length)];
      const weatherCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      const startLocation = locations[Math.floor(Math.random() * locations.length)];
      const endLocation = locations[Math.floor(Math.random() * locations.length)];
      
      const session = new DriveSess({
        email: 'test@example.com',
        distance,
        duration,
        fuelUsed,
        startLocation,
        endLocation,
        date: sessionDate,
        reportSent: Math.random() > 0.7,
        drivingEvents: {
          hardBraking,
          rapidAcceleration,
          laneChanges
        },
        routeType: {
          city: cityPercent,
          highway: highwayPercent,
          longTrip
        },
        timeOfDay,
        dayOfWeek,
        weatherCondition
      });
      
      demoSessions.push(session);
    }

    // Save all sessions to the database
    console.log(`Saving ${demoSessions.length} demo sessions to the database...`);
    await DriveSess.insertMany(demoSessions);
    console.log('Demo data inserted successfully');
    
  } catch (error) {
    console.error('Error adding demo data:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
addDemoData(); 