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
let UserSetModel = class UserSetModel {
    constructor(db) {
        this.db = db;
    }
    addUserToSet(userId, setId, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO "UserSet" (user_id, set_id, permission) VALUES ($1, $2, $3) RETURNING user_id AS "userId", set_id AS "setId", permission`;
            try {
                const result = yield this.db.query(query, [userId, setId, permission]);
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
            const query = `DELETE FROM "UserSet" WHERE user_id = $1 AND set_id = $2 RETURNING user_id AS "userId", set_id AS "setId", permission`;
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
            const query = `SELECT user_id AS "userId", set_id AS "setId", permission FROM "UserSet" WHERE set_id = $1`;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows.length > 0 ? result.rows : null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching users for set');
                throw error;
            }
        });
    }
    getUserPermission(userId, setId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `SELECT permission FROM "UserSet" WHERE user_id = $1 AND set_id = $2`;
            try {
                const result = yield this.db.query(query, [userId, setId]);
                return ((_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.permission) || null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching user role in set');
                throw error;
            }
        });
    }
    getUserSets(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT set_id, permission FROM "UserSet" WHERE user_id = $1`;
            try {
                const result = yield this.db.query(query, [userId]);
                return result.rows.length > 0 ? result.rows : null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching sets for user');
                throw error;
            }
        });
    }
};
UserSetModel = __decorate([
    injectable(),
    __param(0, inject('Database')),
    __metadata("design:paramtypes", [Database])
], UserSetModel);
export default UserSetModel;
