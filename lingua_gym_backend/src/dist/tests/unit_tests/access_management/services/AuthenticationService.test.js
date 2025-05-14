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
import AuthenticationService from '../../../../src/services/access_management/AuthenticationService.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import User from '../../../../src/models/access_management/User.js';
import JwtTokenManager from '../../../../src/models/access_management/JwtTokenManager.js';
const mockDbInstance = {};
describe('AuthenticationService', () => {
    let authenticationService;
    let mockUserModel;
    let mockJwtTokenService;
    let mockJwtTokenManager;
    beforeEach(() => {
        mockUserModel = new UserRepository(mockDbInstance);
        mockJwtTokenService = new TokenManagementService(mockUserModel);
        authenticationService = new AuthenticationService(mockUserModel, mockJwtTokenService);
        mockJwtTokenManager = new JwtTokenManager();
    });
    describe('login', () => {
        it('should return access and refresh tokens on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'password';
            const passwordHashSalt = 10;
            const user = new User({
                userId: '123',
                username: 'testUser',
                displayName: 'Test User',
                passwordHash: bcrypt.hashSync(password, passwordHashSalt),
                email: 'test@example.com',
                profilePicture: 'avatar.png',
                emailVerified: true,
                tokenVersion: 1,
            });
            mockUserModel.getUserByEmail.mockResolvedValue(user);
            mockJwtTokenManager.generateAccessToken.mockReturnValue('access');
            mockJwtTokenManager.generateRefreshToken.mockReturnValue('refresh');
            const result = yield authenticationService.login(user.email, password);
            expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
            expect(mockJwtTokenManager.generateAccessToken).toHaveBeenCalledWith(user);
            expect(mockJwtTokenManager.generateRefreshToken).toHaveBeenCalledWith(user);
            expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
        }));
        it('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserModel.getUserByEmail.mockResolvedValue(null);
            yield expect(authenticationService.login('nonexistent@example.com', 'password'))
                .rejects.toThrow('User not found');
            expect(mockUserModel.getUserByEmail).toHaveBeenCalled();
            expect(mockJwtTokenService.refreshToken).not.toHaveBeenCalled();
        }));
        it('should throw an error if the password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            const wrongPassword = 'wrongpassword';
            const password = 'password';
            const passwordHashSalt = 10;
            const user = {
                userId: '123',
                username: 'testUser',
                displayName: 'Test User',
                passwordHash: bcrypt.hashSync(password, passwordHashSalt),
                email: 'test@example.com',
                profilePicture: 'avatar.png',
                emailVerified: true,
                tokenVersion: 1,
            };
            mockUserModel.getUserByEmail.mockResolvedValue(user);
            yield expect(authenticationService.login(user.email, wrongPassword))
                .rejects.toThrow('Invalid password');
            expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
            expect(mockJwtTokenService.refreshToken).not.toHaveBeenCalled();
        }));
    });
    describe('logout', () => {
        it('should call incrementTokenVersion when logging out', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'password';
            const passwordHashSalt = 10;
            const user = new User({
                userId: '123',
                username: 'testUser',
                displayName: 'Test User',
                passwordHash: bcrypt.hashSync(password, passwordHashSalt),
                email: 'test@example.com',
                profilePicture: 'avatar.png',
                emailVerified: true,
                tokenVersion: 1,
            });
            mockJwtTokenService.incrementTokenVersion.mockResolvedValue(true);
            yield authenticationService.logout(user);
            expect(mockJwtTokenService.incrementTokenVersion).toHaveBeenCalledWith(user);
        }));
    });
});
