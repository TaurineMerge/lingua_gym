import { TagModel } from '../../repositories/tag/tag.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class TagService {
    constructor(@inject('TagModel') private tagModel: TagModel) {}

    async createTag(tagId: string, name: string): Promise<string | null> {
        if (!tagId || !name) {
            logger.warn({ tagId, name }, 'Validation failed: tagId or name missing');
            return null;
        }

        try {
            return await this.tagModel.createTag(tagId, name);
        } catch (error) {
            logger.error({ error, tagId, name }, 'Failed to create tag');
            return null;
        }
    }

    async getTagById(tagId: string) {
        if (!tagId) {
            logger.warn('Tag ID is required to fetch tag');
            return null;
        }

        try {
            return await this.tagModel.getTagById(tagId);
        } catch (error) {
            logger.error({ error, tagId }, 'Failed to get tag by ID');
            return null;
        }
    }

    async getAllTags() {
        try {
            return await this.tagModel.getAllTags();
        } catch (error) {
            logger.error({ error }, 'Failed to get all tags');
            return [];
        }
    }

    async updateTag(tagId: string, name: string): Promise<boolean> {
        if (!tagId || !name) {
            logger.warn({ tagId, name }, 'Validation failed: tagId or name missing');
            return false;
        }

        try {
            return await this.tagModel.updateTag(tagId, name);
        } catch (error) {
            logger.error({ error, tagId, name }, 'Failed to update tag');
            return false;
        }
    }

    async deleteTag(tagId: string): Promise<boolean> {
        if (!tagId) {
            logger.warn('Tag ID is required to delete tag');
            return false;
        }

        try {
            return await this.tagModel.deleteTag(tagId);
        } catch (error) {
            logger.error({ error, tagId }, 'Failed to delete tag');
            return false;
        }
    }
}

export default TagService;
