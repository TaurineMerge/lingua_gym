var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from '../../utils/logger/Logger';
class UserMetadataModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createUserMetadata(userMetadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `;
            const values = [
                userMetadata.user_id,
                userMetadata.last_login,
                userMetadata.signup_date
            ];
            try {
                logger.info('Creating user metadata...');
                yield this.db.query(query, values);
                logger.info('User metadata created successfully');
            }
            catch (err) {
                logger.error('Error creating user metadata:', err);
                throw err;
            }
        });
    }
    getUserMetadataById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM "UserMetadata" WHERE user_id = $1`;
            try {
                const result = yield this.db.query(query, [user_id]);
                return result.rows[0] || null;
            }
            catch (err) {
                logger.error('Error fetching user metadata by ID:', err);
                throw err;
            }
        });
    }
    updateUserMetadataById(user_id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(updates)
                .map((key, index) => `"${key}" = $${index + 2}`)
                .join(", ");
            const values = [user_id, ...Object.values(updates)];
            const query = `UPDATE "UserMetadata" SET ${fields} WHERE user_id = $1`;
            try {
                logger.info(`Updating metadata for user: ${user_id}`);
                yield this.db.query(query, values);
                logger.info('User metadata updated successfully');
            }
            catch (err) {
                logger.error('Error updating user metadata:', err);
                throw err;
            }
        });
    }
    deleteUserMetadataById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM "UserMetadata" WHERE user_id = $1`;
            try {
                logger.info(`Deleting metadata for user: ${user_id}`);
                yield this.db.query(query, [user_id]);
                logger.info('User metadata deleted successfully');
            }
            catch (err) {
                logger.error('Error deleting user metadata:', err);
                throw err;
            }
        });
    }
}
export default UserMetadataModel;
