var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ServiceFactory from '../services/ServiceFactory.js';
import logger from '../utils/logger/Logger.js';
class AccessManagementController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ email: req.body.email }, 'User registration attempt');
                const { username, email, password } = req.body;
                const user = yield ServiceFactory.getRegistrationService().register(username, email, password);
                logger.info({ userId: user.user_id }, 'User registered successfully');
                res.status(201).json({ message: 'User registered', user });
            }
            catch (error) {
                logger.error({ error }, 'User registration failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                logger.info({ email }, 'User login attempt');
                const { accessToken, refreshToken } = yield ServiceFactory.getAuthenticationService().login(email, password);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
                logger.info({ email }, 'User logged in successfully');
                res.json({ accessToken });
            }
            catch (error) {
                logger.warn({ email: req.body.email }, 'User login failed');
                res.status(401).json({ error: error.message });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                if (!userId) {
                    throw new Error('Unauthorized');
                }
                logger.info({ userId }, 'User logout attempt');
                yield ServiceFactory.getAuthenticationService().logout(userId);
                res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                logger.info({ userId }, 'User logged out successfully');
                res.json({ message: 'Logged out' });
            }
            catch (error) {
                logger.error({ error }, 'User logout failed');
                res.status(500).json({ error: error.message });
            }
        });
    }
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    throw new Error('Refresh token missing');
                }
                logger.info({}, 'Refreshing access token');
                const newTokens = yield ServiceFactory.getJwtTokenManagementService().refreshToken(refreshToken);
                res.cookie('refreshToken', newTokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
                res.json({ accessToken: newTokens.accessToken });
            }
            catch (error) {
                logger.warn({}, 'Refresh token failed');
                res.status(403).json({ error: error.message || 'Invalid refresh token' });
            }
        });
    }
    static requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ email: req.body.email }, 'Password reset request');
                yield ServiceFactory.getPasswordResetService().requestPasswordReset(req.body.email);
                res.json({ message: 'Password reset email sent' });
            }
            catch (error) {
                logger.error({ error }, 'Password reset request failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({}, 'Resetting password');
                yield ServiceFactory.getPasswordResetService().resetPassword(req.body.token, req.body.newPassword);
                res.json({ message: 'Password reset successful' });
            }
            catch (error) {
                logger.error({ error }, 'Password reset failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
}
export default AccessManagementController;
