import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error: any) {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid token',
        error: error.message
      });
    }
  } catch (error) {
    next(error);
  }
};

export const adminAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // First check if user is authenticated
    await authMiddleware(req, res, async () => {
      // Then check if user has admin custom claim
      if (req.user && req.user.admin === true) {
        next();
      } else {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }
    });
  } catch (error) {
    next(error);
  }
};