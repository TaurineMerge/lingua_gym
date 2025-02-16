var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger/Logger';
import 'dotenv/config';
class TokenManagementService {
    constructor(userModel) {
        this.userModel = userModel;
        this.jwtSecret = process.env.JWT_SECRET || '';
        this.jwtRefreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET || '';
        this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '30m';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Refresh token request received');
            const payload = this.verifyRefreshToken(refreshToken);
            const user = yield this.userModel.getUserById(payload.userId);
            if (!user || user.token_version !== payload.tokenVersion) {
                logger.warn({ userId: payload.userId }, 'Invalid refresh token');
                throw new Error('Invalid refresh token');
            }
            yield this.incrementTokenVersion(user.user_id);
            const updatedUser = yield this.userModel.getUserById(user.user_id);
            const newAccessToken = this.generateAccessToken(updatedUser);
            const newRefreshToken = this.generateRefreshToken(updatedUser);
            logger.info({ userId: user.user_id }, 'Tokens refreshed');
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
    generateAccessToken(user) {
        return jwt.sign({ userId: user.user_id }, this.jwtSecret, { expiresIn: this.accessTokenExpiry });
    }
    generateRefreshToken(user) {
        return jwt.sign({ userId: user.user_id, tokenVersion: user.token_version }, this.jwtRefreshSecret, { expiresIn: this.refreshTokenExpiry });
    }
    incrementTokenVersion(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.getUserById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                yield this.userModel.updateUserById(userId, { token_version: user.token_version + 1 });
                logger.info({ userId }, 'Token version incremented');
            }
            catch (error) {
                logger.error({ userId, error }, 'Failed to increment token version');
                throw new Error('Could not update token version');
            }
        });
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
export default TokenManagementService;
