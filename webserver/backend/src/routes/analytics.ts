// src/routes/analytics.ts
import { Router } from 'express';
import admin from '../config/firebaseAdmin';

const router = Router();

// Middleware to verify token (reuse similar to auth middleware)
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error });
  }
};

router.get('/', authenticate, (req, res) => {
  // Return sample analytics data
  res.json({
    overallScore: 85,
    driveStats: { totalDrives: 28, totalTime: '15h', totalMiles: 423 },
    recentDrives: [
      { id: 1, title: 'Morning Commute', date: '2025-03-15', duration: '27 min', distance: '12.4 miles', score: 88 },
      { id: 2, title: 'Evening Drive', date: '2025-03-15', duration: '20 min', distance: '9.2 miles', score: 72 }
    ]
  });
});

export default router;
