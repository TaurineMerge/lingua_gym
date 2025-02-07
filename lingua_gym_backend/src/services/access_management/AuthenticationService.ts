import bcrypt from 'bcrypt';
import UserModel from '../../models/UserModel';
import logger from '../../utils/logger/Logger';
import TokenManagementService from './JwtTokenManagementService';

class AuthenticationService {
  private userModel: UserModel;
  private jwtTokenService: TokenManagementService;

  constructor(userModel: UserModel, jwtTokenService: TokenManagementService) {
    this.userModel = userModel;
    this.jwtTokenService = jwtTokenService;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info({ email }, 'User login attempt');

    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      logger.warn({ email }, 'Login failed: User not found');
      throw new Error('User not found');
    }

    const isPasswordValid = this.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      logger.warn({ email }, 'Login failed: Invalid password');
      throw new Error('Invalid password');
    }

    const accessToken = this.jwtTokenService.generateAccessToken(user);
    const refreshToken = this.jwtTokenService.generateRefreshToken(user);

    logger.info({ userId: user.user_id }, 'User successfully logged in');
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
}

export default AuthenticationService;
