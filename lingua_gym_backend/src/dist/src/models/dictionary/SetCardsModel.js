var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from '../../utils/logger/Logger.js';
class SetCardsModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    addCardToSet(setId, cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO set_cards (set_id, card_id) VALUES ($1, $2) RETURNING *`;
            try {
                const result = yield this.db.query(query, [setId, cardId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error adding card to set');
                throw error;
            }
        });
    }
    removeCardFromSet(setId, cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM set_cards WHERE set_id = $1 AND card_id = $2 RETURNING *`;
            try {
                const result = yield this.db.query(query, [setId, cardId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error removing card from set');
                throw error;
            }
        });
    }
    getCardsBySet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT dc.* 
            FROM dictionary_cards dc
            JOIN set_cards sc ON dc.dictionary_card_id = sc.card_id
            WHERE sc.set_id = $1
        `;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows || null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching cards for set');
                throw error;
            }
        });
    }
}
export default SetCardsModel;
