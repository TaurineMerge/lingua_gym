import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { IDictionaryCard, ISetCard } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class SetCardRepository {
    constructor(@inject('Database') private db: Database) {}

    async addCardToSet(setId: string, cardId: string): Promise<ISetCard | null> {
        const query = `INSERT INTO "SetCard" (set_id, card_id) VALUES ($1, $2) RETURNING set_id AS "setId", card_id AS "cardId"`;
        
        try {
            const result = await this.db.query<ISetCard>(query, [setId, cardId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error adding card to set');
            throw error;
        }
    }

    async removeCardFromSet(setId: string, cardId: string): Promise<ISetCard | null> {
        const query = `DELETE FROM "SetCard" WHERE set_id = $1 AND card_id = $2 RETURNING set_id AS "setId", card_id AS "cardId"`;
        
        try {
            const result = await this.db.query<ISetCard>(query, [setId, cardId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error removing card from set');
            throw error;
        }
    }

    async getCardsBySet(setId: string): Promise<IDictionaryCard[] | null> {
        const query = `SELECT dc.card_id AS "cardId", original, transcription, pronunciation FROM "DictionaryCard" dc JOIN "SetCard" sc ON dc.card_id = sc.card_id WHERE sc.set_id = $1`;
        
        try {
            const result = await this.db.query<IDictionaryCard>(query, [setId]);
            console.log(result);
            return result.rows.length > 0 ? result.rows : null;
        } catch (error) {
            logger.error({ error }, 'Error fetching cards for set');
            throw error;
        }
    }
}

export default SetCardRepository;
