// src/routes/auth.ts
import { Router } from 'express';
import admin from '../config/firebaseAdmin';
import User from '../models/User';

const router = Router();

// Middleware to verify Firebase token
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

// Example protected route: Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    // Optionally, sync with MongoDB:
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, name: name || '' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
