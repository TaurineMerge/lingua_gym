import bcrypt from 'bcrypt';
import AuthenticationService from '../../../../src/services/access_management/AuthenticationService.js';
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import Database from '../../../../src/database/config/db-connection.js';

jest.mock('../../../../src/models/UserModel');
jest.mock('../../../../src/services/access_management/JwtTokenManagementService');

const mockDbInstance = {} as Database;

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let mockUserModel: jest.Mocked<UserModel>;
  let mockJwtTokenService: jest.Mocked<TokenManagementService>;

  beforeEach(() => {
    mockUserModel = new UserModel(mockDbInstance) as jest.Mocked<UserModel>
    mockJwtTokenService = new TokenManagementService(mockUserModel) as jest.Mocked<TokenManagementService>;
    authenticationService = new AuthenticationService(mockUserModel, mockJwtTokenService);
  });

  describe('login', () => {
    it('should return access and refresh tokens on successful login', async () => {
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
    
      const result = await authenticationService.login(user.email, password);
    
      expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(mockJwtTokenService.generateAccessToken).toHaveBeenCalledWith(user);
      expect(mockJwtTokenService.generateRefreshToken).toHaveBeenCalledWith(user);
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

      await expect(authenticationService.login(user.email, wrongPassword))
        .rejects.toThrow('Invalid password');

      expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(mockJwtTokenService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call incrementTokenVersion when logging out', async () => {
      mockJwtTokenService.incrementTokenVersion.mockResolvedValue();

      await authenticationService.logout('123');

      expect(mockJwtTokenService.incrementTokenVersion).toHaveBeenCalledWith('123');
    });
  });
});
