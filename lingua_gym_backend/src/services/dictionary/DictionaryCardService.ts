import { DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { DictionaryCard, CardTranslation, CardMeaning, CardExample } from '../../database/interfaces/DbInterfaces.js';
import { injectable, inject } from 'tsyringe';

@injectable()
class DictionaryCardService {
    constructor(@inject('DictionaryCardModel') private model: DictionaryCardModel) {}

    async createCard(card: DictionaryCard, cardTranslations: Array<CardTranslation>, cardMeanings: Array<CardMeaning>, cardExamples: Array<CardExample>): Promise<string | null> {
        if (!card.cardId || !card.original) {
            logger.warn({ card }, 'Validation failed while creating dictionary card');
            return null;
        }

        try {
            return await this.model.createCard(card, cardTranslations, cardMeanings, cardExamples);
        } catch (error) {
            logger.error({ error, card }, 'Failed to create dictionary card');
            return null;
        }
    }

    async getCardById(cardId: string): Promise<DictionaryCard | null> {
        if (!cardId) {
            logger.warn('Card ID is required');
            return null;
        }

        try {
            return await this.model.getCardById(cardId);
        } catch (error) {
            logger.error({ error, cardId }, 'Failed to fetch dictionary card');
            return null;
        }
    }

    async removeCardById(cardId: string): Promise<boolean> {
        if (!cardId) {
            logger.warn('Missing card ID for deletion');
            return false;
        }

        try {
            return await this.model.removeCardById(cardId);
        } catch (error) {
            logger.error({ error, cardId }, 'Failed to delete dictionary card');
            return false;
        }
    }
}

export default DictionaryCardService;
