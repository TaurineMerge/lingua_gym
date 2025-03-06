var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from '../../utils/logger/Logger.js';
class UserSetsModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    addUserToSet(userId, setId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO user_sets (user_id, set_id, role) VALUES ($1, $2, $3) RETURNING *`;
            try {
                const result = yield this.db.query(query, [userId, setId, role]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error adding user to set');
                throw error;
            }
        });
    }
    removeUserFromSet(userId, setId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM user_sets WHERE user_id = $1 AND set_id = $2 RETURNING *`;
            try {
                const result = yield this.db.query(query, [userId, setId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error removing user from set');
                throw error;
            }
        });
    }
    getUsersBySet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT user_id, role FROM user_sets WHERE set_id = $1`;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows || null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching users for set');
                throw error;
            }
        });
    }
    getUserRole(userId, setId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `SELECT role FROM user_sets WHERE user_id = $1 AND set_id = $2`;
            try {
                const result = yield this.db.query(query, [userId, setId]);
                return ((_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.role) || null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching user role in set');
                throw error;
            }
        });
    }
}
export default UserSetsModel;
