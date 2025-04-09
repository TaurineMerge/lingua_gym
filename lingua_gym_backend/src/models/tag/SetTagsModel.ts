import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { DictionarySet } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';

@injectable()
class SetTagsModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async addTagToSet(setId: string, tagId: string): Promise<boolean> {
        const query = `INSERT INTO "SetTags" (set_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
        try {
            const result = await this.db.query(query, [setId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Error adding tag to set');
            return false;
        }
    }
    
    async removeTagFromSet(setId: string, tagId: string): Promise<boolean> {
        const query = `DELETE FROM "SetTags" WHERE set_id = $1 AND tag_id = $2;`;
        try {
            const result = await this.db.query(query, [setId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Error removing tag from set');
            return false;
        }
    }
    
    async getTagsForSet(setId: string): Promise<DictionarySet[]> {
        const query = `SELECT t.name FROM "Tags" t INNER JOIN "SetTags" st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
        try {
            const result = await this.db.query<DictionarySet>(query, [setId]);
            return result.rows;
        } catch (error) {
            logger.error({ error, setId }, 'Error fetching tags for set');
            return [];
        }
    }
}

export default SetTagsModel;