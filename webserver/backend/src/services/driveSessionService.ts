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

// Average metrics (can be overridden via environment variables)
const AVG_HARD_BRAKING_PER_100_MILES = Number(process.env.AVG_HARD_BRAKING_PER_100_MILES || 2.5);
const AVG_RAPID_ACCELERATION_PER_100_MILES = Number(process.env.AVG_RAPID_ACCELERATION_PER_100_MILES || 3.0);
const AVG_LANE_CHANGES_PER_100_MILES = Number(process.env.AVG_LANE_CHANGES_PER_100_MILES || 4.5);

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

  // Get sessions with optional filters, sorted by date (latest first)
  async getSessions(filter = {}, limit = 20, skip = 0) {
    try {
      return await DriveSession.find(filter).sort({ date: -1 }).limit(limit).skip(skip);
    } catch (error) {
      console.error('Error fetching drive sessions:', error);
      throw error;
    }
  },

  // Get a session by its ID
  async getSessionById(id: string) {
    try {
      return await DriveSession.findById(id);
    } catch (error) {
      console.error(`Error fetching drive session with ID ${id}:`, error);
      throw error;
    }
  },

  // Get sessions by user email
  async getSessionsByEmail(email: string, limit = 20, skip = 0) {
    try {
      return await DriveSession.find({ email }).sort({ date: -1 }).limit(limit).skip(skip);
    } catch (error) {
      console.error(`Error fetching drive sessions for email ${email}:`, error);
      throw error;
    }
  },

  // Mark a session's report as sent
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

  // Get user statistics and insights based on their sessions
  async getUserStats(email: string) {
    try {
      const sessions = await DriveSession.find({ email }).sort({ date: -1 });
      
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
      
      // Total miles and MPG calculations
      const totalMiles = sessions.reduce((sum, session) => sum + (session.distance || 0), 0);
      const totalFuelUsed = sessions.reduce((sum, session) => sum + (session.fuelUsed || 0), 0);
      const avgMpg = totalFuelUsed > 0 ? totalMiles / totalFuelUsed : 0;
      
      // Driving pattern calculations
      const cityDriving = sessions.reduce((sum, session) => sum + (session.routeType?.city || 0), 0) / sessions.length;
      const highwayDriving = sessions.reduce((sum, session) => sum + (session.routeType?.highway || 0), 0) / sessions.length;
      const longTrips = (sessions.filter(session => session.routeType?.longTrip).length / sessions.length) * 100;
      
      // Weekend and weekday driving percentages
      const weekendSessions = sessions.filter(session => session.dayOfWeek === 'saturday' || session.dayOfWeek === 'sunday').length;
      const weekendPercentage = (weekendSessions / sessions.length) * 100;
      const weekdayPercentage = ((sessions.length - weekendSessions) / sessions.length) * 100;
      
      // Night driving percentage
      const nightDriving = (sessions.filter(session => session.timeOfDay === 'night' || session.timeOfDay === 'evening').length / sessions.length) * 100;
      
      // Weather-related driving percentage (rain or snow)
      const weatherConditionDriving = (sessions.filter(session => session.weatherCondition === 'rain' || session.weatherCondition === 'snow').length / sessions.length) * 100;
      
      // Fuel economy trends by month
      const monthlyData = new Map<string, { totalMiles: number; totalFuel: number }>();
      sessions.forEach(session => {
        if (!session.date) return;
        const date = new Date(session.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, { totalMiles: 0, totalFuel: 0 });
        }
        const data = monthlyData.get(monthYear)!;
        data.totalMiles += session.distance || 0;
        data.totalFuel += session.fuelUsed || 0;
      });
      
      // Convert monthly data to arrays for trends (last 5 months)
      const months: string[] = [];
      const mpgValues: number[] = [];
      const sortedMonths = Array.from(monthlyData.entries())
        .sort((a, b) => {
          const [aMonth, aYear] = a[0].split('/').map(Number);
          const [bMonth, bYear] = b[0].split('/').map(Number);
          return (bYear * 12 + bMonth) - (aYear * 12 + aMonth);
        })
        .slice(0, 5)
        .reverse();
      
      sortedMonths.forEach(([month, data]) => {
        const [monthNum] = month.split('/');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.push(monthNames[Number(monthNum) - 1]);
        const mpg = data.totalFuel > 0 ? data.totalMiles / data.totalFuel : 0;
        mpgValues.push(Number(mpg.toFixed(1)));
      });
      
      if (months.length === 0) {
        months.push('No Data');
        mpgValues.push(0);
      }
      
      // Driving habits calculations (per 100 miles)
      const avgHardBrakingPer100Miles = sessions.reduce((sum, session) => {
          const braking = session.drivingEvents?.hardBraking || 0;
          const distance = session.distance || 1;
          return sum + (braking / distance) * 100;
        }, 0) / sessions.length;
      
      const avgRapidAccelerationPer100Miles = sessions.reduce((sum, session) => {
          const accel = session.drivingEvents?.rapidAcceleration || 0;
          const distance = session.distance || 1;
          return sum + (accel / distance) * 100;
        }, 0) / sessions.length;
      
      const avgLaneChangesPer100Miles = sessions.reduce((sum, session) => {
          const lanes = session.drivingEvents?.laneChanges || 0;
          const distance = session.distance || 1;
          return sum + (lanes / distance) * 100;
        }, 0) / sessions.length;
      
      // Prepare driving habits comparison
      const drivingHabits = [
        {
          label: 'Hard Braking Events',
          value: `${avgHardBrakingPer100Miles.toFixed(1)} per 100 miles`,
          comparison: avgHardBrakingPer100Miles < AVG_HARD_BRAKING_PER_100_MILES 
            ? 'Lower than avg' 
            : avgHardBrakingPer100Miles > AVG_HARD_BRAKING_PER_100_MILES 
              ? 'Higher than avg' 
              : 'Average'
        },
        {
          label: 'Rapid Acceleration',
          value: `${avgRapidAccelerationPer100Miles.toFixed(1)} per 100 miles`,
          comparison: avgRapidAccelerationPer100Miles < AVG_RAPID_ACCELERATION_PER_100_MILES 
            ? 'Lower than avg' 
            : avgRapidAccelerationPer100Miles > AVG_RAPID_ACCELERATION_PER_100_MILES 
              ? 'Higher than avg' 
              : 'Average'
        },
        {
          label: 'Lane Changes',
          value: `${avgLaneChangesPer100Miles.toFixed(1)} per 100 miles`,
          comparison: avgLaneChangesPer100Miles < AVG_LANE_CHANGES_PER_100_MILES 
            ? 'Lower than avg' 
            : avgLaneChangesPer100Miles > AVG_LANE_CHANGES_PER_100_MILES 
              ? 'Higher than avg' 
              : 'Average'
        }
      ];
      
      // Generate insights based on metrics
      const insights: string[] = [];
      
      if (mpgValues.length > 1) {
        const firstMpg = mpgValues[0];
        const lastMpg = mpgValues[mpgValues.length - 1];
        const percentChange = ((lastMpg - firstMpg) / firstMpg) * 100;
        
        if (percentChange > 10) {
          insights.push(`Your fuel efficiency has improved by ${Math.abs(percentChange).toFixed(0)}% over the last few months.`);
        } else if (percentChange < -10) {
          insights.push(`Your fuel efficiency has decreased by ${Math.abs(percentChange).toFixed(0)}% over the last few months.`);
        }
      }
      
      if (avgHardBrakingPer100Miles > AVG_HARD_BRAKING_PER_100_MILES && avgRapidAccelerationPer100Miles > AVG_RAPID_ACCELERATION_PER_100_MILES) {
        insights.push(`Consider reducing hard braking and rapid accelerations to improve your efficiency score.`);
      } else if (avgHardBrakingPer100Miles > AVG_HARD_BRAKING_PER_100_MILES) {
        insights.push(`Consider reducing hard braking to improve your efficiency score.`);
      } else if (avgRapidAccelerationPer100Miles > AVG_RAPID_ACCELERATION_PER_100_MILES) {
        insights.push(`Consider reducing rapid accelerations to improve your efficiency score.`);
      }
      
      if (avgLaneChangesPer100Miles > AVG_LANE_CHANGES_PER_100_MILES) {
        insights.push(`You make more lane changes than average, which may impact your safety score.`);
      }
      
      if (insights.length === 0) {
        insights.push(avgMpg > 25 
          ? `Great job! Your average MPG of ${avgMpg.toFixed(1)} is above average.` 
          : `Your average MPG is ${avgMpg.toFixed(1)}. Try to maintain steady speeds to improve fuel efficiency.`
        );
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
      console.error(`Error calculating user stats for email ${email}:`, error);
      throw error;
    }
  }
};
