// src/controllers/driveSessionController.ts
import { Request, Response } from 'express';
import { driveSessionService } from '../services/driveSessionService';

export const driveSessionController = {
  // Create a new drive session
  async createSession(req: Request, res: Response) {
    try {
      const sessionData = req.body;
      const newSession = await driveSessionService.createSession(sessionData);
      res.status(201).json({
        success: true,
        data: newSession
      });
    } catch (error) {
      console.error('Error creating drive session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create drive session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get all sessions
  async getSessions(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
      const sessions = await driveSessionService.getSessions({}, limit, skip);
      
      res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions
      });
    } catch (error) {
      console.error('Error fetching drive sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch drive sessions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get a specific session
  async getSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = await driveSessionService.getSessionById(id);
      
      if (!session) {
        res.status(404).json({
          success: false,
          message: 'Drive session not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Error fetching drive session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch drive session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get sessions for a specific user
  async getUserSessions(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
      
      const sessions = await driveSessionService.getSessionsByEmail(email, limit, skip);
      
      res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions
      });
    } catch (error) {
      console.error('Error fetching user drive sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user drive sessions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Mark a session as having had its report sent
  async markReportSent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedSession = await driveSessionService.markReportSent(id);
      
      if (!updatedSession) {
        res.status(404).json({
          success: false,
          message: 'Drive session not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedSession
      });
    } catch (error) {
      console.error('Error updating drive session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update drive session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get user statistics
  async getUserStats(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const stats = await driveSessionService.getUserStats(email);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};