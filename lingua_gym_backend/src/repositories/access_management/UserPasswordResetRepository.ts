import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { IPasswordResetManager } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserPasswordResetRepository {
  constructor(@inject('Database') private db: Database) {}

  async createResetEntry(reset: IPasswordResetManager): Promise<void> {
    const query = 'INSERT INTO "UserPasswordReset" (user_id, password_reset_token, password_reset_token_expiration) VALUES ($1, $2, $3)';
    const values = [
      reset.userId,
      reset.passwordResetToken,
      reset.passwordResetTokenExpiration,
    ];
    try {
      logger.info('Creating password reset entry...');
      await this.db.query(query, values);
      logger.info('Password reset entry created successfully');
    } catch (err) {
      logger.error('Error creating password reset entry:', err);
      throw err;
    }
  }

  async getByToken(password_reset_token: string): Promise<IPasswordResetManager | null> {
    const query = `
    SELECT 
      user_id as "userId",
      password_reset_token as "passwordResetToken",
      password_reset_token_expiration as "passwordResetTokenExpiration",
      created_at as "createdAt"
    FROM "UserPasswordReset" WHERE password_reset_token = $1`;
    try {
      logger.info('Fetching password reset entry by token...');
      const result = await this.db.query<IPasswordResetManager>(query, [password_reset_token]);

      if (result.rows.length > 0) {
        logger.info('Password reset entry found');
      } else {
        logger.info('Password reset entry not found');
      }
      return result.rows[0] || null;
    } catch (err) {
      logger.error('Error fetching password reset entry by token:', err);
      throw err;
    }
  }

  async invalidateToken(password_reset_token: string): Promise<void> {
    const query = 'DELETE FROM "UserPasswordReset" WHERE password_reset_token = $1';
    try {
      logger.info('Invalidating password reset token...');
      await this.db.query(query, [password_reset_token]);
      logger.info('Password reset token invalidated successfully');
    } catch (err) {
      logger.error('Error invalidating password reset token:', err);
      throw err;
    }
  }

  async deleteRequestByUserId(user_id: string): Promise<void> {
    const query = 'DELETE FROM "UserPasswordReset" WHERE user_id = $1';
    try {
      logger.info('Deleting password reset request...');
      await this.db.query(query, [user_id]);
      logger.info('Password reset request deleted successfully');
    } catch (err) {
      logger.error('Error deleting password reset request:', err);
      throw err;
    }
  }

  async deleteExpiredRequests(): Promise<void> {
    const query = 'DELETE FROM "UserPasswordReset" WHERE password_reset_token_expiration <= NOW()';
    try {
      logger.info('Deleting expired password reset requests...');
      await this.db.query(query);
      logger.info('Expired password reset requests deleted successfully');
    } catch (err) {
      logger.error('Error deleting expired password reset requests:', err);
      throw err;
    }
  }
}

export default UserPasswordResetRepository;
