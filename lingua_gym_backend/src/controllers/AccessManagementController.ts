import { Request, Response } from 'express';
import ServiceFactory from '../services/ServiceFactory.js';
import logger from '../utils/logger/Logger.js';

class AccessManagementController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      logger.info({ email: req.body.email }, 'User registration attempt');
      const { username, email, password } = req.body;
      const user = await ServiceFactory.getRegistrationService().register(username, email, password);
      logger.info({ userId: user.user_id }, 'User registered successfully');
      res.status(201).json({ message: 'User registered', user });
    } catch (error) {
      logger.error({ error }, 'User registration failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      logger.info({ email }, 'User login attempt');
      
      const { accessToken, refreshToken } = await ServiceFactory.getAuthenticationService().login(email, password);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      logger.info({ email }, 'User logged in successfully');
      res.json({ accessToken });
    } catch (error) {
      logger.warn({ email: req.body.email }, 'User login failed');
      res.status(401).json({ error: (error as Error).message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      if (!userId) {
        throw new Error('Unauthorized');
      }

      logger.info({ userId }, 'User logout attempt');
      await ServiceFactory.getAuthenticationService().logout(userId);
      
      res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      logger.info({ userId }, 'User logged out successfully');
      res.json({ message: 'Logged out' });
    } catch (error) {
      logger.error({ error }, 'User logout failed');
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error('Refresh token missing');
      }

      logger.info({}, 'Refreshing access token');
      const newTokens = await ServiceFactory.getJwtTokenManagementService().refreshToken(refreshToken);
      
      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.json({ accessToken: newTokens.accessToken });
    } catch (error) {
      logger.warn({}, 'Refresh token failed');
      res.status(403).json({ error: (error as Error).message || 'Invalid refresh token' });
    }
  }

  static async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      logger.info({ email: req.body.email }, 'Password reset request');
      await ServiceFactory.getPasswordResetService().requestPasswordReset(req.body.email);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error({ error }, 'Password reset request failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      logger.info({}, 'Resetting password');
      await ServiceFactory.getPasswordResetService().resetPassword(req.body.token, req.body.newPassword);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      logger.error({ error }, 'Password reset failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default AccessManagementController;
