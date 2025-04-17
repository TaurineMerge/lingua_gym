import { v4 as uuidv4 } from 'uuid';
import { UserModel, UserMetadataModel } from '../../models/access_management/access_management.js';
import hashPassword from '../../utils/hash/HashPassword.js';
import logger from '../../utils/logger/Logger.js';
import { User } from '../../database/interfaces/DbInterfaces.js';
import { injectable } from 'tsyringe';
import { validateEmail, validateUsername, validatePassword } from '../../utils/validators/validators.js';

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

      try {
        await this.checkIfEmailExists(email);
        await this.checkIfUsernameExists(username);
      } catch (error) {
        logger.error({ error }, 'Registration failed: Email or username already exists');
        throw error;
      }

      if (!validatePassword(password)) {
        logger.warn({ password }, 'Registration failed: Password does not meet requirements');
        throw new Error('Password does not meet requirements');
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

    async checkIfEmailExists(email: string): Promise<boolean> { // !NOT TESTED!
      if (!validateEmail(email)) {
        logger.warn({ email }, 'Registration failed: Invalid email');
        throw new Error('Invalid email');
      }

      logger.info({ email }, 'Checking if email exists');
      const existingEmail = await this.userModel.getUserByEmail(email);
      
      if (existingEmail) {
        logger.warn({ email }, 'Registration failed: Email already exists');
      } else {
        logger.info({ email }, 'Email does not exist');
      }

      return !!existingEmail;
    }

    async checkIfUsernameExists(username: string): Promise<boolean> { // !NOT TESTED!
      if (!validateUsername(username)) {
        logger.warn({ username }, 'Registration failed: Invalid username');
        throw new Error('Invalid username');
      }
      
      logger.info({ username }, 'Checking if username exists');
      const existingUsername = await this.userModel.getUserByUsername(username);
      
      if (existingUsername) {
        logger.warn({ username }, 'Registration failed: Username already exists');
      } else {
        logger.info({ username }, 'Username does not exist');
      }

      return !!existingUsername;
    }
}

export default RegistrationService;