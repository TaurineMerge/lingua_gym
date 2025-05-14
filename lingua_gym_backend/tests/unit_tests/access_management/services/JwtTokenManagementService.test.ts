import jwt from 'jsonwebtoken';
import { JwtTokenManagementService as TokenManagementService } from '../../../../src/services/access_management/access_management.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import Database from '../../../../src/database/config/db-connection.js';
import { JwtTokenManager, User } from '../../../../src/models/access_management/access_management.js';

const mockDbInstance = {} as Database;

describe('TokenManagementService', () => {
  let tokenService: TokenManagementService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtTokenManager: JwtTokenManager;

  const mockUser = new User({
    userId: '123',
    username: 'testUser',
    displayName: 'Test User',
    passwordHash: 'hashed_password',
    email: 'test@example.com',
    profilePicture: 'avatar.png',
    emailVerified: false,
    tokenVersion: 1,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    userRepository = new UserRepository(mockDbInstance) as jest.Mocked<UserRepository>;
    tokenService = new TokenManagementService(userRepository);
    jwtTokenManager = new JwtTokenManager();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('mockedAccessToken');

      const token = jwtTokenManager.generateAccessToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.userId },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(token).toBe('mockedAccessToken');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('mockedRefreshToken');

      const token = jwtTokenManager.generateRefreshToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.userId, tokenVersion: mockUser.tokenVersion },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(token).toBe('mockedRefreshToken');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.userId, tokenVersion: mockUser.tokenVersion });

      const payload = jwtTokenManager.verifyRefreshToken('validToken');

      expect(jwt.verify).toHaveBeenCalledWith('validToken', expect.any(String));
      expect(payload).toEqual({ userId: mockUser.userId, tokenVersion: mockUser.tokenVersion });
    });

    it('should throw an error for an invalid refresh token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => jwtTokenManager.verifyRefreshToken('invalidToken')).toThrow('Invalid refresh token');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token and return the payload', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.userId });
  
      const payload = jwtTokenManager.verifyAccessToken('validAccessToken');
  
      expect(jwt.verify).toHaveBeenCalledWith('validAccessToken', expect.any(String));
      expect(payload).toEqual({ userId: mockUser.userId });
    });
  
    it('should throw an error for an invalid access token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
  
      expect(() => jwtTokenManager.verifyAccessToken('invalidAccessToken')).toThrow('Invalid access token');
    });
  });  

  describe('refreshToken', () => {
    it('should refresh tokens if the refresh token is valid', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.userId, tokenVersion: mockUser.tokenVersion });
      userRepository.getUserById.mockResolvedValue(mockUser);
      userRepository.updateUserById.mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValueOnce('newAccessToken').mockReturnValueOnce('newRefreshToken');

      const result = await tokenService.refreshToken('validRefreshToken');

      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.userId);
      expect(userRepository.updateUserById).toHaveBeenCalledWith(mockUser.userId, { tokenVersion: 2 });
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
      userRepository.getUserById.mockResolvedValue(null);

      await expect(tokenService.refreshToken('validToken')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw an error if token versions do not match', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.userId, tokenVersion: 99 });
      userRepository.getUserById.mockResolvedValue(mockUser);

      await expect(tokenService.refreshToken('validToken')).rejects.toThrow('Invalid refresh token');
    });
  });
});
