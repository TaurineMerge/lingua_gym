import { v4 as uuidv4 } from 'uuid';
import UserModel from '../../models/UserModel';
import UserMetadataModel from '../../models/UserMetadataModel';
import hashPassword from '../../utils/hash/HashPassword';
import logger from '../../utils/logger/Logger';
import User from '../../../database/interfaces/User/User';

class RegistrationService {
    private userModel: UserModel;
    private userMetadataModel: UserMetadataModel;
  
    constructor(userModel: UserModel, userMetadataModel: UserMetadataModel) {
      this.userModel = userModel;
      this.userMetadataModel = userMetadataModel;
    }
    
    async register(username: string, email: string, password: string): Promise<User> {
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
        user_id: userId,
        username,
        email,
        password_hash: hashedPassword,
        token_version: 0,
        email_verified: false
      }

      await this.userModel.createUser(user);
    
      const signupDate = new Date();
      await this.userMetadataModel.createUserMetadata({
        user_id: userId,
        signup_date: signupDate,
      });
    
      logger.info({ userId, username, email }, 'User successfully registered');
      return user;
    }
}

export default RegistrationService;