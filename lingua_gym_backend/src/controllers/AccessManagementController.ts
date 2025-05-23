import { CookieOptions, Request, Response } from 'express';
import container from '../di/Container.js';
import logger from '../utils/logger/Logger.js';
import {
  RegistrationService,
  AuthenticationService,
  JwtTokenManagementService,
  PasswordResetService
} from '../services/access_management/access_management.js';
import GoogleAuthService from '../services/access_management/GoogleAuthService.js';

class AccessManagementController {
  private static setTokenCookies(res: Response, refreshToken: string, accessToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      logger.info({ email: req.body.email }, 'User registration attempt');
      const { username, email, password, displayName } = req.body;

      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const user = await registrationService.register(username, email, password, displayName);

      const authService = container.resolve<AuthenticationService>('AuthenticationService');
      const { accessToken, refreshToken } = await authService.login(email, password);

      AccessManagementController.setTokenCookies(res, refreshToken, accessToken);
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

      const authService = container.resolve<AuthenticationService>('AuthenticationService');
      const { accessToken, refreshToken } = await authService.login(email, password);

      AccessManagementController.setTokenCookies(res, refreshToken, accessToken);
      logger.info({ email }, 'User logged in successfully');

      res.json({ accessToken });
    } catch (error) {
      logger.warn({ email: req.body.email }, 'User login failed');
      res.status(401).json({ error: (error as Error).message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) throw new Error('Unauthorized');

      logger.info({ userId }, 'User logout attempt');

      const authService = container.resolve<AuthenticationService>('AuthenticationService');
      await authService.logout(userId);

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      logger.info({ userId }, 'User logged out successfully');
      res.json({ message: 'Logged out' });
    } catch (error) {
      logger.error({ error }, 'User logout failed');
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) throw new Error('Refresh token missing');

      const jwtService = container.resolve<JwtTokenManagementService>('JwtTokenManagementService');
      const { accessToken, refreshToken: newRefresh } = await jwtService.refreshToken(refreshToken);

      AccessManagementController.setTokenCookies(res, newRefresh, accessToken);

      logger.info({}, 'Access token refreshed');
      res.json({ refreshed: true });
    } catch (error) {
      logger.warn({}, 'Refresh token failed');
      res.status(403).json({ error: (error as Error).message });
    }
  }

  static async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      logger.info({ email }, 'Password reset request');

      if (!email) throw new Error('Email is required');

      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const isEmailExists = await registrationService.checkIfEmailExists(email);

      if (!isEmailExists) {
        throw new Error('Email does not exist');
      }

      const resetService = container.resolve<PasswordResetService>('PasswordResetService');
      await resetService.requestPasswordReset(email);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error({ error }, 'Password reset request failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      const resetService = container.resolve<PasswordResetService>('PasswordResetService');
      await resetService.resetPassword(token, newPassword);

      logger.info({}, 'Password reset successful');
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      logger.error({ error }, 'Password reset failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async checkIfEmailExists(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const exists = await registrationService.checkIfEmailExists(email);

      res.json({ available: !exists });
    } catch (error) {
      logger.error({ error }, 'Check if email exists failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async checkIfUsernameExists(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;
      const registrationService = container.resolve<RegistrationService>('RegistrationService');
      const exists = await registrationService.checkIfUsernameExists(username);

      res.json({ available: !exists });
    } catch (error) {
      logger.error({ error }, 'Check if username exists failed');
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async checkIfAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = req.cookies;
      const authService = container.resolve<AuthenticationService>('AuthenticationService');

      const authenticated = accessToken
        ? await authService.isAuthenticated(accessToken)
        : false;

      res.json({ authenticated });
    } catch (error) {
      logger.error({ error }, 'Check if authenticated failed');
      res.status(400).json({ error: (error as Error).message, authenticated: false });
    }
  }

  static async googleToken(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;
      if (!code) { 
        res.status(400).json({ error: 'Missing code' });
        return;
      }
      
      const googleService = container.resolve<GoogleAuthService>('GoogleAuthService');
      await googleService.authenticateUser(code)
        .then(async (user) => {
          AccessManagementController.setTokenCookies(res, user.refreshToken, user.accessToken);
          res.json({ user, redirectUrl: process.env.GOOGLE_REDIRECT_URI });
        })
        .catch(() => res.status(400).json({ error: 'Invalid Google code' }));

    } catch (err) {
      logger.error(err);
      res.status(401).json({ error: 'User google authentication failed' });
    }
  }
}

export default AccessManagementController;
