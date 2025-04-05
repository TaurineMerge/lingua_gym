import Database from '../../database/config/db-connection.js';
import { DictionaryCard, CardTranslation, CardMeaning, CardExample } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';

class DictionaryCardModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async createCard(cardGeneralData: DictionaryCard, cardTranslations: Array<CardTranslation>, cardMeanings: Array<CardMeaning>, cardExamples: Array<CardExample>): Promise<string> {
        try {
            await this.db.query('BEGIN');
            
            const cardResult = await this.db.query<DictionaryCard>(
                `INSERT INTO DictionaryCards (dictionary_card_id, original, transcription, pronunciation)
                 VALUES ($1, $2, $3, $4) RETURNING dictionary_card_id`,
                [cardGeneralData.dictionaryCardId, cardGeneralData.original, cardGeneralData.transcription, cardGeneralData.pronunciation]
            );

            const cardId = cardResult.rows[0].dictionaryCardId;
            
            await this.insertTranslations(cardId, cardTranslations);
            await this.insertMeanings(cardId, cardMeanings);
            await this.insertExamples(cardId, cardExamples);
            
            await this.db.query('COMMIT');
            return cardId;
        } catch (err) {
            await this.db.query('ROLLBACK');
            logger.error({ err }, 'Failed to create dictionary card');
            throw err;
        }
    }

    private async insertTranslations(cardId: string, cardTranslations: Array<CardTranslation>): Promise<void> {
        const query = `INSERT INTO DictionaryTranslations (dictionary_card_id, translation) VALUES ($1, $2)`;
        for (const translation of cardTranslations) {
            await this.db.query(query, [cardId, translation.translation]);
        }
    }

    private async insertMeanings(cardId: string, cardMeanings: Array<CardMeaning>): Promise<void> {
        const query = `INSERT INTO DictionaryMeanings (dictionary_card_id, meaning) VALUES ($1, $2)`;
        for (const meaning of cardMeanings) {
            await this.db.query(query, [cardId, meaning.meaning]);
        }
    }

    private async insertExamples(cardId: string, cardExamples: Array<CardExample>): Promise<void> {
        const query = `INSERT INTO DictionaryExamples (dictionary_card_id, example) VALUES ($1, $2)`;
        for (const example of cardExamples) {
            await this.db.query(query, [cardId, example.example]);
        }
    }

    async removeCardById(cardId: string): Promise<boolean> {
        try {
            await this.db.query('BEGIN');
    
            await this.db.query(`DELETE FROM DictionaryTranslations WHERE dictionary_card_id = $1`, [cardId]);
            await this.db.query(`DELETE FROM DictionaryMeanings WHERE dictionary_card_id = $1`, [cardId]);
            await this.db.query(`DELETE FROM DictionaryExamples WHERE dictionary_card_id = $1`, [cardId]);
            await this.db.query(`DELETE FROM card_tags WHERE card_id = $1`, [cardId]);
    
            const result = await this.db.query(`DELETE FROM DictionaryCards WHERE dictionary_card_id = $1 RETURNING dictionary_card_id`, [cardId]);
    
            await this.db.query('COMMIT');
    
            if (result.rowCount! > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            await this.db.query('ROLLBACK');
            logger.error({ error, cardId }, 'Error deleting dictionary card');
            throw error;
        }
    }
    
    async updateCard(
        cardId: string,
        cardGeneralData: Partial<DictionaryCard>,
        cardTranslations?: Array<CardTranslation>,
        cardMeanings?: Array<CardMeaning>,
        cardExamples?: Array<CardExample>
    ): Promise<boolean> {
        try {
            await this.db.query('BEGIN');
    
            if (Object.keys(cardGeneralData).length > 0) {
                const fieldsToUpdate = Object.entries(cardGeneralData)
                    .filter(([, value]) => value !== undefined)
                    .map(([field]) => field as keyof DictionaryCard);
    
                if (fieldsToUpdate.length > 0) {
                    const setClause = fieldsToUpdate
                        .map((field, index) => `${field} = $${index + 2}`)
                        .join(', ');
    
                    await this.db.query(
                        `UPDATE DictionaryCards SET ${setClause} WHERE dictionary_card_id = $1`,
                        [cardId, ...fieldsToUpdate.map(field => cardGeneralData[field])]
                    );
                }
            }
    
            if (cardTranslations) {
                await this.db.query(
                    `DELETE FROM DictionaryTranslations WHERE dictionary_card_id = $1`,
                    [cardId]
                );
                await this.insertTranslations(cardId, cardTranslations);
            }

            if (cardMeanings) {
                await this.db.query(
                    `DELETE FROM DictionaryMeanings WHERE dictionary_card_id = $1`,
                    [cardId]
                );
                await this.insertMeanings(cardId, cardMeanings);
            }

            if (cardExamples) {
                await this.db.query(
                    `DELETE FROM DictionaryExamples WHERE dictionary_card_id = $1`,
                    [cardId]
                );
                await this.insertExamples(cardId, cardExamples);
            }
    
            await this.db.query('COMMIT');
            return true;
        } catch (err) {
            await this.db.query('ROLLBACK');
            logger.error({ err, cardId }, 'Failed to update dictionary card');
            return false;
        }
    }

    async getCardById(cardId: string): Promise<DictionaryCard & { translation: string[], meaning: string[], example: string[] } | null> {
        const cardQuery = `SELECT * FROM DictionaryCards WHERE dictionary_card_id = $1`;
        const translationQuery = `SELECT translation FROM DictionaryTranslations WHERE dictionary_card_id = $1`;
        const meaningQuery = `SELECT meaning FROM DictionaryMeanings WHERE dictionary_card_id = $1`;
        const exampleQuery = `SELECT example FROM DictionaryExamples WHERE dictionary_card_id = $1`;
        
        const cardResult = await this.db.query<DictionaryCard>(cardQuery, [cardId]);
        if (cardResult.rows.length === 0) return null;
        
        const translations = (await this.db.query(translationQuery, [cardId])).rows.map(row => row.translation).flat();
        const meanings = (await this.db.query(meaningQuery, [cardId])).rows.map(row => row.meaning).flat();
        const examples = (await this.db.query(exampleQuery, [cardId])).rows.map(row => row.example).flat();
        
        return {
            ...cardResult.rows[0],
            translation: translations,
            meaning: meanings,
            example: examples
        };
    }

    async addTagToCard(cardId: string, tagId: string): Promise<boolean> {
        const query = `INSERT INTO card_tags (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
        try {
            const result = await this.db.query(query, [cardId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Error adding tag to card');
            return false;
        }
    }

    async removeTagFromCard(cardId: string, tagId: string): Promise<boolean> {
        const query = `DELETE FROM card_tags WHERE card_id = $1 AND tag_id = $2;`;
        try {
            const result = await this.db.query(query, [cardId, tagId]);
            return result.rowCount! > 0;
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Error removing tag from card');
            return false;
        }
    }

    async getTagsForCard(cardId: string): Promise<string[]> {
        const query = `SELECT t.name FROM tags t INNER JOIN card_tags ct ON t.tag_id = ct.tag_id WHERE ct.card_id = $1;`;
        try {
            const result = await this.db.query<{ name: string }>(query, [cardId]);
            return result.rows.map(row => row.name);
        } catch (error) {
            logger.error({ error, cardId }, 'Error fetching tags for card');
            return [];
        }
    }
}

export default DictionaryCardModel;
