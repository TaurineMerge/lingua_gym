var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';
let DictionaryCardModel = class DictionaryCardModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createCard(cardGeneralData, cardTranslations, cardMeanings, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.query('BEGIN');
                const cardResult = yield this.db.query(`INSERT INTO "DictionaryCards" (dictionary_card_id, original, transcription, pronunciation)
                 VALUES ($1, $2, $3, $4) RETURNING dictionary_card_id AS "dictionaryCardId"`, [cardGeneralData.dictionaryCardId, cardGeneralData.original, cardGeneralData.transcription, cardGeneralData.pronunciation]);
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
            const query = `INSERT INTO "DictionaryTranslations" (dictionary_card_id, translation) VALUES ($1, $2)`;
            for (const translation of cardTranslations) {
                yield this.db.query(query, [cardId, translation.translation]);
            }
        });
    }
    insertMeanings(cardId, cardMeanings) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO "DictionaryMeanings" (dictionary_card_id, meaning) VALUES ($1, $2)`;
            for (const meaning of cardMeanings) {
                yield this.db.query(query, [cardId, meaning.meaning]);
            }
        });
    }
    insertExamples(cardId, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO "DictionaryExamples" (dictionary_card_id, example) VALUES ($1, $2)`;
            for (const example of cardExamples) {
                yield this.db.query(query, [cardId, example.example]);
            }
        });
    }
    removeCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.query('BEGIN');
                yield this.db.query(`DELETE FROM "DictionaryTranslations" WHERE dictionary_card_id = $1`, [cardId]);
                yield this.db.query(`DELETE FROM "DictionaryMeanings" WHERE dictionary_card_id = $1`, [cardId]);
                yield this.db.query(`DELETE FROM "DictionaryExamples" WHERE dictionary_card_id = $1`, [cardId]);
                yield this.db.query(`DELETE FROM "CardTags" WHERE card_id = $1`, [cardId]);
                const result = yield this.db.query(`DELETE FROM "DictionaryCards" WHERE dictionary_card_id = $1 RETURNING dictionary_card_id`, [cardId]);
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
    updateCard(cardId, cardGeneralData, cardTranslations, cardMeanings, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.query('BEGIN');
                if (Object.keys(cardGeneralData).length > 0) {
                    const fieldsToUpdate = Object.entries(cardGeneralData)
                        .filter(([, value]) => value !== undefined)
                        .map(([field]) => field);
                    if (fieldsToUpdate.length > 0) {
                        const setClause = fieldsToUpdate
                            .map((field, index) => `${field} = $${index + 2}`)
                            .join(', ');
                        yield this.db.query(`UPDATE "DictionaryCards" SET ${setClause} WHERE dictionary_card_id = $1`, [cardId, ...fieldsToUpdate.map(field => cardGeneralData[field])]);
                    }
                }
                if (cardTranslations) {
                    yield this.db.query(`DELETE FROM "DictionaryTranslations" WHERE dictionary_card_id = $1`, [cardId]);
                    yield this.insertTranslations(cardId, cardTranslations);
                }
                if (cardMeanings) {
                    yield this.db.query(`DELETE FROM "DictionaryMeanings" WHERE dictionary_card_id = $1`, [cardId]);
                    yield this.insertMeanings(cardId, cardMeanings);
                }
                if (cardExamples) {
                    yield this.db.query(`DELETE FROM "DictionaryExamples" WHERE dictionary_card_id = $1`, [cardId]);
                    yield this.insertExamples(cardId, cardExamples);
                }
                yield this.db.query('COMMIT');
                return true;
            }
            catch (err) {
                yield this.db.query('ROLLBACK');
                logger.error({ err, cardId }, 'Failed to update dictionary card');
                return false;
            }
        });
    }
    getCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cardQuery = `SELECT * FROM "DictionaryCards" WHERE dictionary_card_id = $1`;
            const translationQuery = `SELECT translation FROM "DictionaryTranslations" WHERE dictionary_card_id = $1`;
            const meaningQuery = `SELECT meaning FROM "DictionaryMeanings" WHERE dictionary_card_id = $1`;
            const exampleQuery = `SELECT example FROM "DictionaryExamples" WHERE dictionary_card_id = $1`;
            const cardResult = yield this.db.query(cardQuery, [cardId]);
            if (cardResult.rows.length === 0)
                return null;
            const translations = (yield this.db.query(translationQuery, [cardId])).rows.map(row => row.translation).flat();
            const meanings = (yield this.db.query(meaningQuery, [cardId])).rows.map(row => row.meaning).flat();
            const examples = (yield this.db.query(exampleQuery, [cardId])).rows.map(row => row.example).flat();
            return Object.assign(Object.assign({}, cardResult.rows[0]), { translation: translations, meaning: meanings, example: examples });
        });
    }
};
DictionaryCardModel = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Database])
], DictionaryCardModel);
export default DictionaryCardModel;
