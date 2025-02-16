import Database from '../../database/config/db-connection';
import User from '../../database/interfaces/User/User';
import logger from '../../utils/logger/Logger';

class UserModel {
  private db;
  
  constructor(dbInstance: Database) {
    this.db = dbInstance;
  }

  async createUser(user: User): Promise<void> {
    const query = 'INSERT INTO "User" (user_id, username, display_name, password_hash, email, token_version, profile_picture, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [
      user.user_id,
      user.username,
      user.display_name,
      user.password_hash,
      user.email,
      user.token_version,
      user.profile_picture,
      user.email_verified,
    ];
    try {
      logger.info('Creating user...');
      await this.db.query(query, values);
      logger.info('User created successfully');
    } catch (err) {
      logger.error('Error creating user:', err);
      throw err;
    }
  }

  async getUserById(user_id: string): Promise<User | null> {
    const query = `SELECT * FROM "User" WHERE user_id = $1`;
    try {
      const result = await this.db.query<User>(query, [user_id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error fetching user by ID:', err);
      throw err;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM "User" WHERE email = $1`;
    try {
      const result = await this.db.query<User>(query, [email]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error fetching user by Email:', err);
      throw err;
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM "User" WHERE username = $1`;
    try {
      const result = await this.db.query<User>(query, [username]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error fetching user by username:', err);
      throw err;
    }
  }

  async updateUserById(user_id: string, updates: Partial<User>): Promise<void> {
    const fields = Object.keys(updates)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(", ");
    const values = [user_id, ...Object.values(updates)];
    const query = `UPDATE "User" SET ${fields} WHERE user_id = $1`;
    try {
      await this.db.query(query, values);
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }

  async deleteUserById(user_id: string): Promise<void> {
    const query = `DELETE FROM "User" WHERE user_id = $1`;
    try {
      await this.db.query(query, [user_id]);
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }
}

export default UserModel;
