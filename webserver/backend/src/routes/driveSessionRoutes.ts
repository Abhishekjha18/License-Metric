import express, { RequestHandler } from 'express';
import { driveSessionController } from '../controllers/driveSessionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// --- Demo user routes (no authentication required) ---
// Get sessions for the demo user
router.get('/user/demo@example.com', driveSessionController.getUserSessions as RequestHandler);

// Create a new drive session (open to all, e.g. for demo purposes)
router.post('/', driveSessionController.createSession as RequestHandler);

// Get all sessions (this route is available without auth; adjust if needed)
router.get('/', driveSessionController.getSessions as RequestHandler);

router.get('/user/demo@example.com', driveSessionController.getUserSessions);

// --- Routes that require authentication ---
// Apply authentication middleware to all routes defined after this point
router.use(authMiddleware as RequestHandler);

// Get a specific session by its id
router.get('/:id', driveSessionController.getSession as RequestHandler);

// Get sessions for a specific user (authenticated users only)
router.get('/user/:email', driveSessionController.getUserSessions as RequestHandler);

// Update a session to mark its report as sent
router.patch('/:id/reportSent', driveSessionController.markReportSent as RequestHandler);

// Get user statistics
router.get('/user/:email/stats', driveSessionController.getUserStats as RequestHandler);

export default router;
