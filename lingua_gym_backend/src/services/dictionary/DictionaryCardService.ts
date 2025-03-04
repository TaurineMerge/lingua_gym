import { v4 as uuidv4 } from 'uuid';
import { DictionaryCardModel } from '../../models/dictionary/dictionary.js';
import { DictionaryCard, CardTranslation, CardMeaning, CardExample } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';

class DictionaryCardService {
    private dictionaryCardModel: DictionaryCardModel;

    constructor(dictionaryCardModel: DictionaryCardModel) {
        this.dictionaryCardModel = dictionaryCardModel;
    }

    async createCard(
        cardGeneralData: Omit<DictionaryCard, 'dictionaryCardId'>,
        cardTranslations: CardTranslation[],
        cardMeanings: CardMeaning[],
        cardExamples: CardExample[]
    ): Promise<string> {
        this.validateCardData(cardGeneralData);

        const cardId = uuidv4();
        logger.info({ cardId, cardGeneralData }, 'Creating new dictionary card');

        const createdId = await this.dictionaryCardModel.createCard(
            { ...cardGeneralData, dictionaryCardId: cardId },
            cardTranslations,
            cardMeanings,
            cardExamples
        );

        logger.info({ cardId: createdId }, 'Dictionary card created successfully');
        return createdId;
    }

    async getCardById(cardId: string): Promise<DictionaryCard & { translation: string[], meaning: string[], example: string[] } | null> {
        logger.info({ cardId }, 'Fetching dictionary card');
        const card = await this.dictionaryCardModel.getCardById(cardId);

        if (!card) {
            logger.warn({ cardId }, 'Dictionary card not found');
            return null;
        }

        logger.info({ cardId }, 'Dictionary card fetched successfully');
        return card;
    }

    async deleteCard(cardId: string): Promise<boolean> {
        logger.info({ cardId }, 'Attempting to delete dictionary card');
        const deleted = await this.dictionaryCardModel.removeCardById(cardId);

        if (deleted) {
            logger.info({ cardId }, 'Dictionary card deleted successfully');
        } else {
            logger.warn({ cardId }, 'Dictionary card not found or already deleted');
        }

        return deleted;
    }

    async addTagToCard(cardId: string, tagId: string): Promise<boolean> {
        logger.info({ cardId, tagId }, 'Adding tag to dictionary card');
        const success = await this.dictionaryCardModel.addTagToCard(cardId, tagId);

        if (success) {
            logger.info({ cardId, tagId }, 'Tag added successfully');
        } else {
            logger.warn({ cardId, tagId }, 'Failed to add tag (maybe already added)');
        }

        return success;
    }

    async removeTagFromCard(cardId: string, tagId: string): Promise<boolean> {
        logger.info({ cardId, tagId }, 'Removing tag from dictionary card');
        const success = await this.dictionaryCardModel.removeTagFromCard(cardId, tagId);

        if (success) {
            logger.info({ cardId, tagId }, 'Tag removed successfully');
        } else {
            logger.warn({ cardId, tagId }, 'Failed to remove tag (maybe it was not assigned)');
        }

        return success;
    }

    async getTagsForCard(cardId: string): Promise<string[]> {
        logger.info({ cardId }, 'Fetching tags for dictionary card');
        return await this.dictionaryCardModel.getTagsForCard(cardId);
    }

    private validateCardData(cardData: Omit<DictionaryCard, 'dictionaryCardId'>): void {
        if (!cardData.original.trim()) throw new Error('Original field cannot be empty');
    }
}

export default DictionaryCardService;
