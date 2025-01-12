import Database from '../../database/config/db-connection';
import UserMetadata from '../../database/interfaces/User/UserMetadata';

class UserModel {
  private db;
  
  constructor(dbInstance: Database) {
    this.db = dbInstance;
  }

  async createUserMetadata(userMetadata: UserMetadata): Promise<void> {
    const query = `
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [
      userMetadata.user_id,
      userMetadata.last_login,
      userMetadata.signup_date
    ];
    try {
      await this.db.query(query, values);
    } catch (err) {
      console.error('Error creating user metadata:', err);
      throw err;
    }
  }
}

export default UserModel;
