var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import hashPassword from '../../utils/hash/HashPassword';
import logger from '../../utils/logger/Logger';
import 'dotenv/config';
class PasswordResetService {
    constructor(userModel, userPasswordResetModel) {
        this.userModel = userModel;
        this.userPasswordResetModel = userPasswordResetModel;
        this.resetSecret = process.env.RESET_TOKEN_SECRET || '';
        this.tokenExpiry = process.env.RESET_TOKEN_EXPIRY || '';
    }
    sendResetEmail(email, resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Sending password reset email to ${email}`);
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            const transporter = nodemailer.createTransport({
                service: process.env.SMTP_SERVICE,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            yield transporter.sendMail({
                from: '"Support Team" <${process.env.SMTP_USER}>',
                to: email,
                subject: 'Password Reset Request',
                html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
            });
            logger.info(`Password reset email sent to ${email}`);
        });
    }
    requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Password reset requested for email: ${email}`);
            const user = yield this.userModel.getUserByEmail(email);
            if (!user) {
                logger.warn(`Password reset requested for non-existent email: ${email}`);
                throw new Error('User not found');
            }
            const resetToken = this.generateResetToken(user);
            yield this.userPasswordResetModel.createResetEntry({
                user_id: user.user_id,
                password_reset_token: resetToken,
                password_reset_token_expiration: new Date(Date.now() + this.parseExpiry(this.tokenExpiry)),
            });
            yield this.sendResetEmail(email, resetToken);
            logger.info(`Password reset token generated for user: ${user.user_id}`);
            return resetToken;
        });
    }
    resetPassword(resetToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Resetting password using token: ${resetToken}`);
            const payload = this.verifyResetToken(resetToken);
            const resetEntry = yield this.userPasswordResetModel.getByToken(resetToken);
            if (!resetEntry || resetEntry.password_reset_token_expiration < new Date()) {
                logger.warn(`Invalid or expired reset token: ${resetToken}`);
                throw new Error('Invalid or expired reset token');
            }
            yield this.userModel.updateUserById(payload.userId, {
                password_hash: hashPassword(newPassword),
                token_version: (payload.tokenVersion || 0) + 1,
            });
            yield this.userPasswordResetModel.invalidateToken(resetToken);
            logger.info(`Password successfully reset for user: ${payload.userId}`);
        });
    }
    generateResetToken(user) {
        logger.info(`Generating password reset token for user: ${user.user_id}`);
        return jwt.sign({ userId: user.user_id, tokenVersion: user.token_version }, this.resetSecret, { expiresIn: this.tokenExpiry });
    }
    verifyResetToken(token) {
        try {
            logger.info(`Verifying password reset token`);
            return jwt.verify(token, this.resetSecret);
        }
        catch (err) {
            logger.error(`Invalid or expired reset token: ${err}`);
            throw new Error(`Invalid or expired reset token: ${err}`);
        }
    }
    parseExpiry(expiry) {
        logger.info(`Parsing expiry format: ${expiry}`);
        const match = expiry.match(/^(\d+)([smhd])$/);
        if (!match) {
            logger.error(`Invalid token expiry format: ${expiry}`);
            throw new Error('Invalid token expiry format');
        }
        const [, value, unit] = match;
        const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
        return parseInt(value, 10) * (multipliers[unit] || 0);
    }
}
export default PasswordResetService;
