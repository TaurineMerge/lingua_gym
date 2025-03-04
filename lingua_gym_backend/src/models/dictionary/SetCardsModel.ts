import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';

class SetCardsModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async addCardToSet(setId: string, cardId: string) {
        const query = `INSERT INTO set_cards (set_id, card_id) VALUES ($1, $2) RETURNING *`;
        
        try {
            const result = await this.db.query(query, [setId, cardId]);
            return result.rows[0];
        } catch (error) {
            logger.error({ error }, 'Error adding card to set');
            throw error;
        }
    }

    async removeCardFromSet(setId: string, cardId: string) {
        const query = `DELETE FROM set_cards WHERE set_id = $1 AND card_id = $2 RETURNING *`;
        
        try {
            const result = await this.db.query(query, [setId, cardId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error removing card from set');
            throw error;
        }
    }

    async getCardsBySet(setId: string) {
        const query = `
            SELECT dc.* 
            FROM dictionary_cards dc
            JOIN set_cards sc ON dc.dictionary_card_id = sc.card_id
            WHERE sc.set_id = $1
        `;
        
        try {
            const result = await this.db.query(query, [setId]);
            return result.rows;
        } catch (error) {
            logger.error({ error }, 'Error fetching cards for set');
            throw error;
        }
    }
}

export default SetCardsModel;
