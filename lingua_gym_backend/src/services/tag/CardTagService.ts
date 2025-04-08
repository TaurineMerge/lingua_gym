import { CardTagsModel } from '../../../src/models/tag/tag.js';
import logger from '../../utils/logger/Logger.js';

class CardTagsService {
    private model: CardTagsModel;

    constructor(model: CardTagsModel) {
        this.model = model;
    }

    async addTagToCard(cardId: string, tagId: string): Promise<boolean> {
        if (!cardId || !tagId) {
            logger.warn({ cardId, tagId }, 'Validation failed: cardId or tagId missing');
            return false;
        }

        try {
            return await this.model.addTagToCard(cardId, tagId);
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Failed to add tag to card');
            return false;
        }
    }

    async removeTagFromCard(cardId: string, tagId: string): Promise<boolean> {
        if (!cardId || !tagId) {
            logger.warn({ cardId, tagId }, 'Validation failed: cardId or tagId missing');
            return false;
        }

        try {
            return await this.model.removeTagFromCard(cardId, tagId);
        } catch (error) {
            logger.error({ error, cardId, tagId }, 'Failed to remove tag from card');
            return false;
        }
    }

    async getTagsForCard(cardId: string): Promise<string[]> {
        if (!cardId) {
            logger.warn('Card ID is required to get tags');
            return [];
        }

        try {
            return await this.model.getTagsForCard(cardId);
        } catch (error) {
            logger.error({ error, cardId }, 'Failed to get tags for card');
            return [];
        }
    }
}

export default CardTagsService;
