var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';
let UserMetadataModel = class UserMetadataModel {
    constructor(db) {
        this.db = db;
    }
    createUserMetadata(userMetadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `;
            const values = [
                userMetadata.userId,
                userMetadata.lastLogin,
                userMetadata.signupDate
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
            const query = `
    SELECT 
      user_id as "userId", 
      last_login as "lastLogin", 
      signup_date as "signupDate" 
    FROM "UserMetadata" 
    WHERE user_id = $1`;
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
                .map((key, index) => {
                const keyMapping = {
                    lastLogin: 'last_login',
                    signupDate: 'signup_date'
                };
                key = keyMapping[key] || key;
                return `"${key}" = $${index + 2}`;
            })
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
};
UserMetadataModel = __decorate([
    injectable(),
    __param(0, inject('Database')),
    __metadata("design:paramtypes", [Database])
], UserMetadataModel);
export default UserMetadataModel;
