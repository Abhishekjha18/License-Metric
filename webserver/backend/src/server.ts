import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeFirebaseAdmin } from './config/firebase';
import routes from './routes';
import { errorHandler } from './utils/errorHandler';
import winston from 'winston';
import driveSessionRoutes from './routes/driveSessionRoutes';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Create Express app
const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://angadjeet22071:HEfzGEXbEuFZjhbI@cluster0.fvbex.mongodb.net/';

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // HTTP request logger

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Setup global request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers['user-agent']
  });
  next();
});



// API Routes
app.use('/api', routes);
app.use('/api/drive-sessions', driveSessionRoutes);
// Root route
app.get('/', (req, res) => {
  res.send('Driver Analytics API is running');
});


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});


// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

export default app;