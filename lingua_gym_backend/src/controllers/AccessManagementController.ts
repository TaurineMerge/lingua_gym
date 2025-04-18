import { Request, Response } from 'express';
import container from '../di/Container.js';
import logger from '../utils/logger/Logger.js';
import { RegistrationService, AuthenticationService, JwtTokenManagementService, PasswordResetService } from '../services/access_management/access_management.js';

class AccessManagementController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      logger.info({ email: req.body.email }, 'User registration attempt');
      const { username, email, password } = req.body;
      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const user = await registrationService.register(username, email, password);
      logger.info({ userId: user.userId }, 'User registered successfully');
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
      const authenticationService = container.resolve<AuthenticationService>('AuthenticationService');
      const { accessToken, refreshToken } = await authenticationService.login(email, password);

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
      if (!userId) throw new Error('Unauthorized');

      logger.info({ userId }, 'User logout attempt');
      const authenticationService = container.resolve<AuthenticationService>('AuthenticationService');
      await authenticationService.logout(userId);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
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
      if (!refreshToken) throw new Error('Refresh token missing');

      logger.info({}, 'Refreshing access token');
      const jwtService = container.resolve<JwtTokenManagementService>('JwtTokenManagementService');
      const newTokens = await jwtService.refreshToken(refreshToken);

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
      const passwordResetService = container.resolve<PasswordResetService>('PasswordResetService');
      await passwordResetService.requestPasswordReset(req.body.email);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error({ error }, 'Password reset request failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      logger.info({}, 'Resetting password');
      const passwordResetService = container.resolve<PasswordResetService>('PasswordResetService');
      await passwordResetService.resetPassword(req.body.token, req.body.newPassword);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      logger.error({ error }, 'Password reset failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async checkIfEmailExists(req: Request, res: Response): Promise<void> {
    try {
      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const exists = await registrationService.checkIfEmailExists(req.body.email);
      res.json({ 'available': !exists });
    } catch (error) {
      logger.error({ error }, 'Checking if email exists failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async checkIfUsernameExists(req: Request, res: Response): Promise<void> {
    try {
      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const exists = await registrationService.checkIfUsernameExists(req.body.username);
      res.json({ 'available': !exists });
    } catch (error) {
      logger.error({ error }, 'Checking if username exists failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default AccessManagementController;
