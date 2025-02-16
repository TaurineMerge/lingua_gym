var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import logger from '../../utils/logger/Logger.js';
class AuthenticationService {
    constructor(userModel, jwtTokenService) {
        this.userModel = userModel;
        this.jwtTokenService = jwtTokenService;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ email }, 'User login attempt');
            const user = yield this.userModel.getUserByEmail(email);
            if (!user) {
                logger.warn({ email }, 'Login failed: User not found');
                throw new Error('User not found');
            }
            const isPasswordValid = this.verifyPassword(password, user.password_hash);
            if (!isPasswordValid) {
                logger.warn({ email }, 'Login failed: Invalid password');
                throw new Error('Invalid password');
            }
            const accessToken = this.jwtTokenService.generateAccessToken(user);
            const refreshToken = this.jwtTokenService.generateRefreshToken(user);
            logger.info({ userId: user.user_id }, 'User successfully logged in');
            return { accessToken, refreshToken };
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.jwtTokenService.incrementTokenVersion(userId);
            logger.info({ userId }, 'User logged out, refresh token invalidated');
        });
    }
    verifyPassword(password, hashedPassword) {
        try {
            return bcrypt.compareSync(password, hashedPassword);
        }
        catch (err) {
            logger.error({ error: err }, 'Password verification failed');
            throw new Error('Password verification failed');
        }
    }
}
export default AuthenticationService;
