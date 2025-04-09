var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';
let UserPasswordResetModel = class UserPasswordResetModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createResetEntry(reset) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO "UserPasswordReset" (user_id, password_reset_token, password_reset_token_expiration) VALUES ($1, $2, $3)';
            const values = [
                reset.user_id,
                reset.password_reset_token,
                reset.password_reset_token_expiration,
            ];
            try {
                logger.info('Creating password reset entry...');
                yield this.db.query(query, values);
                logger.info('Password reset entry created successfully');
            }
            catch (err) {
                logger.error('Error creating password reset entry:', err);
                throw err;
            }
        });
    }
    getByToken(password_reset_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM "UserPasswordReset" WHERE password_reset_token = $1';
            try {
                logger.info('Fetching password reset entry by token...');
                const result = yield this.db.query(query, [password_reset_token]);
                if (result.rows.length > 0) {
                    logger.info('Password reset entry found');
                }
                else {
                    logger.info('Password reset entry not found');
                }
                return result.rows[0] || null;
            }
            catch (err) {
                logger.error('Error fetching password reset entry by token:', err);
                throw err;
            }
        });
    }
    invalidateToken(password_reset_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM "UserPasswordReset" WHERE password_reset_token = $1';
            try {
                logger.info('Invalidating password reset token...');
                yield this.db.query(query, [password_reset_token]);
                logger.info('Password reset token invalidated successfully');
            }
            catch (err) {
                logger.error('Error invalidating password reset token:', err);
                throw err;
            }
        });
    }
    deleteRequestByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM "UserPasswordReset" WHERE user_id = $1';
            try {
                logger.info('Deleting password reset request...');
                yield this.db.query(query, [user_id]);
                logger.info('Password reset request deleted successfully');
            }
            catch (err) {
                logger.error('Error deleting password reset request:', err);
                throw err;
            }
        });
    }
    deleteExpiredRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM "UserPasswordReset" WHERE password_reset_token_expiration <= NOW()';
            try {
                logger.info('Deleting expired password reset requests...');
                yield this.db.query(query);
                logger.info('Expired password reset requests deleted successfully');
            }
            catch (err) {
                logger.error('Error deleting expired password reset requests:', err);
                throw err;
            }
        });
    }
};
UserPasswordResetModel = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Database])
], UserPasswordResetModel);
export default UserPasswordResetModel;
