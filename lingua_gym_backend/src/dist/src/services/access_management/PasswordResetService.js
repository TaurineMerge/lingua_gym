var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserPasswordResetRepository, UserRepository } from '../../repositories/access_management/access_management.js';
import nodemailer from 'nodemailer';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
import { inject, injectable } from 'tsyringe';
import { PasswordResetManager, User } from '../../models/access_management/access_management.js';
let PasswordResetService = class PasswordResetService {
    constructor(userRepository, userPasswordResetRepository) {
        this.userRepository = userRepository;
        this.userPasswordResetRepository = userPasswordResetRepository;
        this.passwordResetManager = new PasswordResetManager();
    }
    sendResetEmail(email, resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Sending password reset email to ${email}`);
            const resetUrl = `${process.env.CLIENT_URL}/auth/password-reset?token=${resetToken}`;
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
            const user = new User(yield this.userRepository.getUserByEmail(email));
            if (!user) {
                logger.warn(`Password reset requested for non-existent email: ${email}`);
                throw new Error('User not found');
            }
            this.userPasswordResetRepository.deleteRequestByUserId(user.userId);
            const resetToken = this.passwordResetManager.generateResetToken(user);
            yield this.userPasswordResetRepository.createResetEntry({
                userId: user.userId,
                passwordResetToken: resetToken,
                passwordResetTokenExpiration: new Date(Date.now() + this.passwordResetManager.parseExpiry()),
            });
            yield this.sendResetEmail(email, resetToken);
            logger.info(`Password reset token generated for user: ${user.userId}`);
            return resetToken;
        });
    }
    resetPassword(resetToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Resetting password using token: ${resetToken}`);
            const payload = this.passwordResetManager.verifyResetToken(resetToken);
            const resetEntry = yield this.userPasswordResetRepository.getByToken(resetToken);
            if (!resetEntry || resetEntry.passwordResetTokenExpiration < new Date()) {
                logger.warn(`Invalid or expired reset token: ${resetToken}`);
                throw new Error('Invalid or expired reset token');
            }
            const user = new User(yield this.userRepository.getUserById(payload.userId));
            user.password = newPassword;
            user.tokenVersion = (payload.tokenVersion || 0) + 1;
            yield this.userRepository.updateUserById(user.userId, {
                passwordHash: user.passwordHash,
                tokenVersion: user.tokenVersion,
            });
            yield this.userPasswordResetRepository.invalidateToken(resetToken);
            logger.info(`Password successfully reset for user: ${payload.userId}`);
        });
    }
};
PasswordResetService = __decorate([
    injectable(),
    __param(0, inject('UserRepository')),
    __param(1, inject('UserPasswordResetRepository')),
    __metadata("design:paramtypes", [UserRepository, UserPasswordResetRepository])
], PasswordResetService);
export default PasswordResetService;
