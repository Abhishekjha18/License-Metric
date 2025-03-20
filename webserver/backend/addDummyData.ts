// src/models/DriveSession.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDriveSession extends Document {
  email: string;
  distance: number;
  duration: number;
  fuelUsed: number;
  startLocation: string;
  endLocation: string;
  date: Date;
  reportSent: boolean;
  drivingEvents: {
    hardBraking: number;
    rapidAcceleration: number;
    laneChanges: number;
  };
  routeType: {
    city: number; // percentage of city driving (0-100)
    highway: number; // percentage of highway driving (0-100)
    longTrip: boolean;
  };
  timeOfDay: string; // morning, afternoon, evening, night
  dayOfWeek: string; // monday, tuesday, etc.
  weatherCondition: string; // clear, rain, snow, etc.
}

const DriveSessionSchema: Schema = new Schema({
  email: { type: String, required: true, index: true },
  distance: { type: Number, required: true, default: 0 }, // in miles
  duration: { type: Number, required: true, default: 0 }, // in minutes
  fuelUsed: { type: Number, required: true, default: 0 }, // in gallons
  startLocation: { type: String, required: true, default: 'Unknown' },
  endLocation: { type: String, required: true, default: 'Unknown' },
  date: { type: Date, required: true, default: Date.now },
  reportSent: { type: Boolean, default: false },
  drivingEvents: {
    hardBraking: { type: Number, default: 0 },
    rapidAcceleration: { type: Number, default: 0 },
    laneChanges: { type: Number, default: 0 }
  },
  routeType: {
    city: { type: Number, default: 50 }, // percentage
    highway: { type: Number, default: 50 }, // percentage
    longTrip: { type: Boolean, default: false }
  },
  timeOfDay: { 
    type: String, 
    enum: ['morning', 'afternoon', 'evening', 'night'],
    default: 'afternoon',
    required: true 
  },
  dayOfWeek: { 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    default: () => new Date().toLocaleLowerCase('en-US', { weekday: 'long' }),
    required: true 
  },
  weatherCondition: { 
    type: String, 
    enum: ['clear', 'cloudy', 'rain', 'snow', 'fog'],
    default: 'clear',
    required: true 
  }
}, { 
  timestamps: true,
  // Add this to make empty/undefined properties default to the schema defaults
  // instead of failing validation
  minimize: false
});

// Create model only if it doesn't already exist
export const DriveSession = mongoose.models.DriveSession || 
  mongoose.model<IDriveSession>('DriveSession', DriveSessionSchema);