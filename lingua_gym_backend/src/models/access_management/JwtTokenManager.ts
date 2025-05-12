import jwt from 'jsonwebtoken';
import User from './User';
import logger from '../../utils/logger/Logger';

class JwtTokenManager {
    private jwtSecret: string;
    private jwtRefreshSecret: string;
    private accessTokenExpiry: string;
    private refreshTokenExpiry: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || '';
        this.jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET || '';
        this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '30m';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
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

export default JwtTokenManager;