import { Response } from 'express';
import { validationResult } from 'express-validator';
import admin from 'firebase-admin';
import { AuthRequest } from '../middleware/auth';

/**
 * Check if user's email is verified
 */
export const checkVerificationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    
    if (!uid) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userRecord = await admin.auth().getUser(uid);
    
    res.status(200).json({
      emailVerified: userRecord.emailVerified
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Failed to check verification status', 
      error: error.message 
    });
  }
};

/**
 * Set custom user claims (e.g., admin role)
 * This should be restricted to administrators only in production
 */
export const setCustomUserClaims = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // In a real app, you would verify that the current user is an admin
    if (!req.user?.admin) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    
    const { uid, claims } = req.body;
    
    await admin.auth().setCustomUserClaims(uid, claims);
    
    res.status(200).json({ 
      message: 'Custom claims set successfully' 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Failed to set custom claims', 
      error: error.message 
    });
  }
};