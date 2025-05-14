import { UserSetRepository } from '../../repositories/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { Permission, IUserSet } from '../../../src/database/interfaces/DbInterfaces.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserSetService {
    constructor(@inject('UserSetModel') private userSetModel: UserSetRepository) {}

    async addUserSet(userId: string, setId: string, permission: Permission): Promise<IUserSet | boolean> {
        if (!userId || !setId || !permission) {
            logger.warn({ userId, setId, permission }, 'Validation failed: missing data to add user set');
            return false;
        }

        try {
            return await this.userSetModel.addUserToSet(userId, setId, permission) as IUserSet;
        } catch (error) {
            logger.error({ error, userId, setId, permission }, 'Failed to add user set');
            return false;
        }
    }

    async removeUserSet(userId: string, setId: string): Promise<IUserSet | boolean> {
        if (!userId || !setId) {
            logger.warn({ userId, setId }, 'Validation failed: userId or setId missing');
            return false;
        }

        try {
            return await this.userSetModel.removeUserFromSet(userId, setId) as IUserSet;
        } catch (error) {
            logger.error({ error, userId, setId }, 'Failed to remove user set');
            return false;
        }
    }

    async getUserSets(userId: string): Promise<IUserSet[]> {
        if (!userId) {
            logger.warn('User ID is required to fetch sets');
            return [];
        }

        try {
            return await this.userSetModel.getUserSets(userId) as IUserSet[];
        } catch (error) {
            logger.error({ error, userId }, 'Failed to fetch sets for user');
            return [];
        }
    }

    async getUsersForSet(setId: string): Promise<IUserSet[]> {
        if (!setId) {
            logger.warn('Set ID is required to fetch users');
            return [];
        }

        try {
            return await this.userSetModel.getUsersBySet(setId) as IUserSet[];
        } catch (error) {
            logger.error({ error, setId }, 'Failed to fetch users for set');
            return [];
        }
    }
}

export default UserSetService;
