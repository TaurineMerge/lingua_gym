import { UserPasswordResetModel, UserModel } from '../../models/access_management/access_management.js'; 
import { User } from '../../database/interfaces/DbInterfaces.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import hashPassword from '../../utils/hash/HashPassword.js';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
import { inject, injectable } from 'tsyringe';

@injectable()
class PasswordResetService {
  private resetSecret: string;
  private tokenExpiry: string;

  constructor(@inject('UserModel') private userModel: UserModel, @inject('UserPasswordResetModel') private userPasswordResetModel: UserPasswordResetModel) {
    this.userModel = userModel;
    this.userPasswordResetModel = userPasswordResetModel;
    this.resetSecret = process.env.RESET_TOKEN_SECRET || '';
    this.tokenExpiry = process.env.RESET_TOKEN_EXPIRY || '';
  }

  private async sendResetEmail(email: string, resetToken: string): Promise<void> {
    logger.info(`Sending password reset email to ${email}`);
    const resetUrl = `${process.env.CLIENT_URL}/auth/password-reset?token=${resetToken}`;
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
    
    this.userPasswordResetModel.deleteRequestByUserId(user.userId);

    const resetToken = this.generateResetToken(user);

    await this.userPasswordResetModel.createResetEntry({
      userId: user.userId,
      passwordResetToken: resetToken,
      passwordResetTokenExpiration: new Date(Date.now() + this.parseExpiry(this.tokenExpiry)),
    });

    await this.sendResetEmail(email, resetToken);
    logger.info(`Password reset token generated for user: ${user.userId}`);

    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    logger.info(`Resetting password using token: ${resetToken}`);
    const payload = this.verifyResetToken(resetToken);
    const resetEntry = await this.userPasswordResetModel.getByToken(resetToken);

    if (!resetEntry || resetEntry.passwordResetTokenExpiration < new Date()) {
      logger.warn(`Invalid or expired reset token: ${resetToken}`);
      throw new Error('Invalid or expired reset token');
    }

    await this.userModel.updateUserById(payload.userId, {
      passwordHash: hashPassword(newPassword),
      tokenVersion: (payload.tokenVersion || 0) + 1,
    });

    await this.userPasswordResetModel.invalidateToken(resetToken);
    logger.info(`Password successfully reset for user: ${payload.userId}`);
  }

  private generateResetToken(user: User): string {
    logger.info(`Generating password reset token for user: ${user.userId}`);
    return jwt.sign(
      { userId: user.userId, tokenVersion: user.tokenVersion },
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
