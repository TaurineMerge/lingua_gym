import { SetTagModel } from '../../repositories/tag/tag.js';
import { SetTag } from '../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class SetTagService {
    constructor(@inject('SetTagModel') private setTagModel: SetTagModel) {}

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

    async getTagsForSet(setId: string): Promise<SetTag[]> {
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
