import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import Database from '../../../database/config/db-connection';
import UserModel from '../../models/UserModel';
import UserMetadataModel from '../../models/UserMetadataModel';
import User from '../../../database/interfaces/User/User';

class AuthenticationService {
  private userModel: UserModel;
  private userMetadataModel: UserMetadataModel;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;
  private db: Database;

  constructor(dbInstance: Database) {
    this.db = dbInstance;
    this.userModel = new UserModel(dbInstance);
    this.userMetadataModel = new UserMetadataModel(dbInstance);
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || '';
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '30m';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
  }

  async register(username: string, email: string, password: string, emailVerified: boolean): Promise<void> {
    const existingEmail = await this.userModel.getUserByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = await this.userModel.getUserByUsername(username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const hashedPassword = this.hashPassword(password);
    const userId = uuidv4();

    await this.userModel.createUser({
      user_id: userId,
      username,
      email,
      password_hash: hashedPassword,
      token_version: 0,
      email_verified: emailVerified
    });

    const signupDate = new Date();
    await this.userMetadataModel.createUserMetadata({
      user_id: userId,
      signup_date: signupDate,
    });
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = this.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await this.userModel.getUserById(payload.userId);
    if (!user || user.token_version !== payload.tokenVersion) {
      throw new Error('Invalid refresh token');
    }

    return this.generateAccessToken(user);
  }

  private generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.user_id },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.user_id, tokenVersion: user.token_version },
      this.jwtRefreshSecret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  private verifyRefreshToken(token: string): { userId: string; tokenVersion: number } {
    try {
      return jwt.verify(token, this.jwtRefreshSecret) as { userId: string; tokenVersion: number };
    } catch (err) {
      throw new Error(`Invalid refresh token: ${err}`);
    }
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

export default AuthenticationService;
