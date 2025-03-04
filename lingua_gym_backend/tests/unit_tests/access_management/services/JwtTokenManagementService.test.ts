import jwt from 'jsonwebtoken';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import { User } from '../../../../src/database/interfaces/DbInterfaces.js';
import Database from '../../../../src/database/config/db-connection.js';

jest.mock('jsonwebtoken');
jest.mock('../../../../src/models/UserModel');

const mockDbInstance = {} as Database;

describe('TokenManagementService', () => {
  let tokenService: TokenManagementService;
  let userModel: jest.Mocked<UserModel>;

  const mockUser: User = {
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

    userModel = new UserModel(mockDbInstance) as jest.Mocked<UserModel>;
    tokenService = new TokenManagementService(userModel);
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('mockedAccessToken');

      const token = tokenService.generateAccessToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.user_id },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(token).toBe('mockedAccessToken');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('mockedRefreshToken');

      const token = tokenService.generateRefreshToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.user_id, tokenVersion: mockUser.token_version },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(token).toBe('mockedRefreshToken');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });

      const payload = tokenService.verifyRefreshToken('validToken');

      expect(jwt.verify).toHaveBeenCalledWith('validToken', expect.any(String));
      expect(payload).toEqual({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
    });

    it('should throw an error for an invalid refresh token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => tokenService.verifyRefreshToken('invalidToken')).toThrow('Invalid refresh token');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token and return the payload', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.user_id });
  
      const payload = tokenService.verifyAccessToken('validAccessToken');
  
      expect(jwt.verify).toHaveBeenCalledWith('validAccessToken', expect.any(String));
      expect(payload).toEqual({ userId: mockUser.user_id });
    });
  
    it('should throw an error for an invalid access token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
  
      expect(() => tokenService.verifyAccessToken('invalidAccessToken')).toThrow('Invalid access token');
    });
  });  

  describe('refreshToken', () => {
    it('should refresh tokens if the refresh token is valid', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.user_id, tokenVersion: mockUser.token_version });
      userModel.getUserById.mockResolvedValue(mockUser);
      userModel.updateUserById.mockResolvedValue();

      (jwt.sign as jest.Mock).mockReturnValueOnce('newAccessToken').mockReturnValueOnce('newRefreshToken');

      const result = await tokenService.refreshToken('validRefreshToken');

      expect(userModel.getUserById).toHaveBeenCalledWith(mockUser.user_id);
      expect(userModel.updateUserById).toHaveBeenCalledWith(mockUser.user_id, { token_version: 2 });
      expect(result).toEqual({ accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' });
    });

    it('should throw an error if the refresh token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(tokenService.refreshToken('invalidRefreshToken')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw an error if the user does not exist', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'unknownUser', tokenVersion: 1 });
      userModel.getUserById.mockResolvedValue(null);

      await expect(tokenService.refreshToken('validToken')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw an error if token versions do not match', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.user_id, tokenVersion: 99 });
      userModel.getUserById.mockResolvedValue(mockUser);

      await expect(tokenService.refreshToken('validToken')).rejects.toThrow('Invalid refresh token');
    });
  });
});
