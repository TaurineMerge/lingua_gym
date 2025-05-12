import { UserRepository, UserMetadataRepository } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import { User } from '../../models/access_management/access_management.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class RegistrationService {
    constructor(@inject('UserRepository') private userRepository: UserRepository, @inject('UserMetadataModel') private userMetadataRepository: UserMetadataRepository) {}
    
    async register(username: string, email: string, password: string, displayName?: string): Promise<User> {
      logger.info({ username, email }, 'User registration started');

      try {
        await this.checkIfEmailExists(email);
        await this.checkIfUsernameExists(username);
      } catch (error) {
        logger.error({ error }, 'Registration failed: Email or username already exists');
        throw error;
      }

      const user = new User({ username, password, email, displayName });
      await this.userRepository.createUser(user);
    
      const signupDate = new Date();
      await this.userMetadataRepository.createUserMetadata({
        userId: user.userId,
        signupDate: signupDate,
      });
    
      logger.info(user.userId, user.username, user.email, 'User successfully registered');
      return user;
    }

    async checkIfEmailExists(email: string): Promise<boolean> { // !NOT TESTED!
      logger.info({ email }, 'Checking if email exists');
      const existingEmail = await this.userRepository.getUserByEmail(email);
      
      if (existingEmail) {
        logger.warn({ email }, 'Registration failed: Email already exists');
      } else {
        logger.info({ email }, 'Email does not exist');
      }

      return !!existingEmail;
    }

    async checkIfUsernameExists(username: string): Promise<boolean> { // !NOT TESTED!
      logger.info({ username }, 'Checking if username exists');
      const existingUsername = await this.userRepository.getUserByUsername(username);
      
      if (existingUsername) {
        logger.warn({ username }, 'Registration failed: Username already exists');
      } else {
        logger.info({ username }, 'Username does not exist');
      }

      return !!existingUsername;
    }
}

export default RegistrationService;