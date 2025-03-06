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
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
jest.mock('../../../../src/models/UserModel');
jest.mock('../../../../src/services/access_management/JwtTokenManagementService');
const mockDbInstance = {};
describe('AuthenticationService', () => {
    let authenticationService;
    let mockUserModel;
    let mockJwtTokenService;
    beforeEach(() => {
        mockUserModel = new UserModel(mockDbInstance);
        mockJwtTokenService = new TokenManagementService(mockUserModel);
        authenticationService = new AuthenticationService(mockUserModel, mockJwtTokenService);
    });
    describe('login', () => {
        it('should return access and refresh tokens on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'password';
            const passwordHashSalt = 10;
            const user = {
                user_id: '123',
                username: 'testUser',
                display_name: 'Test User',
                password_hash: bcrypt.hashSync(password, passwordHashSalt),
                email: 'test@example.com',
                profile_picture: 'avatar.png',
                email_verified: true,
                token_version: 1,
            };
            mockUserModel.getUserByEmail.mockResolvedValue(user);
            mockJwtTokenService.generateAccessToken.mockReturnValue('access');
            mockJwtTokenService.generateRefreshToken.mockReturnValue('refresh');
            const result = yield authenticationService.login(user.email, password);
            expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
            expect(mockJwtTokenService.generateAccessToken).toHaveBeenCalledWith(user);
            expect(mockJwtTokenService.generateRefreshToken).toHaveBeenCalledWith(user);
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
                user_id: '123',
                username: 'testUser',
                display_name: 'Test User',
                password_hash: bcrypt.hashSync(password, passwordHashSalt),
                email: 'test@example.com',
                profile_picture: 'avatar.png',
                email_verified: true,
                token_version: 1,
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
            mockJwtTokenService.incrementTokenVersion.mockResolvedValue();
            yield authenticationService.logout('123');
            expect(mockJwtTokenService.incrementTokenVersion).toHaveBeenCalledWith('123');
        }));
    });
});
