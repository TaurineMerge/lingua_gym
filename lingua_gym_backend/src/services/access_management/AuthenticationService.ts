import { JwtTokenManager, User } from '../../models/access_management/access_management.js';
import { UserRepository } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import TokenManagementService from './JwtTokenManagementService.js';
import { injectable, inject } from 'tsyringe';

@injectable()
class AuthenticationService {
  private jwtTokenManager: JwtTokenManager;
  constructor(@inject('UserRepository') private userRepository: UserRepository, @inject('JwtTokenManagementService') private jwtTokenService: TokenManagementService) {
    this.jwtTokenManager = new JwtTokenManager();
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      logger.info({ email }, 'User login attempt');

      const user = new User(await this.userRepository.getUserByEmail(email));
      
      user.verifyPasswordHash(password);

      const accessToken = this.jwtTokenManager.generateAccessToken(user);
      const refreshToken = this.jwtTokenManager.generateRefreshToken(user);

      logger.info({ userId: user.userId }, 'User successfully logged in');
      return { accessToken, refreshToken };
    } catch (err) {
      logger.error('User login failed: ', { error: err });
      throw new Error('User login failed');
    }
  }

  async logout(user: User): Promise<void> {
    try {
      await this.jwtTokenService.incrementTokenVersion(user);
      logger.info( user.userId, 'User logged out, refresh token invalidated');
    } catch (err) {
      logger.error('User logout failed: ', { error: err });
      throw new Error('User logout failed');
    } 
  }

  async isAuthenticated(token: string): Promise<boolean> {
    try {
      return !!this.jwtTokenManager.verifyAccessToken(token);
    } catch (err) {
      logger.error('Access token verification failed: ', { error: err });
      throw new Error('Access token verification failed');
    }
  }
}

export default AuthenticationService;
