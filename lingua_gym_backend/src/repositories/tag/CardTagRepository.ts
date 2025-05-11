import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';
import { CardTag } from '../../database/interfaces/DbInterfaces.js';

@injectable()
class CardTagRepository {
    constructor(@inject('Database') private db: Database) {}

    async addTagToCard(cardId: string, tagId: string): Promise<boolean> {
        const query = `INSERT INTO "CardTag" (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING card_id AS "cardId", tag_id AS "tagId";`;
        try {
            const result = await this.db.query(query, [cardId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Error adding tag to card');
            return false;
        }
    }

    async removeTagFromCard(cardId: string, tagId: string): Promise<boolean> {
        const query = `DELETE FROM "CardTag" WHERE card_id = $1 AND tag_id = $2 RETURNING card_id AS "cardId", tag_id AS "tagId";`;
        try {
            const result = await this.db.query(query, [cardId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Error removing tag from card');
            return false;
        }
    }

    async getTagsForCard(cardId: string): Promise<Array<CardTag & { tagName: string }>> {
        const query = `SELECT t.name AS "tagName", t.tag_id AS "tagId", ct.card_id AS "cardId" FROM "Tag" t INNER JOIN "CardTag" ct ON t.tag_id = ct.tag_id WHERE ct.card_id = $1;`;
        try {
            const result = await this.db.query<CardTag & { tagName: string }>(query, [cardId]);
            return result.rows;
        } catch (error) {
            logger.error({ error, cardId }, 'Error fetching tags for card');
            return [];
        }
    }
}

export default CardTagRepository;
