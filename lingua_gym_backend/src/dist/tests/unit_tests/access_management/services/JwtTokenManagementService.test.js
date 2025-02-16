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
import UserModel from '../../../../src/models/access_management/UserModel.js';
jest.mock('jsonwebtoken');
jest.mock('../../../../src/models/UserModel');
const mockDbInstance = {};
describe('TokenManagementService', () => {
    let tokenService;
    let userModel;
    const mockUser = {
        user_id: '123',
        username: 'testUser',
        display_name: 'Test User',
        password_hash: 'hashed_password',
        email: 'test@example.com',
        profile_picture: 'avatar.png',
        email_verified: false,
        token_version: 1,
    };
    beforeEach(() => {
        jest.clearAllMocks();
        userModel = new UserModel(mockDbInstance);
        tokenService = new TokenManagementService(userModel);
    });
    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            jwt.sign.mockReturnValue('mockedAccessToken');
            const token = tokenService.generateAccessToken(mockUser);
            expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.user_id }, expect.any(String), { expiresIn: expect.any(String) });
            expect(token).toBe('mockedAccessToken');
        });
    });
    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            jwt.sign.mockReturnValue('mockedRefreshToken');
            const token = tokenService.generateRefreshToken(mockUser);
            expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.user_id, tokenVersion: mockUser.token_version }, expect.any(String), { expiresIn: expect.any(String) });
            expect(token).toBe('mockedRefreshToken');
        });
    });
    describe('verifyRefreshToken', () => {
        it('should verify a valid refresh token', () => {
            jwt.verify.mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
            const payload = tokenService.verifyRefreshToken('validToken');
            expect(jwt.verify).toHaveBeenCalledWith('validToken', expect.any(String));
            expect(payload).toEqual({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
        });
        it('should throw an error for an invalid refresh token', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            expect(() => tokenService.verifyRefreshToken('invalidToken')).toThrow('Invalid refresh token');
        });
    });
    describe('verifyAccessToken', () => {
        it('should verify a valid access token and return the payload', () => {
            jwt.verify.mockReturnValue({ userId: mockUser.user_id });
            const payload = tokenService.verifyAccessToken('validAccessToken');
            expect(jwt.verify).toHaveBeenCalledWith('validAccessToken', expect.any(String));
            expect(payload).toEqual({ userId: mockUser.user_id });
        });
        it('should throw an error for an invalid access token', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            expect(() => tokenService.verifyAccessToken('invalidAccessToken')).toThrow('Invalid access token');
        });
    });
    describe('refreshToken', () => {
        it('should refresh tokens if the refresh token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt.verify.mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
            userModel.getUserById.mockResolvedValue(mockUser);
            userModel.updateUserById.mockResolvedValue();
            jwt.sign.mockReturnValueOnce('newAccessToken').mockReturnValueOnce('newRefreshToken');
            const result = yield tokenService.refreshToken('validRefreshToken');
            expect(userModel.getUserById).toHaveBeenCalledWith(mockUser.user_id);
            expect(userModel.updateUserById).toHaveBeenCalledWith(mockUser.user_id, { token_version: 2 });
            expect(result).toEqual({ accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' });
        }));
        it('should throw an error if the refresh token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            yield expect(tokenService.refreshToken('invalidRefreshToken')).rejects.toThrow('Invalid refresh token');
        }));
        it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt.verify.mockReturnValue({ userId: 'unknownUser', tokenVersion: 1 });
            userModel.getUserById.mockResolvedValue(null);
            yield expect(tokenService.refreshToken('validToken')).rejects.toThrow('Invalid refresh token');
        }));
        it('should throw an error if token versions do not match', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt.verify.mockReturnValue({ userId: mockUser.user_id, tokenVersion: 99 });
            userModel.getUserById.mockResolvedValue(mockUser);
            yield expect(tokenService.refreshToken('validToken')).rejects.toThrow('Invalid refresh token');
        }));
    });
});
