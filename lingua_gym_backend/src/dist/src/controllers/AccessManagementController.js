var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import container from '../di/Container.js';
import logger from '../utils/logger/Logger.js';
class AccessManagementController {
    static setTokenCookies(res, refreshToken, accessToken) {
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken, cookieOptions);
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ email: req.body.email }, 'User registration attempt');
                const { username, email, password, displayName } = req.body;
                const registrationService = container.resolve('RegistrationService');
                const user = yield registrationService.register(username, email, password, displayName);
                const authService = container.resolve('AuthenticationService');
                const { accessToken, refreshToken } = yield authService.login(email, password);
                AccessManagementController.setTokenCookies(res, refreshToken, accessToken);
                logger.info({ userId: user.userId }, 'User registered successfully');
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
                const authService = container.resolve('AuthenticationService');
                const { accessToken, refreshToken } = yield authService.login(email, password);
                AccessManagementController.setTokenCookies(res, refreshToken, accessToken);
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
                const { userId } = req.body;
                if (!userId)
                    throw new Error('Unauthorized');
                logger.info({ userId }, 'User logout attempt');
                const authService = container.resolve('AuthenticationService');
                yield authService.logout(userId);
                res.clearCookie('refreshToken');
                res.clearCookie('accessToken');
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
                const { refreshToken } = req.cookies;
                if (!refreshToken)
                    throw new Error('Refresh token missing');
                const jwtService = container.resolve('JwtTokenManagementService');
                const { accessToken, refreshToken: newRefresh } = yield jwtService.refreshToken(refreshToken);
                this.setTokenCookies(res, newRefresh, accessToken);
                logger.info({}, 'Access token refreshed');
                res.json({ accessToken });
            }
            catch (error) {
                logger.warn({}, 'Refresh token failed');
                res.status(403).json({ error: error.message });
            }
        });
    }
    static requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                logger.info({ email }, 'Password reset request');
                if (!email)
                    throw new Error('Email is required');
                const registrationService = container.resolve('RegistrationService');
                const isEmailExists = yield registrationService.checkIfEmailExists(email);
                if (!isEmailExists) {
                    throw new Error('Email does not exist');
                }
                const resetService = container.resolve('PasswordResetService');
                yield resetService.requestPasswordReset(email);
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
                const { token, newPassword } = req.body;
                const resetService = container.resolve('PasswordResetService');
                yield resetService.resetPassword(token, newPassword);
                logger.info({}, 'Password reset successful');
                res.json({ message: 'Password reset successful' });
            }
            catch (error) {
                logger.error({ error }, 'Password reset failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static checkIfEmailExists(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const registrationService = container.resolve('RegistrationService');
                const exists = yield registrationService.checkIfEmailExists(email);
                res.json({ available: !exists });
            }
            catch (error) {
                logger.error({ error }, 'Check if email exists failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static checkIfUsernameExists(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.body;
                const registrationService = container.resolve('RegistrationService');
                const exists = yield registrationService.checkIfUsernameExists(username);
                res.json({ available: !exists });
            }
            catch (error) {
                logger.error({ error }, 'Check if username exists failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static checkIfAuthenticated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = req.cookies;
                const authService = container.resolve('AuthenticationService');
                const authenticated = accessToken
                    ? yield authService.isAuthenticated(accessToken)
                    : false;
                res.json({ authenticated });
            }
            catch (error) {
                logger.error({ error }, 'Check if authenticated failed');
                res.status(400).json({ error: error.message, authenticated: false });
            }
        });
    }
}
export default AccessManagementController;
