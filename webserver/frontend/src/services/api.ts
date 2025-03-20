import axios from 'axios';

// Define the base URL for API requests
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface for drive session data
export interface DriveSession {
  _id: string;
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
    city: number; 
    highway: number;
    longTrip: boolean;
  };
  timeOfDay: string;
  dayOfWeek: string;
  weatherCondition: string;
}

// Interface for user statistics
export interface UserStats {
  totalMiles: number;
  avgMpg: number;
  drivingPatterns: {
    city: number;
    highway: number;
    longTrips: number;
    weekend: number;
    night: number;
    weatherConditions: number;
    weekday: number;
  };
  fuelEconomyTrends: {
    months: string[];
    mpg: number[];
  };
  drivingHabits: Array<{
    label: string;
    value: string;
    comparison: string;
  }>;
  insights: string[];
}

// Drive session API methods
export const driveSessionApi = {
  // Get all sessions
  getSessions: async (limit = 20, skip = 0) => {
    try {
      const response = await api.get(`/drive-sessions?limit=${limit}&skip=${skip}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching drive sessions:', error);
      throw error;
    }
  },

  // Get a specific session by ID
  getSession: async (id: string) => {
    try {
      const response = await api.get(`/drive-sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching drive session with ID ${id}:`, error);
      throw error;
    }
  },

  // Get sessions for a specific user
  getUserSessions: async (email: string, limit = 20, skip = 0) => {
    try {
      const response = await api.get(`/drive-sessions/user/${email}?limit=${limit}&skip=${skip}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching drive sessions for user ${email}:`, error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async (email: string) => {
    try {
      const response = await api.get<{success: boolean, data: UserStats}>(`/drive-sessions/user/${email}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user stats for ${email}:`, error);
      throw error;
    }
  },

  // Create a new drive session
  createSession: async (sessionData: Omit<DriveSession, '_id'>) => {
    try {
      const response = await api.post('/drive-sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error creating drive session:', error);
      throw error;
    }
  },

  // Mark a session as having had its report sent
  markReportSent: async (id: string) => {
    try {
      const response = await api.patch(`/drive-sessions/${id}/reportSent`);
      return response.data;
    } catch (error) {
      console.error(`Error marking report sent for session ${id}:`, error);
      throw error;
    }
  }
};

export default api; 