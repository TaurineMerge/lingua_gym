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
class DictionaryCardModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createCard(cardGeneralData, cardTranslations, cardMeanings, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.query('BEGIN');
                const cardResult = yield this.db.query(`INSERT INTO DictionaryCards (original, transcription, pronunciation)
                 VALUES ($1, $2, $3) RETURNING dictionary_card_id`, [cardGeneralData.original, cardGeneralData.transcription, cardGeneralData.pronunciation]);
                const cardId = cardResult.rows[0].dictionaryCardId;
                yield this.insertTranslations(cardId, cardTranslations);
                yield this.insertMeanings(cardId, cardMeanings);
                yield this.insertExamples(cardId, cardExamples);
                yield this.db.query('COMMIT');
                return cardId;
            }
            catch (err) {
                yield this.db.query('ROLLBACK');
                logger.error({ err }, 'Failed to create dictionary card');
                throw err;
            }
        });
    }
    insertTranslations(cardId, cardTranslations) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO DictionaryTranslations (dictionary_card_id, translation) VALUES ($1, $2)`;
            for (const translation of cardTranslations) {
                yield this.db.query(query, [cardId, translation.translation]);
            }
        });
    }
    insertMeanings(cardId, cardMeanings) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO DictionaryMeanings (dictionary_card_id, meaning) VALUES ($1, $2)`;
            for (const meaning of cardMeanings) {
                yield this.db.query(query, [cardId, meaning.meaning]);
            }
        });
    }
    insertExamples(cardId, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO DictionaryExamples (dictionary_card_id, example) VALUES ($1, $2)`;
            for (const example of cardExamples) {
                yield this.db.query(query, [cardId, example.example]);
            }
        });
    }
    removeCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.query('BEGIN');
                yield this.db.query(`DELETE FROM DictionaryTranslations WHERE dictionary_card_id = $1`, [cardId]);
                yield this.db.query(`DELETE FROM DictionaryMeanings WHERE dictionary_card_id = $1`, [cardId]);
                yield this.db.query(`DELETE FROM DictionaryExamples WHERE dictionary_card_id = $1`, [cardId]);
                yield this.db.query(`DELETE FROM card_tags WHERE card_id = $1`, [cardId]);
                const result = yield this.db.query(`DELETE FROM DictionaryCards WHERE dictionary_card_id = $1 RETURNING dictionary_card_id`, [cardId]);
                yield this.db.query('COMMIT');
                if (result.rowCount > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                yield this.db.query('ROLLBACK');
                logger.error({ error, cardId }, 'Error deleting dictionary card');
                throw error;
            }
        });
    }
    getCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cardQuery = `SELECT * FROM DictionaryCards WHERE dictionary_card_id = $1`;
            const translationQuery = `SELECT translation FROM DictionaryTranslations WHERE dictionary_card_id = $1`;
            const meaningQuery = `SELECT meaning FROM DictionaryMeanings WHERE dictionary_card_id = $1`;
            const exampleQuery = `SELECT example FROM DictionaryExamples WHERE dictionary_card_id = $1`;
            const cardResult = yield this.db.query(cardQuery, [cardId]);
            if (cardResult.rows.length === 0)
                return null;
            const translations = (yield this.db.query(translationQuery, [cardId])).rows.map(row => row.translation);
            const meanings = (yield this.db.query(meaningQuery, [cardId])).rows.map(row => row.meaning);
            const examples = (yield this.db.query(exampleQuery, [cardId])).rows.map(row => row.example);
            return Object.assign(Object.assign({}, cardResult.rows[0]), { translation: translations, meaning: meanings, example: examples });
        });
    }
    addTagToCard(cardId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO card_tags (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
            try {
                const result = yield this.db.query(query, [cardId, tagId]);
                return result.rowCount > 0;
            }
            catch (error) {
                logger.error({ error, cardId, tagId }, 'Error adding tag to card');
                return false;
            }
        });
    }
    removeTagFromCard(cardId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM card_tags WHERE card_id = $1 AND tag_id = $2;`;
            try {
                const result = yield this.db.query(query, [cardId, tagId]);
                return result.rowCount > 0;
            }
            catch (error) {
                logger.error({ error, cardId, tagId }, 'Error removing tag from card');
                return false;
            }
        });
    }
    getTagsForCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT t.name FROM tags t INNER JOIN card_tags ct ON t.tag_id = ct.tag_id WHERE ct.card_id = $1;`;
            try {
                const result = yield this.db.query(query, [cardId]);
                return result.rows.map(row => row.name);
            }
            catch (error) {
                logger.error({ error, cardId }, 'Error fetching tags for card');
                return [];
            }
        });
    }
}
export default DictionaryCardModel;
