// src/services/driveSessionService.ts
import { DriveSession } from '../models/DriveSession';

interface DriveSessionData {
  email: string;
  distance: number;
  duration: number;
  fuelUsed: number;
  startLocation: string;
  endLocation: string;
  date: Date;
  drivingEvents: {
    hardBraking: number;
    rapidAcceleration: number;
    laneChanges: number;
  };
  routeType: {
    city: number;
    highway: number;
    longTrip: boolean;
  };
  timeOfDay: string;
  dayOfWeek: string;
  weatherCondition: string;
}

export const driveSessionService = {
  // Create a new drive session
  async createSession(sessionData: DriveSessionData) {
    try {
      const newSession = new DriveSession(sessionData);
      return await newSession.save();
    } catch (error) {
      console.error('Error saving drive session:', error);
      throw error;
    }
  },

  // Get sessions with optional filters
  async getSessions(filter = {}, limit = 20, skip = 0) {
    try {
      return await DriveSession.find(filter).sort({ date: -1 }).limit(limit).skip(skip);
    } catch (error) {
      console.error('Error fetching drive sessions:', error);
      throw error;
    }
  },

  // Get a session by ID
  async getSessionById(id: string) {
    try {
      return await DriveSession.findById(id);
    } catch (error) {
      console.error(`Error fetching drive session with ID ${id}:`, error);
      throw error;
    }
  },

  // Get sessions by email
  async getSessionsByEmail(email: string, limit = 20, skip = 0) {
    try {
      return await DriveSession.find({ email }).sort({ date: -1 }).limit(limit).skip(skip);
    } catch (error) {
      console.error(`Error fetching drive sessions for email ${email}:`, error);
      throw error;
    }
  },

  // Mark a report as sent
  async markReportSent(id: string) {
    try {
      return await DriveSession.findByIdAndUpdate(
        id,
        { reportSent: true },
        { new: true }
      );
    } catch (error) {
      console.error(`Error marking report sent for session ${id}:`, error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats(email: string) {
    try {
      // Get all sessions for this user
      const sessions = await DriveSession.find({ email }).sort({ date: -1 });
      
      // Handle case with no sessions
      if (!sessions || sessions.length === 0) {
        return {
          totalMiles: 0,
          avgMpg: 0,
          drivingPatterns: {
            city: 0,
            highway: 0,
            longTrips: 0,
            weekend: 0,
            night: 0,
            weatherConditions: 0,
            weekday: 0
          },
          fuelEconomyTrends: {
            months: ['No Data'],
            mpg: [0]
          },
          drivingHabits: [
            { label: 'Hard Braking Events', value: '0 per 100 miles', comparison: 'N/A' },
            { label: 'Rapid Acceleration', value: '0 per 100 miles', comparison: 'N/A' },
            { label: 'Lane Changes', value: '0 per 100 miles', comparison: 'N/A' }
          ],
          insights: ['No driving data available yet.']
        };
      }
      
      // Calculate total miles
      const totalMiles = sessions.reduce((sum, session) => sum + (session.distance || 0), 0);
      
      // Calculate average MPG
      const totalFuelUsed = sessions.reduce((sum, session) => sum + (session.fuelUsed || 0), 0);
      const avgMpg = totalFuelUsed > 0 ? totalMiles / totalFuelUsed : 0;
      
      // Calculate driving patterns
      const cityDriving = sessions.reduce((sum, session) => 
        sum + (session.routeType?.city || 0), 0) / sessions.length;
      
      const highwayDriving = sessions.reduce((sum, session) => 
        sum + (session.routeType?.highway || 0), 0) / sessions.length;
      
      const longTrips = sessions.filter(session => 
        session.routeType?.longTrip).length / sessions.length * 100;
      
      // Calculate weekend vs weekday driving
      const weekendSessions = sessions.filter(session => 
        session.dayOfWeek === 'saturday' || session.dayOfWeek === 'sunday'
      ).length;
      const weekdaySessions = sessions.length - weekendSessions;
      const weekendPercentage = (weekendSessions / sessions.length) * 100;
      const weekdayPercentage = (weekdaySessions / sessions.length) * 100;
      
      // Calculate night driving
      const nightDriving = sessions.filter(session => 
        session.timeOfDay === 'night' || session.timeOfDay === 'evening'
      ).length / sessions.length * 100;
      
      // Calculate weather condition driving
      const weatherConditionDriving = sessions.filter(session => 
        session.weatherCondition === 'rain' || session.weatherCondition === 'snow'
      ).length / sessions.length * 100;
      
      // Create monthly fuel economy trends
      const monthlyData = new Map();
      
      sessions.forEach(session => {
        if (!session.date) return;
        
        const date = new Date(session.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, { totalMiles: 0, totalFuel: 0 });
        }
        
        const data = monthlyData.get(monthYear);
        data.totalMiles += session.distance || 0;
        data.totalFuel += session.fuelUsed || 0;
      });
      
      // Convert to arrays for chart
      const months: string[] = [];
      const mpgValues: number[] = [];
      
      // Get the last 5 months (or fewer if we don't have that much data)
      const sortedMonths = Array.from(monthlyData.entries())
        .sort((a, b) => {
          const [aMonth, aYear] = a[0].split('/').map(Number);
          const [bMonth, bYear] = b[0].split('/').map(Number);
          return (bYear * 12 + bMonth) - (aYear * 12 + aMonth);
        })
        .slice(0, 5)
        .reverse();
      
      sortedMonths.forEach(([month, data]) => {
        const [monthNum, year] = month.split('/');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.push(monthNames[Number(monthNum) - 1]);
        
        const mpg = data.totalFuel > 0 ? data.totalMiles / data.totalFuel : 0;
        mpgValues.push(Number(mpg.toFixed(1)));
      });
      
      // If no monthly data, provide default
      if (months.length === 0) {
        months.push('No Data');
        mpgValues.push(0);
      }
      
      // Analyze driving habits
      const avgHardBrakingPer100Miles = sessions.reduce(
        (sum, session) => {
          const braking = session.drivingEvents?.hardBraking || 0;
          const distance = session.distance || 1; // Avoid division by zero
          return sum + (braking / distance) * 100;
        }, 
        0
      ) / sessions.length;
      
      const avgRapidAccelerationPer100Miles = sessions.reduce(
        (sum, session) => {
          const accel = session.drivingEvents?.rapidAcceleration || 0;
          const distance = session.distance || 1;
          return sum + (accel / distance) * 100;
        }, 
        0
      ) / sessions.length;
      
      const avgLaneChangesPer100Miles = sessions.reduce(
        (sum, session) => {
          const lanes = session.drivingEvents?.laneChanges || 0;
          const distance = session.distance || 1;
          return sum + (lanes / distance) * 100;
        }, 
        0
      ) / sessions.length;
      
      // Compare to average metrics (these would come from your database in a real application)
      const avgDriverHardBrakingPer100Miles = 2.5;
      const avgDriverRapidAccelerationPer100Miles = 3.0;
      const avgDriverLaneChangesPer100Miles = 4.5;
      
      const drivingHabits = [
        {
          label: 'Hard Braking Events',
          value: `${avgHardBrakingPer100Miles.toFixed(1)} per 100 miles`,
          comparison: avgHardBrakingPer100Miles < avgDriverHardBrakingPer100Miles 
            ? 'Lower than avg' 
            : avgHardBrakingPer100Miles > avgDriverHardBrakingPer100Miles 
              ? 'Higher than avg' 
              : 'Average'
        },
        {
          label: 'Rapid Acceleration',
          value: `${avgRapidAccelerationPer100Miles.toFixed(1)} per 100 miles`,
          comparison: avgRapidAccelerationPer100Miles < avgDriverRapidAccelerationPer100Miles 
            ? 'Lower than avg' 
            : avgRapidAccelerationPer100Miles > avgDriverRapidAccelerationPer100Miles 
              ? 'Higher than avg' 
              : 'Average'
        },
        {
          label: 'Lane Changes',
          value: `${avgLaneChangesPer100Miles.toFixed(1)} per 100 miles`,
          comparison: avgLaneChangesPer100Miles < avgDriverLaneChangesPer100Miles 
            ? 'Lower than avg' 
            : avgLaneChangesPer100Miles > avgDriverLaneChangesPer100Miles 
              ? 'Higher than avg' 
              : 'Average'
        }
      ];
      
      // Generate insights
      const insights = [];
      
      // MPG trend insights
      if (mpgValues.length >= 3 && mpgValues[0] > 0) {
        const recentAvg = (mpgValues[mpgValues.length - 1] + mpgValues[mpgValues.length - 2] + mpgValues[mpgValues.length - 3]) / 3;
        const olderAvg = mpgValues.length > 3 
          ? (mpgValues[0] + mpgValues[1] + mpgValues[2]) / 3 
          : mpgValues[0];
        
        if (olderAvg > 0) {
          const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;
          
          if (percentChange > 5) {
            insights.push(`Your fuel efficiency has improved by ${percentChange.toFixed(0)}% over the last 3 months.`);
          } else if (percentChange < -5) {
            insights.push(`Your fuel efficiency has decreased by ${Math.abs(percentChange).toFixed(0)}% over the last 3 months.`);
          } else {
            insights.push(`Your fuel efficiency has remained stable over the last ${mpgValues.length} months.`);
          }
        } else {
          insights.push(`Not enough historical data to analyze fuel efficiency trends.`);
        }
      } else {
        insights.push(`More driving history needed to analyze fuel efficiency trends.`);
      }
      
      // Driver comparison insights
      if (avgHardBrakingPer100Miles > avgDriverHardBrakingPer100Miles && 
          avgRapidAccelerationPer100Miles > avgDriverRapidAccelerationPer100Miles) {
        insights.push(`Consider reducing hard braking and rapid accelerations to improve your efficiency score.`);
      } else if (avgHardBrakingPer100Miles > avgDriverHardBrakingPer100Miles) {
        insights.push(`Consider reducing hard braking to improve your efficiency score.`);
      } else if (avgRapidAccelerationPer100Miles > avgDriverRapidAccelerationPer100Miles) {
        insights.push(`Consider reducing rapid accelerations to improve your efficiency score.`);
      } else {
        insights.push(`You now outperform 75% of drivers with similar vehicles in terms of efficient driving habits.`);
      }
      
      return {
        totalMiles,
        avgMpg,
        drivingPatterns: {
          city: cityDriving,
          highway: highwayDriving,
          longTrips,
          weekend: weekendPercentage,
          night: nightDriving,
          weatherConditions: weatherConditionDriving,
          weekday: weekdayPercentage
        },
        fuelEconomyTrends: {
          months,
          mpg: mpgValues
        },
        drivingHabits,
        insights
      };
    } catch (error) {
      console.error(`Error generating user stats for ${email}:`, error);
      throw error;
    }
  }
};