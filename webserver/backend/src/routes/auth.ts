import express, { RequestHandler } from 'express';
import { body } from 'express-validator';
import { checkVerificationStatus, setCustomUserClaims } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Check if user's email is verified
router.get('/verification-status', authMiddleware as RequestHandler, checkVerificationStatus as RequestHandler);

// Set custom claims (e.g., admin role) - requires admin authentication
router.post(
  '/set-custom-claims',
  [
    body('uid').isString().withMessage('User ID is required'),
    body('claims').isObject().withMessage('Claims must be an object')
  ],
  authMiddleware as RequestHandler,
  setCustomUserClaims as RequestHandler
);

export default router;