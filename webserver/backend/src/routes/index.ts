import express from 'express';
import userRoutes from './users';
import authRoutes from './auth';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', authMiddleware, userRoutes);

// Root API endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Drive Analytics API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

export default router;