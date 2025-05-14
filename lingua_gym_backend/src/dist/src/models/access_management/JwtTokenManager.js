import jwt from 'jsonwebtoken';
import logger from '../../utils/logger/Logger.js';
class JwtTokenManager {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || '';
        this.jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET || '';
        this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '30m';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
    }
    generateAccessToken(user) {
        return jwt.sign({ userId: user.userId }, this.jwtSecret, { expiresIn: this.accessTokenExpiry });
    }
    generateRefreshToken(user) {
        return jwt.sign({ userId: user.userId, tokenVersion: user.tokenVersion }, this.jwtRefreshSecret, { expiresIn: this.refreshTokenExpiry });
    }
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.jwtRefreshSecret);
        }
        catch (err) {
            logger.error({ error: err }, 'Invalid refresh token');
            throw new Error('Invalid refresh token');
        }
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        }
        catch (err) {
            logger.error({ error: err }, 'Invalid access token');
            throw new Error('Invalid access token');
        }
    }
}
export default JwtTokenManager;
