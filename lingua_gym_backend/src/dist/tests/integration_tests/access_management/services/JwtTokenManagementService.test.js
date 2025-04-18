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
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import 'dotenv/config';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { clearDatabase, closeDatabase, setupTestModelContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';
let userModel;
let tokenService;
let registrationService;
describe('TokenManagementService - Integration Tests', () => {
    let testUser;
    let refreshToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        const modelContainer = yield setupTestModelContainer();
        userModel = modelContainer.resolve(UserModel);
        const serviceContainer = yield setupTestServiceContainer();
        tokenService = serviceContainer.resolve(TokenManagementService);
        registrationService = serviceContainer.resolve(RegistrationService);
        yield registrationService.register('testuser', 'test@example.com', 'password123');
        const user = yield userModel.getUserByEmail('test@example.com');
        if (!user) {
            throw new Error('User not found');
        }
        testUser = user;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        yield closeDatabase();
    }));
    it('should generate and verify an access token', () => {
        const token = tokenService.generateAccessToken(testUser);
        expect(typeof token).toBe('string');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded).toHaveProperty('userId', testUser.userId);
        expect(decoded).toHaveProperty('exp', expect.any(Number));
    });
    it('should generate and verify a refresh token', () => {
        refreshToken = tokenService.generateRefreshToken(testUser);
        expect(typeof refreshToken).toBe('string');
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        expect(decoded).toHaveProperty('userId', testUser.userId);
        expect(decoded).toHaveProperty('tokenVersion', testUser.tokenVersion);
    });
    it('should refresh tokens using a valid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        refreshToken = tokenService.generateRefreshToken(testUser);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = yield tokenService.refreshToken(refreshToken);
        expect(refreshToken).not.toBe(newRefreshToken);
        expect(typeof newAccessToken).toBe('string');
        expect(typeof newRefreshToken).toBe('string');
        const updatedUser = yield userModel.getUserById(testUser.userId);
        expect(updatedUser.tokenVersion).toBe(testUser.tokenVersion + 1);
        testUser = updatedUser;
    }));
    it('should fail on invalid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(tokenService.refreshToken('invalid_token')).rejects.toThrow('Invalid refresh token');
    }));
    it('should increment token version on logout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield tokenService.incrementTokenVersion(testUser.userId);
        const updatedUser = yield userModel.getUserById(testUser.userId);
        expect(updatedUser.tokenVersion).toBe(testUser.tokenVersion + 1);
    }));
});
