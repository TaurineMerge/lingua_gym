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
class UserModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO "User" (user_id, username, display_name, password_hash, email, token_version, profile_picture, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
            const values = [
                user.user_id,
                user.username,
                user.display_name,
                user.password_hash,
                user.email,
                user.token_version,
                user.profile_picture,
                user.email_verified,
            ];
            try {
                logger.info('Creating user...');
                yield this.db.query(query, values);
                logger.info('User created successfully');
            }
            catch (err) {
                logger.error('Error creating user:', err);
                throw err;
            }
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM "User" WHERE user_id = $1`;
            try {
                const result = yield this.db.query(query, [user_id]);
                return result.rows[0] || null;
            }
            catch (err) {
                console.error('Error fetching user by ID:', err);
                throw err;
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM "User" WHERE email = $1`;
            try {
                const result = yield this.db.query(query, [email]);
                return result.rows[0] || null;
            }
            catch (err) {
                console.error('Error fetching user by Email:', err);
                throw err;
            }
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM "User" WHERE username = $1`;
            try {
                const result = yield this.db.query(query, [username]);
                return result.rows[0] || null;
            }
            catch (err) {
                console.error('Error fetching user by username:', err);
                throw err;
            }
        });
    }
    updateUserById(user_id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(updates)
                .map((key, index) => `"${key}" = $${index + 2}`)
                .join(", ");
            const values = [user_id, ...Object.values(updates)];
            const query = `UPDATE "User" SET ${fields} WHERE user_id = $1`;
            try {
                yield this.db.query(query, values);
            }
            catch (err) {
                console.error('Error updating user:', err);
                throw err;
            }
        });
    }
    deleteUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM "User" WHERE user_id = $1`;
            try {
                yield this.db.query(query, [user_id]);
            }
            catch (err) {
                console.error('Error deleting user:', err);
                throw err;
            }
        });
    }
}
export default UserModel;
