import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { Permission as UserSetPermission, IUserSet } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserSetRepository {
    constructor(@inject('Database') private db: Database) {}

    async addUserToSet(userId: string, setId: string, permission: UserSetPermission): Promise<IUserSet | null> {
        const query = `INSERT INTO "UserSet" (user_id, set_id, permission) VALUES ($1, $2, $3) RETURNING user_id AS "userId", set_id AS "setId", permission`;
        
        try {
            const result = await this.db.query<IUserSet>(query, [userId, setId, permission]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error adding user to set');
            throw error;
        }
    }

    async removeUserFromSet(userId: string, setId: string): Promise<IUserSet | null> {
        const query = `DELETE FROM "UserSet" WHERE user_id = $1 AND set_id = $2 RETURNING user_id AS "userId", set_id AS "setId", permission`;
        
        try {
            const result = await this.db.query<IUserSet>(query, [userId, setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error removing user from set');
            throw error;
        }
    }

    async getUsersBySet(setId: string): Promise<IUserSet[] | null> {
        const query = `SELECT user_id AS "userId", set_id AS "setId", permission FROM "UserSet" WHERE set_id = $1`;
        
        try {
            const result = await this.db.query<IUserSet>(query, [setId]);
            return result.rows.length > 0 ? result.rows : null;
        } catch (error) {
            logger.error({ error }, 'Error fetching users for set');
            throw error;
        }
    }

    async getUserPermission(userId: string, setId: string): Promise<UserSetPermission | null> {
        const query = `SELECT permission FROM "UserSet" WHERE user_id = $1 AND set_id = $2`;
        
        try {
            const result = await this.db.query<{ permission: UserSetPermission }>(query, [userId, setId]);
            return result.rows[0]?.permission || null;
        } catch (error) {
            logger.error({ error }, 'Error fetching user role in set');
            throw error;
        }
    }

    async getUserSets(userId: string): Promise<IUserSet[] | null> {
        const query = `SELECT set_id, permission FROM "UserSet" WHERE user_id = $1`;

        try {
            const result = await this.db.query<IUserSet>(query, [userId]);
            return result.rows.length > 0 ? result.rows : null;
        } catch (error) {
            logger.error({ error }, 'Error fetching sets for user');
            throw error;
        }
    }
}

export default UserSetRepository;
