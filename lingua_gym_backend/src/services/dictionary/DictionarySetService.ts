import { DictionarySetRepository } from '../../repositories/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { IDictionarySet } from '../../database/interfaces/DbInterfaces.js';
import { injectable, inject } from 'tsyringe';

@injectable()
class DictionarySetService {
    constructor(@inject('DictionarySetRepository') private model: DictionarySetRepository) {}

    async createSet(set: IDictionarySet): Promise<IDictionarySet | null> {
        if (!set.dictionarySetId || !set.name || !set.ownerId) {
            logger.warn({ set }, 'Validation failed while creating dictionary set');
            return null;
        }
        try {
            logger.info('Creating dictionary set');
            return await this.model.createSet(set);
        } catch (error) {
            logger.error({ error, set }, 'Failed to create dictionary set');
            return null;
        }
    }

    async deleteSet(setId: string): Promise<IDictionarySet | boolean> {
        if (!setId) {
            logger.warn('Missing set ID for deletion');
            return false;
        }
        try {
            return await this.model.deleteSet(setId) as IDictionarySet;
        } catch (error) {
            logger.error({ error, setId }, 'Failed to delete dictionary set');
            return false;
        }
    }

    async getSetById(setId: string): Promise<IDictionarySet | null> {
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
