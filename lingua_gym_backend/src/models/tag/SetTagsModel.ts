import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';

class CardTagsModel {
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
    
    async getTagsForSet(setId: string): Promise<string[]> {
        const query = `SELECT t.name FROM "Tags" t INNER JOIN "SetTags" st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
        try {
            const result = await this.db.query<{ name: string }>(query, [setId]);
            return result.rows.map(row => row.name);
        } catch (error) {
            logger.error({ error, setId }, 'Error fetching tags for set');
            return [];
        }
    }
}

export default CardTagsModel;