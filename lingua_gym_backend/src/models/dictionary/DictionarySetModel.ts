import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';

class DictionarySetModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async createSet(name: string, ownerId: string, description?: string) {
        const query = `INSERT INTO dictionary_sets (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, ownerId, description || null];
        
        try {
            const result = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            logger.error({ error }, 'Error creating dictionary set');
            throw error;
        }
    }

    async getSetById(setId: string) {
        const query = `SELECT * FROM dictionary_sets WHERE set_id = $1`;
        try {
            const result = await this.db.query(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error fetching dictionary set');
            throw error;
        }
    }

    async deleteSet(setId: string) {
        const query = `DELETE FROM dictionary_sets WHERE set_id = $1 RETURNING *`;
        try {
            const result = await this.db.query(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error deleting dictionary set');
            throw error;
        }
    }
}

export default DictionarySetModel;
