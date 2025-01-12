import Database from '../../database/config/db-connection';
import UserPasswordReset from '../../database/interfaces/User/UserPasswordReset';

class UserPasswordResetModel {
  private db;

  constructor(dbInstance: Database) {
    this.db = dbInstance;
  }

  async createResetEntry(reset: UserPasswordReset): Promise<void> {
    const query = `
      INSERT INTO "UserPasswordReset" (user_id, password_reset_token, password_reset_token_expiration)
      VALUES ($1, $2, $3)
    `;
    const values = [
      reset.user_id,
      reset.password_reset_token,
      reset.password_reset_token_expiration,
    ];
    try {
      await this.db.query(query, values);
    } catch (err) {
      console.error('Error creating password reset entry:', err);
      throw err;
    }
  }

  async getByToken(password_reset_token: string): Promise<UserPasswordReset | null> {
    const query = `
      SELECT * FROM "UserPasswordReset" WHERE password_reset_token = $1 AND password_reset_token_expiration > NOW()
    `;
    try {
      const result = await this.db.query<UserPasswordReset>(query, [password_reset_token]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error fetching password reset entry by token:', err);
      throw err;
    }
  }

  async invalidateToken(password_reset_token: string): Promise<void> {
    const query = `
      DELETE FROM "UserPasswordReset" WHERE password_reset_token = $1
    `;
    try {
      await this.db.query(query, [password_reset_token]);
    } catch (err) {
      console.error('Error invalidating password reset token:', err);
      throw err;
    }
  }

  async deleteRequestByUserId(user_id: string): Promise<void> {
    const query = `DELETE FROM "UserPasswordReset" WHERE user_id = $1`;
    try {
      await this.db.query(query, [user_id]);
    } catch (err) {
      console.error('Error deleting password reset request:', err);
      throw err;
    }
  }

  async deleteExpiredRequests(): Promise<void> {
    const query = `DELETE FROM "UserPasswordReset" WHERE password_reset_token_expiration < NOW()`;
    try {
      await this.db.query(query);
    } catch (err) {
      console.error('Error deleting expired password reset requests:', err);
      throw err;
    }
  }
}

export default UserPasswordResetModel;
