import { UserSetsModel } from '../../../src/models/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { Permission, UserSets } from '../../../src/database/interfaces/DbInterfaces.js';
import { injectable } from 'tsyringe';

@injectable()
class UserSetsService {
    private userSetsModel: UserSetsModel;

    constructor(model: UserSetsModel) {
        this.userSetsModel = model;
    }

    async addUserSet(userId: string, setId: string, permission: Permission): Promise<UserSets | boolean> {
        if (!userId || !setId || !permission) {
            logger.warn({ userId, setId, permission }, 'Validation failed: missing data to add user set');
            return false;
        }

        try {
            return await this.userSetsModel.addUserToSet(userId, setId, permission) as UserSets;
        } catch (error) {
            logger.error({ error, userId, setId, permission }, 'Failed to add user set');
            return false;
        }
    }

    async removeUserSet(userId: string, setId: string): Promise<UserSets | boolean> {
        if (!userId || !setId) {
            logger.warn({ userId, setId }, 'Validation failed: userId or setId missing');
            return false;
        }

        try {
            return await this.userSetsModel.removeUserFromSet(userId, setId) as UserSets;
        } catch (error) {
            logger.error({ error, userId, setId }, 'Failed to remove user set');
            return false;
        }
    }

    async getUserSets(userId: string): Promise<UserSets[]> {
        if (!userId) {
            logger.warn('User ID is required to fetch sets');
            return [];
        }

        try {
            return await this.userSetsModel.getUserSets(userId) as UserSets[];
        } catch (error) {
            logger.error({ error, userId }, 'Failed to fetch sets for user');
            return [];
        }
    }

    async getUsersForSet(setId: string): Promise<UserSets[]> {
        if (!setId) {
            logger.warn('Set ID is required to fetch users');
            return [];
        }

        try {
            return await this.userSetsModel.getUsersBySet(setId) as UserSets[];
        } catch (error) {
            logger.error({ error, setId }, 'Failed to fetch users for set');
            return [];
        }
    }
}

export default UserSetsService;
