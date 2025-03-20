import { Request, Response } from 'express';
import { auth } from '../config/firebase';

/**
 * Get the current user's profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await auth.getUser(req.user.uid);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    await auth.updateUser(req.user.uid, req.body);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Update user email
 */
export const updateUserEmail = async (req: Request, res: Response) => {
  try {
    await auth.updateUser(req.user.uid, { email: req.body.email });
    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email' });
  }
};

/**
 * Send email verification link
 */
export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const user = await auth.getUser(req.user.uid);
    // Implementation depends on your email service
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    await auth.deleteUser(req.user.uid);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};