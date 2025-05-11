import bcrypt from 'bcrypt';
import { UserModel } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import TokenManagementService from './JwtTokenManagementService.js';
import { injectable, inject } from 'tsyringe';

@injectable()
class AuthenticationService {
  constructor(@inject('UserModel') private userModel: UserModel, @inject('JwtTokenManagementService') private jwtTokenService: TokenManagementService) {}

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info({ email }, 'User login attempt');

    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      logger.warn({ email }, 'Login failed: User not found');
      throw new Error('User not found');
    }
    
    const isPasswordValid = this.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      logger.warn({ email }, 'Login failed: Invalid password');
      throw new Error('Invalid password');
    }

    const accessToken = this.jwtTokenService.generateAccessToken(user);
    const refreshToken = this.jwtTokenService.generateRefreshToken(user);

    logger.info({ userId: user.userId }, 'User successfully logged in');
    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.jwtTokenService.incrementTokenVersion(userId);
    logger.info({ userId }, 'User logged out, refresh token invalidated');
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      return bcrypt.compareSync(password, hashedPassword);
    } catch (err) {
      logger.error({ error: err }, 'Password verification failed');
      throw new Error('Password verification failed');
    }
  }

  async isAuthenticated(token: string): Promise<boolean> {
    try {
      return !!this.jwtTokenService.verifyAccessToken(token);
    } catch (err) {
      logger.error({ error: err }, 'Access token verification failed');
      throw new Error('Access token verification failed');
    }
  }
}

export default AuthenticationService;
