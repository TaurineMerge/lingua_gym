import { SetTagsModel } from '../../../src/models/tag/tag.js';
import logger from '../../utils/logger/Logger.js';

class SetTagsService {
    private setTagsModel: SetTagsModel;

    constructor(model: SetTagsModel) {
        this.setTagsModel = model;
    }

    async addTagToSet(setId: string, tagId: string): Promise<boolean> {
        if (!setId || !tagId) {
            logger.warn({ setId, tagId }, 'Validation failed: setId or tagId missing');
            return false;
        }

        try {
            return await this.setTagsModel.addTagToSet(setId, tagId);
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
            return await this.setTagsModel.removeTagFromSet(setId, tagId);
        } catch (error) {
            logger.error({ error, setId, tagId }, 'Failed to remove tag from set');
            return false;
        }
    }

    async getTagsForSet(setId: string): Promise<string[]> {
        if (!setId) {
            logger.warn('Set ID is required to get tags');
            return [];
        }

        try {
            return await this.setTagsModel.getTagsForSet(setId);
        } catch (error) {
            logger.error({ error, setId }, 'Failed to get tags for set');
            return [];
        }
    }
}

export default SetTagsService;
