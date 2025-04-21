import { SetCardModel } from '../../../src/models/dictionary/dictionary.js';
import { DictionaryCard, SetCard } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class SetCardService {
    constructor(@inject('SetCardModel') private model: SetCardModel) {}

    async addCardToSet(setId: string, cardId: string): Promise<SetCard | boolean> {
        if (!setId || !cardId) {
            logger.warn({ setId, cardId }, 'Validation failed: setId or cardId missing');
            return false;
        }

        try {
            return await this.model.addCardToSet(setId, cardId) as SetCard;
        } catch (error) {
            logger.error({ error, setId, cardId }, 'Failed to add card to set');
            return false;
        }
    }

    async removeCardFromSet(setId: string, cardId: string): Promise<SetCard | boolean> {
        if (!setId || !cardId) {
            logger.warn({ setId, cardId }, 'Validation failed: setId or cardId missing');
            return false;
        }

        try {
            return await this.model.removeCardFromSet(setId, cardId) as SetCard;
        } catch (error) {
            logger.error({ error, setId, cardId }, 'Failed to remove card from set');
            return false;
        }
    }

    async getCardsForSet(setId: string): Promise<DictionaryCard[]> {
        if (!setId) {
            logger.warn('Set ID is required to fetch cards');
            return [];
        }

        try {
            return await this.model.getCardsBySet(setId) as DictionaryCard[];
        } catch (error) {
            logger.error({ error, setId }, 'Failed to get cards for set');
            return [];
        }
    }
}

export default SetCardService;
