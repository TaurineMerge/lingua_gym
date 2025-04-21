import { DictionarySetModel } from '../../models/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { DictionarySet } from '../../database/interfaces/DbInterfaces.js';
import { injectable, inject } from 'tsyringe';

@injectable()
class DictionarySetService {
    constructor(@inject('DictionarySetModel') private model: DictionarySetModel) {}

    async createSet(set: DictionarySet): Promise<DictionarySet | null> {
        if (!set.dictionarySetId || !set.name || !set.ownerId) {
            logger.warn({ set }, 'Validation failed while creating dictionary set');
            return null;
        }

        try {
            return await this.model.createSet(set);
        } catch (error) {
            logger.error({ error, set }, 'Failed to create dictionary set');
            return null;
        }
    }

    async deleteSet(setId: string): Promise<DictionarySet | boolean> {
        if (!setId) {
            logger.warn('Missing set ID for deletion');
            return false;
        }

        try {
            return await this.model.deleteSet(setId) as DictionarySet;
        } catch (error) {
            logger.error({ error, setId }, 'Failed to delete dictionary set');
            return false;
        }
    }

    async getSetById(setId: string): Promise<DictionarySet | null> {
        if (!setId) {
            logger.warn('Set ID is required');
            return null;
        }

        try {
            return await this.model.getSetById(setId);
        } catch (error) {
            logger.error({ error, setId }, 'Failed to fetch dictionary set');
            return null;
        }
    }
}

export default DictionarySetService;
