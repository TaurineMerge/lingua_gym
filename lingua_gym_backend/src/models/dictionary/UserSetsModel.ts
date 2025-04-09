import Database from '../../database/config/db-connection.js';
import { Permission as UserSetsPermission, UserSets } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';

@injectable()
class UserSetsModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async addUserToSet(userId: string, setId: string, permission: UserSetsPermission): Promise<UserSets | null> {
        const query = `INSERT INTO "UserSets" (user_id, set_id, permission) VALUES ($1, $2, $3) RETURNING user_id AS "userId", set_id AS "setId", permission`;
        
        try {
            const result = await this.db.query<UserSets>(query, [userId, setId, permission]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error adding user to set');
            throw error;
        }
    }

    async removeUserFromSet(userId: string, setId: string): Promise<UserSets | null> {
        const query = `DELETE FROM "UserSets" WHERE user_id = $1 AND set_id = $2 RETURNING user_id AS "userId", set_id AS "setId", permission`;
        
        try {
            const result = await this.db.query<UserSets>(query, [userId, setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error removing user from set');
            throw error;
        }
    }

    async getUsersBySet(setId: string): Promise<UserSets[] | null> {
        const query = `SELECT user_id, permission FROM "UserSets" WHERE set_id = $1`;
        
        try {
            const result = await this.db.query<UserSets>(query, [setId]);
            return result.rows.length > 0 ? result.rows : null;
        } catch (error) {
            logger.error({ error }, 'Error fetching users for set');
            throw error;
        }
    }

    async getUserPermission(userId: string, setId: string): Promise<UserSetsPermission | null> {
        const query = `SELECT permission FROM "UserSets" WHERE user_id = $1 AND set_id = $2`;
        
        try {
            const result = await this.db.query<{ permission: UserSetsPermission }>(query, [userId, setId]);
            return result.rows[0]?.permission || null;
        } catch (error) {
            logger.error({ error }, 'Error fetching user role in set');
            throw error;
        }
    }

    async getUserSets(userId: string): Promise<UserSets[] | null> {
        const query = `SELECT set_id, permission FROM "UserSets" WHERE user_id = $1`;

        try {
            const result = await this.db.query<UserSets>(query, [userId]);
            return result.rows.length > 0 ? result.rows : null;
        } catch (error) {
            logger.error({ error }, 'Error fetching sets for user');
            throw error;
        }
    }
}

export default UserSetsModel;
