import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import CardsTags from '../../database/interfaces/tag/CardsTags.js';

class CardsTagsModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async addTagToCard(cardId: string, tagId: string): Promise<boolean> {
        const query = `INSERT INTO cards_tags (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
        try {
            const result = await this.db.query(query, [cardId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Error adding tag to card');
            return false;
        }
    }

    async removeTagFromCard(cardId: string, tagId: string): Promise<boolean> {
        const query = `DELETE FROM cards_tags WHERE card_id = $1 AND tag_id = $2;`;
        try {
            const result = await this.db.query(query, [cardId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Error removing tag from card');
            return false;
        }
    }

    async getTagsByCard(cardId: string): Promise<Array<CardsTags>> {
        const query = `SELECT tags_id FROM card_tags WHERE card_id = $1;`;
        try {
            const result = await this.db.query<CardsTags>(query, [cardId]);
            return result.rows;
        } catch (error) {
            logger.error({ error, cardId }, 'Error fetching tags for card');
            return [];
        }
    }

    async getUserCardsByTag(tagId: string, userId: string): Promise<Array<CardsTags>> {
        const query = `SELECT ct.card_id FROM cards_tags ct JOIN dictionary_cards dc ON ct.card_id = dc.dictionary_card_id WHERE ct.tag_id = $1 AND dc.owner_id = $2;`;
        try {
            const result = await this.db.query<CardsTags>(query, [tagId, userId]);
            return result.rows;
        } catch (error) {
            logger.error({ error, tagId, userId }, 'Error fetching cards for tag');
            return [];
        }
    }
}

export default CardsTagsModel;
