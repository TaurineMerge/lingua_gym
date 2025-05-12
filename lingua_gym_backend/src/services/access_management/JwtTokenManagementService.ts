import { UserRepository } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
import { injectable, inject } from 'tsyringe';
import { JwtTokenManager, User } from '../../models/access_management/access_management.js';

@injectable()
class TokenManagementService {
  private jwtTokenManager: JwtTokenManager;
  
  constructor(@inject('UserRepository') private userRepository: UserRepository) {
    this.jwtTokenManager = new JwtTokenManager();
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info('Refresh token request received');
    
    const payload = this.jwtTokenManager.verifyRefreshToken(refreshToken);
    const user = new User(await this.userRepository.getUserById(payload.userId));

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      logger.warn({ userId: payload.userId }, 'Invalid refresh token');
      throw new Error('Invalid refresh token');
    }

    await this.incrementTokenVersion(user);

    const newAccessToken = this.jwtTokenManager.generateAccessToken(user);
    const newRefreshToken = this.jwtTokenManager.generateRefreshToken(user);

    logger.info({ userId: user.userId }, 'Tokens refreshed');
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async incrementTokenVersion(user: User): Promise<boolean> {
    try {
      logger.info(user.userId, 'Incrementing token version');
      return await this.userRepository.updateUserById(user.userId, { tokenVersion: user.tokenVersion + 1 });
    } catch (error) {
      logger.error(user.userId, { error }, 'Failed to increment token version');
      throw new Error('Could not update token version');
    }
  }
}

export default TokenManagementService;
