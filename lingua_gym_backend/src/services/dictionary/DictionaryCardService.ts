import { ICardExample, ICardMeaning, ICardTranslation, IDictionaryCard } from '../../database/interfaces/DbInterfaces.js';
import { Card } from '../../models/dictionary/dictionary.js';
import { DictionaryCardRepository } from '../../repositories/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { injectable, inject } from 'tsyringe';

@injectable()
class DictionaryCardService {
    constructor(@inject('DictionaryCardModel') private cardRepository: DictionaryCardRepository) {}

    async createCard(generalCardData: IDictionaryCard, cardTranslations: Array<ICardTranslation>, cardMeanings: Array<ICardMeaning>, cardExamples: Array<ICardExample>): Promise<string | null> {
        try {
            const card = new Card(generalCardData, cardTranslations, cardMeanings, cardExamples);
            return await this.cardRepository.createCard(card.card);
        } catch (error) {
            logger.error({ error, generalCardData }, 'Failed to create dictionary card');
            return null;
        }
    }

    async getCardById(cardId: string): Promise<IDictionaryCard | null> {
        if (!cardId) {
            logger.warn('Card ID is required');
            return null;
        }
        try {
            return await this.cardRepository.getCardById(cardId);
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
            return await this.cardRepository.removeCardById(cardId);
        } catch (error) {
            logger.error({ error, cardId }, 'Failed to delete dictionary card');
            return false;
        }
    }
}

export default DictionaryCardService;
