import { v4 as uuidv4 } from 'uuid';
import { UserModel, UserMetadataModel } from '../../models/access_management/access_management.js';
import hashPassword from '../../utils/hash/HashPassword.js';
import logger from '../../utils/logger/Logger.js';
import { User } from '../../database/interfaces/DbInterfaces.js';
import { injectable } from 'tsyringe';

@injectable()
class RegistrationService {
    private userModel: UserModel;
    private userMetadataModel: UserMetadataModel;
  
    constructor(userModel: UserModel, userMetadataModel: UserMetadataModel) {
      this.userModel = userModel;
      this.userMetadataModel = userMetadataModel;
    }
    
    async register(username: string, email: string, password: string, displayName?: string): Promise<User> {
      logger.info({ username, email }, 'User registration started');

      const existingEmail = await this.userModel.getUserByEmail(email);
      if (existingEmail) {
        logger.warn({ email }, 'Registration failed: Email already exists');
        throw new Error('Email already exists');
      }

      const existingUsername = await this.userModel.getUserByUsername(username);
      if (existingUsername) {
        logger.warn({ username }, 'Registration failed: Username already exists');
        throw new Error('Username already exists');
      }

      const hashedPassword = hashPassword(password);
      const userId = uuidv4();
      
      const user: User = {
        userId: userId,
        username,
        displayName,
        email,
        passwordHash: hashedPassword,
        tokenVersion: 0,
        emailVerified: false
      }

      await this.userModel.createUser(user);
    
      const signupDate = new Date();
      await this.userMetadataModel.createUserMetadata({
        userId: userId,
        signupDate: signupDate,
      });
    
      logger.info({ userId, username, email }, 'User successfully registered');
      return user;
    }
}

export default RegistrationService;