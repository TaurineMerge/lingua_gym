import Database from '../../../database/config/db-connection';
import UserPasswordResetModel from '../../models/UserPasswordResetModel';
import UserModel from '../../models/UserModel';
import User from '../../../database/interfaces/User/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

class PasswordResetService {
  private userModel: UserModel;
  private userPasswordResetModel: UserPasswordResetModel;
  private jwtSecret: string;
  private tokenExpiry: string;
  private db: Database;

  constructor(dbInstance: Database) {
    this.db = dbInstance;
    this.userModel = new UserModel(dbInstance);
    this.userPasswordResetModel = new UserPasswordResetModel(dbInstance);
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.tokenExpiry = process.env.RESET_TOKEN_EXPIRY || '';
  }

  private async sendResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  
    await transporter.sendMail({
      from: '"Support Team" <support@example.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = this.generateResetToken(user);

    await this.userPasswordResetModel.createResetEntry({
      user_id: user.user_id,
      password_reset_token: resetToken,
      password_reset_token_expiration: new Date(Date.now() + this.parseExpiry(this.tokenExpiry)),
    });

    await this.sendResetEmail(email, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const payload = this.verifyResetToken(resetToken);
    const resetEntry = await this.userPasswordResetModel.getByToken(resetToken);

    if (!resetEntry || resetEntry.password_reset_token_expiration < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    await this.userModel.updateUser(payload.userId, {
      password_hash: this.hashPassword(newPassword),
      token_version: (payload.tokenVersion || 0) + 1,
    });

    await this.userPasswordResetModel.invalidateToken(resetToken);
  }

  private generateResetToken(user: User): string {
    return jwt.sign(
      { userId: user.user_id, tokenVersion: user.token_version },
      this.jwtSecret,
      { expiresIn: this.tokenExpiry },
    );
  }

  private verifyResetToken(token: string): { userId: string; tokenVersion: number } {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: string; tokenVersion: number };
    } catch (err) {
      throw new Error(`Invalid reset token: ${err}`);
    }
  }

  private hashPassword(password: string): string {
    return `hashed_${password}`;
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error('Invalid token expiry format');
    const [, value, unit] = match;
    const multipliers: Record<string, number> = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return parseInt(value, 10) * (multipliers[unit] || 0);
  }
}

export default PasswordResetService;
