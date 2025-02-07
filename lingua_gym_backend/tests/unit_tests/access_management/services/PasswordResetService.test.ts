import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import PasswordResetService from '../../../../src/services/access_management/PasswordResetService';
import UserModel from '../../../../src/models/UserModel';
import UserPasswordResetModel from '../../../../src/models/UserPasswordResetModel';

jest.mock('jsonwebtoken');
jest.mock('nodemailer');

const mockUserModel = {
  getUserByEmail: jest.fn(),
  updateUser: jest.fn(),
};

const mockUserPasswordResetModel = {
  createResetEntry: jest.fn(),
  getByToken: jest.fn(),
  invalidateToken: jest.fn(),
};

const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue(true),
};

(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

let passwordResetService: PasswordResetService;

const mockUser = {
  user_id: '123',
  email: 'test@example.com',
  password_hash: 'hashedpassword',
  token_version: 1,
};

describe('PasswordResetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    passwordResetService = new PasswordResetService(
      mockUserModel as unknown as UserModel,
      mockUserPasswordResetModel as unknown as UserPasswordResetModel
    );
  });

  describe('requestPasswordReset', () => {
    it('should generate a reset token and send an email', async () => {
      mockUserModel.getUserByEmail.mockResolvedValue(mockUser);
      mockUserPasswordResetModel.createResetEntry.mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockResetToken');

      await passwordResetService.requestPasswordReset(mockUser.email);

      expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockUserPasswordResetModel.createResetEntry).toHaveBeenCalled();
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should throw an error if the user is not found', async () => {
      mockUserModel.getUserByEmail.mockResolvedValue(null);

      await expect(passwordResetService.requestPasswordReset(mockUser.email)).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset the user password if token is valid', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
      mockUserPasswordResetModel.getByToken.mockResolvedValue({
        password_reset_token_expiration: new Date(Date.now() + 10000),
      });

      await passwordResetService.resetPassword('validToken', 'newPassword');

      expect(mockUserModel.updateUser).toHaveBeenCalled();
      expect(mockUserPasswordResetModel.invalidateToken).toHaveBeenCalledWith('validToken');
    });

    it('should throw an error if token is expired or invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid or expired reset token');
      });

      await expect(passwordResetService.resetPassword('invalidToken', 'newPassword')).rejects.toThrow(
        'Invalid or expired reset token: Error: Invalid reset token'
      );
    });
  });

  describe('verifyResetToken', () => {
    it('should verify a valid reset token', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });

      const payload = passwordResetService['verifyResetToken']('validToken');

      expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.RESET_TOKEN_SECRET);
      expect(payload).toEqual({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
    });

    it('should throw an error for an invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => passwordResetService['verifyResetToken']('invalidToken')).toThrow('Invalid or expired reset token: Error: Invalid token');
    });
  });

  describe('parseExpiry', () => {
    it('should correctly parse expiry time in seconds, minutes, hours, and days', () => {
      expect(passwordResetService['parseExpiry']('30s')).toBe(30000);
      expect(passwordResetService['parseExpiry']('10m')).toBe(600000);
      expect(passwordResetService['parseExpiry']('2h')).toBe(7200000);
      expect(passwordResetService['parseExpiry']('1d')).toBe(86400000);
    });

    it('should throw an error for invalid format', () => {
      expect(() => passwordResetService['parseExpiry']('invalid')).toThrow('Invalid token expiry format');
    });
  });
});
