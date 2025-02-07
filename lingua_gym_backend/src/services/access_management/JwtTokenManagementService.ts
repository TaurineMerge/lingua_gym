import jwt from 'jsonwebtoken';
import UserModel from '../../models/UserModel';
import User from '../../../database/interfaces/User/User';
import logger from '../../utils/logger/Logger';
import 'dotenv/config';

class TokenManagementService {
  private userModel: UserModel;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET || '';
    this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '30m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info('Refresh token request received');
    
    const payload = this.verifyRefreshToken(refreshToken);
    const user = await this.userModel.getUserById(payload.userId);

    if (!user || user.token_version !== payload.tokenVersion) {
      logger.warn({ userId: payload.userId }, 'Invalid refresh token');
      throw new Error('Invalid refresh token');
    }

    await this.incrementTokenVersion(user.user_id);

    const updatedUser = await this.userModel.getUserById(user.user_id);

    const newAccessToken = this.generateAccessToken(updatedUser!);
    const newRefreshToken = this.generateRefreshToken(updatedUser!);

    logger.info({ userId: user.user_id }, 'Tokens refreshed');
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.user_id },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.user_id, tokenVersion: user.token_version },
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
  
      await this.userModel.updateUser(userId, { token_version: user.token_version + 1 });
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
