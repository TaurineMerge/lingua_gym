import Database from '../../database/config/db-connection.js';
import { DictionaryCard, SetCards } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';

class SetCardsModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async addCardToSet(setId: string, cardId: string): Promise<SetCards | null> {
        const query = `INSERT INTO "SetCards" (set_id, card_id) VALUES ($1, $2) RETURNING set_id AS "setId", card_id AS "cardId"`;
        
        try {
            const result = await this.db.query<SetCards>(query, [setId, cardId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error adding card to set');
            throw error;
        }
    }

    async removeCardFromSet(setId: string, cardId: string): Promise<SetCards | null> {
        const query = `DELETE FROM "SetCards" WHERE set_id = $1 AND card_id = $2 RETURNING set_id AS "setId", card_id AS "cardId"`;
        
        try {
            const result = await this.db.query<SetCards>(query, [setId, cardId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error removing card from set');
            throw error;
        }
    }

    async getCardsBySet(setId: string): Promise<DictionaryCard[] | null> {
        const query = `SELECT dc.dictionary_card_id AS "dictionaryCardId", original, transcription, pronunciation FROM "DictionaryCards" dc JOIN "SetCards" sc ON dc.dictionary_card_id = sc.card_id WHERE sc.set_id = $1`;
        
        try {
            const result = await this.db.query<DictionaryCard>(query, [setId]);
            return result.rows.length > 0 ? result.rows : null;
        } catch (error) {
            logger.error({ error }, 'Error fetching cards for set');
            throw error;
        }
    }
}

export default SetCardsModel;
