import UserPasswordResetModel from '../../models/UserPasswordResetModel';
import UserModel from '../../models/UserModel';
import User from '../../../database/interfaces/User/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import hashPassword from '../../utils/hash/HashPassword';
import logger from '../../utils/logger/Logger';
import 'dotenv/config';

class PasswordResetService {
  private userModel: UserModel;
  private userPasswordResetModel: UserPasswordResetModel;
  private resetSecret: string;
  private tokenExpiry: string;

  constructor(userModel: UserModel, userPasswordResetModel: UserPasswordResetModel) {
    this.userModel = userModel;
    this.userPasswordResetModel = userPasswordResetModel;
    this.resetSecret = process.env.RESET_TOKEN_SECRET || '';
    this.tokenExpiry = process.env.RESET_TOKEN_EXPIRY || '';
  }

  private async sendResetEmail(email: string, resetToken: string): Promise<void> {
    logger.info(`Sending password reset email to ${email}`);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  
    await transporter.sendMail({
      from: '"Support Team" <${process.env.SMTP_USER}>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    logger.info(`Password reset email sent to ${email}`);
  }

  async requestPasswordReset(email: string): Promise<string> {
    logger.info(`Password reset requested for email: ${email}`);
    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      throw new Error('User not found');
    }
    
    const resetToken = this.generateResetToken(user);

    await this.userPasswordResetModel.createResetEntry({
      user_id: user.user_id,
      password_reset_token: resetToken,
      password_reset_token_expiration: new Date(Date.now() + this.parseExpiry(this.tokenExpiry)),
    });

    await this.sendResetEmail(email, resetToken);
    logger.info(`Password reset token generated for user: ${user.user_id}`);

    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    logger.info(`Resetting password using token: ${resetToken}`);
    const payload = this.verifyResetToken(resetToken);
    const resetEntry = await this.userPasswordResetModel.getByToken(resetToken);

    if (!resetEntry || resetEntry.password_reset_token_expiration < new Date()) {
      logger.warn(`Invalid or expired reset token: ${resetToken}`);
      throw new Error('Invalid or expired reset token');
    }

    await this.userModel.updateUser(payload.userId, {
      password_hash: hashPassword(newPassword),
      token_version: (payload.tokenVersion || 0) + 1,
    });

    await this.userPasswordResetModel.invalidateToken(resetToken);
    logger.info(`Password successfully reset for user: ${payload.userId}`);
  }

  private generateResetToken(user: User): string {
    logger.info(`Generating password reset token for user: ${user.user_id}`);
    return jwt.sign(
      { userId: user.user_id, tokenVersion: user.token_version },
      this.resetSecret,
      { expiresIn: this.tokenExpiry },
    );
  }

  private verifyResetToken(token: string): { userId: string; tokenVersion: number } {
    try {
      logger.info(`Verifying password reset token`);
      return jwt.verify(token, this.resetSecret) as { userId: string; tokenVersion: number };
    } catch (err) {
      logger.error(`Invalid or expired reset token: ${err}`);
      throw new Error(`Invalid or expired reset token: ${err}`);
    }
  }

  private parseExpiry(expiry: string): number {
    logger.info(`Parsing expiry format: ${expiry}`);
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      logger.error(`Invalid token expiry format: ${expiry}`);
      throw new Error('Invalid token expiry format');
    }
    const [, value, unit] = match;
    const multipliers: Record<string, number> = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return parseInt(value, 10) * (multipliers[unit] || 0);
  }
}

export default PasswordResetService;
