import bcrypt from 'bcrypt';
import AuthenticationService from '../../../../src/services/access_management/AuthenticationService.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import Database from '../../../../src/database/config/db-connection.js';
import User from '../../../../src/models/access_management/User.js';
import JwtTokenManager from '../../../../src/models/access_management/JwtTokenManager.js';

const mockDbInstance = {} as Database;

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let mockUserModel: jest.Mocked<UserRepository>;
  let mockJwtTokenService: jest.Mocked<TokenManagementService>;
  let mockJwtTokenManager: jest.Mocked<JwtTokenManager>;

  beforeEach(() => {
    mockUserModel = new UserRepository(mockDbInstance) as jest.Mocked<UserRepository>
    mockJwtTokenService = new TokenManagementService(mockUserModel) as jest.Mocked<TokenManagementService>;
    authenticationService = new AuthenticationService(mockUserModel, mockJwtTokenService);
    mockJwtTokenManager = new JwtTokenManager() as jest.Mocked<JwtTokenManager>;
  });

  describe('login', () => {
    it('should return access and refresh tokens on successful login', async () => {
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
    
      const result = await authenticationService.login(user.email, password);
    
      expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(mockJwtTokenManager.generateAccessToken).toHaveBeenCalledWith(user);
      expect(mockJwtTokenManager.generateRefreshToken).toHaveBeenCalledWith(user);
      expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    });
    

    it('should throw an error if the user is not found', async () => {
        mockUserModel.getUserByEmail.mockResolvedValue(null);

      await expect(authenticationService.login('nonexistent@example.com', 'password'))
        .rejects.toThrow('User not found');

      expect(mockUserModel.getUserByEmail).toHaveBeenCalled();
      expect(mockJwtTokenService.refreshToken).not.toHaveBeenCalled();
    });

    it('should throw an error if the password is incorrect', async () => {
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

      await expect(authenticationService.login(user.email, wrongPassword))
        .rejects.toThrow('Invalid password');

      expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(mockJwtTokenService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call incrementTokenVersion when logging out', async () => {
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

      await authenticationService.logout(user);

      expect(mockJwtTokenService.incrementTokenVersion).toHaveBeenCalledWith(user);
    });
  });
});
