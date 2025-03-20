import express, { RequestHandler } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { 
  getUserProfile, 
  updateUserProfile, 
  updateUserEmail, 
  sendVerificationEmail, 
  deleteUserAccount 
} from '../controllers/userController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware as RequestHandler);

// Get current user profile
router.get('/me', getUserProfile as RequestHandler);

// Update user profile
router.put(
  '/me', 
  [
    body('displayName').optional().isString().trim().isLength({ min: 2, max: 50 }),
    body('photoURL').optional().isURL()
  ],
  updateUserProfile as RequestHandler
);

// Change email
router.put(
  '/email', 
  [
    body('email').isEmail().withMessage('Must be a valid email address')
  ],
  updateUserEmail as RequestHandler
);

// Request email verification
router.post('/verify-email', sendVerificationEmail as RequestHandler);

// Delete account
router.delete('/me', deleteUserAccount as RequestHandler);

export default router;