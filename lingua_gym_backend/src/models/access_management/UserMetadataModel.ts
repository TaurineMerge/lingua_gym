import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { UserMetadata } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserMetadataModel {
  constructor(@inject('Database') private db: Database) {}

  async createUserMetadata(userMetadata: UserMetadata): Promise<void> {
    const query = `
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `;
    const values = [
      userMetadata.userId,
      userMetadata.lastLogin,
      userMetadata.signupDate
    ];
    try {
      logger.info('Creating user metadata...');
      await this.db.query(query, values);
      logger.info('User metadata created successfully');
    } catch (err) {
      logger.error('Error creating user metadata:', err);
      throw err;
    }
  }

  async getUserMetadataById(user_id: string): Promise<UserMetadata | null> {
    const query = `
    SELECT 
      user_id as "userId", 
      last_login as "lastLogin", 
      signup_date as "signupDate" 
    FROM "UserMetadata" 
    WHERE user_id = $1`;
    try {
      const result = await this.db.query<UserMetadata>(query, [user_id]);
      return result.rows[0] || null;
    } catch (err) {
      logger.error('Error fetching user metadata by ID:', err);
      throw err;
    }
  }

  async updateUserMetadataById(user_id: string, updates: Partial<UserMetadata>): Promise<void> {
    const fields = Object.keys(updates)
      .map((key, index) => { 
        const keyMapping: Record<string, string> = {
          lastLogin: 'last_login',
          signupDate: 'signup_date'
        };

        key = keyMapping[key] || key;

        return `"${key}" = $${index + 2}`
    })
      .join(", ");
    const values = [user_id, ...Object.values(updates)];
    const query = `UPDATE "UserMetadata" SET ${fields} WHERE user_id = $1`;

    try {
      logger.info(`Updating metadata for user: ${user_id}`);
      await this.db.query(query, values);
      logger.info('User metadata updated successfully');
    } catch (err) {
      logger.error('Error updating user metadata:', err);
      throw err;
    }
  }

  async deleteUserMetadataById(user_id: string): Promise<void> {
    const query = `DELETE FROM "UserMetadata" WHERE user_id = $1`;

    try {
      logger.info(`Deleting metadata for user: ${user_id}`);
      await this.db.query(query, [user_id]);
      logger.info('User metadata deleted successfully');
    } catch (err) {
      logger.error('Error deleting user metadata:', err);
      throw err;
    }
  }
}

export default UserMetadataModel;
