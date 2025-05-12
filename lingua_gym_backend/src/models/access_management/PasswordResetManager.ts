import logger from "../../utils/logger/Logger";
import jwt from 'jsonwebtoken';
import User from "./User";

class PasswordResetManager {
    private resetSecret: string;
    private tokenExpiry: string;
    
    constructor() {
        this.resetSecret = process.env.RESET_TOKEN_SECRET || '';
        this.tokenExpiry = process.env.RESET_TOKEN_EXPIRY || '';
    }

    public parseExpiry(): number {
        logger.info(`Parsing expiry format: ${this.tokenExpiry}`);
        const match = this.tokenExpiry.match(/^(\d+)([smhd])$/);
        if (!match) {
          logger.error(`Invalid token expiry format: ${this.tokenExpiry}`);
          throw new Error('Invalid token expiry format');
        }
        const [, value, unit] = match;
        const multipliers: Record<string, number> = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
        return parseInt(value, 10) * (multipliers[unit] || 0);
    }

    public generateResetToken(user: User): string {
        logger.info(`Generating password reset token for user: ${user.userId}`);
        return jwt.sign(
          { userId: user.userId, tokenVersion: user.tokenVersion },
          this.resetSecret,
          { expiresIn: this.tokenExpiry },
        );
    }

    public verifyResetToken(token: string): { userId: string; tokenVersion: number } {
        try {
            logger.info(`Verifying password reset token`);
            return jwt.verify(token, this.resetSecret) as { userId: string; tokenVersion: number };
        } catch (err) {
            logger.error(`Invalid or expired reset token: ${err}`);
            throw new Error(`Invalid or expired reset token: ${err}`);
        }
    }
}

export default PasswordResetManager;