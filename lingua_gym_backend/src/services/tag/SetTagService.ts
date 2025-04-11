import { SetTagModel } from '../../../src/models/tag/tag.js';
import { DictionarySet } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';

@injectable()
class SetTagService {
    private setTagModel: SetTagModel;

    constructor(model: SetTagModel) {
        this.setTagModel = model;
    }

    async addTagToSet(setId: string, tagId: string): Promise<boolean> {
        if (!setId || !tagId) {
            logger.warn({ setId, tagId }, 'Validation failed: setId or tagId missing');
            return false;
        }

        try {
            return await this.setTagModel.addTagToSet(setId, tagId);
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Failed to add tag to set');
            return false;
        }
    }

    async removeTagFromSet(setId: string, tagId: string): Promise<boolean> {
        if (!setId || !tagId) {
            logger.warn({ setId, tagId }, 'Validation failed: setId or tagId missing');
            return false;
        }

        try {
            return await this.setTagModel.removeTagFromSet(setId, tagId);
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Failed to remove tag from set');
            return false;
        }
    }

    async getTagsForSet(setId: string): Promise<DictionarySet[]> {
        if (!setId) {
            logger.warn('Set ID is required to get tags');
            return [];
        }

        try {
            return await this.setTagModel.getTagsForSet(setId);
        } catch (error) {
            logger.error({ error, setId }, 'Failed to get tags for set');
            return [];
        }
    }
}

export default SetTagService;
