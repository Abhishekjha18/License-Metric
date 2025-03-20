import express, { RequestHandler } from 'express';
import { driveSessionController } from '../controllers/driveSessionController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware as RequestHandler);

router.post('/', driveSessionController.createSession as RequestHandler);
router.get('/', driveSessionController.getSessions as RequestHandler);
router.get('/:id', driveSessionController.getSession as RequestHandler);
router.get('/user/:email', driveSessionController.getUserSessions as RequestHandler);
router.patch('/:id/reportSent', driveSessionController.markReportSent as RequestHandler);
router.get('/user/:email/stats', driveSessionController.getUserStats as RequestHandler);

export default router; 