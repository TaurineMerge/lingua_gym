import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/access_management/access_management.js';
import { User } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
import { injectable, inject } from 'tsyringe';

@injectable()
class TokenManagementService {
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor(@inject('UserModel') private userModel: UserModel) {
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET || '';
    this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '30m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info('Refresh token request received');
    
    const payload = this.verifyRefreshToken(refreshToken);
    const user = await this.userModel.getUserById(payload.userId);

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      logger.warn({ userId: payload.userId }, 'Invalid refresh token');
      throw new Error('Invalid refresh token');
    }

    await this.incrementTokenVersion(user.userId);

    const updatedUser = await this.userModel.getUserById(user.userId);

    const newAccessToken = this.generateAccessToken(updatedUser!);
    const newRefreshToken = this.generateRefreshToken(updatedUser!);

    logger.info({ userId: user.userId }, 'Tokens refreshed');
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.userId },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.userId, tokenVersion: user.tokenVersion },
      this.jwtRefreshSecret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  async incrementTokenVersion(userId: string): Promise<void> {
    try {
      const user = await this.userModel.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      await this.userModel.updateUserById(userId, { tokenVersion: user.tokenVersion + 1 });
      logger.info({ userId }, 'Token version incremented');
    } catch (error) {
      logger.error({ userId, error }, 'Failed to increment token version');
      throw new Error('Could not update token version');
    }
  }

  verifyRefreshToken(token: string): { userId: string; tokenVersion: number } {
    try {
      return jwt.verify(token, this.jwtRefreshSecret) as { userId: string; tokenVersion: number };
    } catch (err) {
      logger.error({ error: err }, 'Invalid refresh token');
      throw new Error('Invalid refresh token');
    }
  }

  verifyAccessToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: string };
    } catch (err) {
      logger.error({ error: err }, 'Invalid access token');
      throw new Error('Invalid access token');
    }
  }
}

export default TokenManagementService;
