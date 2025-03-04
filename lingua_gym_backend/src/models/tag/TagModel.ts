import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';

class TagModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async createTag(name: string, description?: string): Promise<string | null> {
        const query = `INSERT INTO tags (name, description) VALUES ($1, $2) RETURNING tag_id;`;
        try {
            const result = await this.db.query<{ tag_id: string }>(query, [name, description || null]);
            return result.rows[0]?.tag_id || null;
        } catch (error) {
            logger.error({ error, name }, 'Error creating tag');
            return null;
        }
    }

    async getTagById(tagId: string) {
        const query = `SELECT * FROM tags WHERE tag_id = $1;`;
        try {
            const result = await this.db.query(query, [tagId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error, tagId }, 'Error fetching tag');
            return null;
        }
    }

    async getAllTags() {
        const query = `SELECT * FROM tags ORDER BY name;`;
        try {
            const result = await this.db.query(query);
            return result.rows;
        } catch (error) {
            logger.error({ error }, 'Error fetching all tags');
            return [];
        }
    }

    async updateTag(tagId: string, name: string, description?: string): Promise<boolean> {
        const query = `UPDATE tags SET name = $1, description = $2 WHERE tag_id = $3;`;
        try {
            const result = await this.db.query(query, [name, description || null, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, tagId }, 'Error updating tag');
            return false;
        }
    }

    async deleteTag(tagId: string): Promise<boolean> {
        const query = `DELETE FROM tags WHERE tag_id = $1;`;
        try {
            const result = await this.db.query(query, [tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, tagId }, 'Error deleting tag');
            return false;
        }
    }
}

export default TagModel;
