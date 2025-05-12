import { UserPasswordResetRepository, UserRepository } from '../../repositories/access_management/access_management.js'; 
import nodemailer from 'nodemailer';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
import { inject, injectable } from 'tsyringe';
import { PasswordResetManager, User } from '../../models/access_management/access_management.js';

@injectable()
class PasswordResetService {
  private passwordResetManager: PasswordResetManager;

  constructor(@inject('UserRepository') private userRepository: UserRepository, @inject('UserPasswordResetRepository') private userPasswordResetRepository: UserPasswordResetRepository) {
    this.passwordResetManager = new PasswordResetManager();
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
    const user = new User(await this.userRepository.getUserByEmail(email));
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      throw new Error('User not found');
    }
    
    this.userPasswordResetRepository.deleteRequestByUserId(user.userId);

    const resetToken = this.passwordResetManager.generateResetToken(user);

    await this.userPasswordResetRepository.createResetEntry({
      userId: user.userId,
      passwordResetToken: resetToken,
      passwordResetTokenExpiration: new Date(Date.now() + this.passwordResetManager.parseExpiry()),
    });

    await this.sendResetEmail(email, resetToken);
    logger.info(`Password reset token generated for user: ${user.userId}`);

    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    logger.info(`Resetting password using token: ${resetToken}`);
    const payload = this.passwordResetManager.verifyResetToken(resetToken);
    const resetEntry = await this.userPasswordResetRepository.getByToken(resetToken);

    if (!resetEntry || resetEntry.passwordResetTokenExpiration < new Date()) {
      logger.warn(`Invalid or expired reset token: ${resetToken}`);
      throw new Error('Invalid or expired reset token');
    }

    const user = new User(await this.userRepository.getUserById(payload.userId));

    user.password = newPassword;
    user.tokenVersion = (payload.tokenVersion || 0) + 1;

    await this.userRepository.updateUserById(user.userId, {
      passwordHash: user.passwordHash,
      tokenVersion: user.tokenVersion,
    });

    await this.userPasswordResetRepository.invalidateToken(resetToken);
    logger.info(`Password successfully reset for user: ${payload.userId}`);
  }
}

export default PasswordResetService;
