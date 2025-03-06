import Database from '../../database/config/db-connection.js';
import { DictionarySet } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';

class DictionarySetModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async createSet(dictionarySet: DictionarySet): Promise<DictionarySet> {
        const query = `INSERT INTO dictionary_sets (dictionary_set_id, name, owner_id, description) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [dictionarySet.dictionarySetId, dictionarySet.name, dictionarySet.ownerId, dictionarySet.description || null];
        
        try {
            const result = await this.db.query<DictionarySet>(query, values);
            return result.rows[0];
        } catch (error) {
            logger.error({ error }, 'Error creating dictionary set');
            throw error;
        }
    }

    async getSetById(setId: string): Promise<DictionarySet | null> {
        const query = `SELECT * FROM dictionary_sets WHERE set_id = $1`;
        try {
            const result = await this.db.query<DictionarySet>(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error fetching dictionary set');
            throw error;
        }
    }

    async deleteSet(setId: string): Promise<DictionarySet | null> {
        const query = `DELETE FROM dictionary_sets WHERE set_id = $1 RETURNING *`;
        try {
            const result = await this.db.query<DictionarySet>(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error deleting dictionary set');
            throw error;
        }
    }

    async addTagToSet(setId: string, tagId: string): Promise<boolean> {
        const query = `INSERT INTO set_tags (set_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
        try {
            const result = await this.db.query(query, [setId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Error adding tag to set');
            return false;
        }
    }

    async removeTagFromSet(setId: string, tagId: string): Promise<boolean> {
        const query = `DELETE FROM set_tags WHERE set_id = $1 AND tag_id = $2;`;
        try {
            const result = await this.db.query(query, [setId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Error removing tag from set');
            return false;
        }
    }

    async getTagsForSet(setId: string): Promise<string[]> {
        const query = `SELECT t.name FROM tags t INNER JOIN set_tags st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
        try {
            const result = await this.db.query<{ name: string }>(query, [setId]);
            return result.rows.map(row => row.name);
        } catch (error) {
            logger.error({ error, setId }, 'Error fetching tags for set');
            return [];
        }
    }
}

export default DictionarySetModel;
