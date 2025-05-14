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
import nodemailer from 'nodemailer';
import PasswordResetService from '../../../../src/services/access_management/PasswordResetService.js';
import { PasswordResetManager } from '../../../../src/models/access_management/access_management.js';
const mockUserRepository = {
    getUserByEmail: jest.fn(),
    updateUserById: jest.fn(),
};
const mockUserPasswordResetModel = {
    createResetEntry: jest.fn(),
    getByToken: jest.fn(),
    invalidateToken: jest.fn(),
};
const mockTransporter = {
    sendMail: jest.fn().mockResolvedValue(true),
};
nodemailer.createTransport.mockReturnValue(mockTransporter);
let passwordResetService;
let passwordResetManager;
const mockUser = {
    user_id: '123',
    email: 'test@example.com',
    password_hash: 'hashedpassword',
    token_version: 1,
};
describe('PasswordResetService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        passwordResetService = new PasswordResetService(mockUserRepository, mockUserPasswordResetModel);
        passwordResetManager = new PasswordResetManager();
    });
    describe('requestPasswordReset', () => {
        test('should generate a reset token and send an email', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
            mockUserPasswordResetModel.createResetEntry.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockResetToken');
            yield passwordResetService.requestPasswordReset(mockUser.email);
            expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(mockUserPasswordResetModel.createResetEntry).toHaveBeenCalled();
            expect(mockTransporter.sendMail).toHaveBeenCalled();
        }));
        test('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserRepository.getUserByEmail.mockResolvedValue(null);
            yield expect(passwordResetService.requestPasswordReset(mockUser.email)).rejects.toThrow('User not found');
        }));
    });
    describe('resetPassword', () => {
        test('should reset the user password if token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt.verify.mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
            mockUserPasswordResetModel.getByToken.mockResolvedValue({
                password_reset_token_expiration: new Date(Date.now() + 10000),
            });
            yield passwordResetService.resetPassword('validToken', 'newPassword');
            expect(mockUserRepository.updateUserById).toHaveBeenCalled();
            expect(mockUserPasswordResetModel.invalidateToken).toHaveBeenCalledWith('validToken');
        }));
        test('should throw an error if token is expired or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid or expired reset token');
            });
            yield expect(passwordResetService.resetPassword('invalidToken', 'newPassword')).rejects.toThrow('Invalid or expired reset token: Error: Invalid or expired reset token');
        }));
    });
    describe('verifyResetToken', () => {
        test('should verify a valid reset token', () => {
            jwt.verify.mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
            const payload = passwordResetManager.verifyResetToken('validToken');
            expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.RESET_TOKEN_SECRET);
            expect(payload).toEqual({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
        });
        test('should throw an error for an invalid token', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            expect(() => passwordResetManager.verifyResetToken('invalidToken')).toThrow('Invalid or expired reset token: Error: Invalid token');
        });
    });
    describe('parseExpiry', () => {
        test('should correctly parse expiry time in seconds, minutes, hours, and days', () => {
            expect(passwordResetManager.parseExpiry()).toBe(30000);
            expect(passwordResetManager.parseExpiry()).toBe(600000);
            expect(passwordResetManager.parseExpiry()).toBe(7200000);
            expect(passwordResetManager.parseExpiry()).toBe(86400000);
        });
    });
});
