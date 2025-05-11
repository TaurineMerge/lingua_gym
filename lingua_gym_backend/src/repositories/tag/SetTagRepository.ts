import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { SetTag } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class SetTagRepository {
    constructor(@inject('Database') private db: Database) {}

    async addTagToSet(setId: string, tagId: string): Promise<boolean> {
        const query = `INSERT INTO "SetTag" (set_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
        try {
            const result = await this.db.query(query, [setId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Error adding tag to set');
            return false;
        }
    }
    
    async removeTagFromSet(setId: string, tagId: string): Promise<boolean> {
        const query = `DELETE FROM "SetTag" WHERE set_id = $1 AND tag_id = $2;`;
        try {
            const result = await this.db.query(query, [setId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Error removing tag from set');
            return false;
        }
    }
    
    async getTagsForSet(setId: string): Promise<SetTag[]> {
        const query = `SELECT t.name, t.tag_id AS "tagId", st.set_id AS "setId" FROM "Tag" t INNER JOIN "SetTag" st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
        try {
            const result = await this.db.query<SetTag>(query, [setId]);
            return result.rows;
        } catch (error) {
            logger.error({ error, setId }, 'Error fetching tags for set');
            return [];
        }
    }
}

export default SetTagRepository;