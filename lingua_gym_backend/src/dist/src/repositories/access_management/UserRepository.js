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
import { injectable, inject } from 'tsyringe';
let UserRepository = class UserRepository {
    constructor(db) {
        this.db = db;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO "User" (user_id, username, display_name, password_hash, email, token_version, profile_picture, email_verified, registration_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
            const values = [
                user.userId,
                user.username,
                user.displayName,
                user.passwordHash,
                user.email,
                user.tokenVersion,
                user.profilePicture,
                user.emailVerified,
                user.registrationMethod
            ];
            try {
                logger.info('Creating user...');
                yield this.db.query(query, values);
                logger.info('User created successfully');
                return true;
            }
            catch (err) {
                logger.error('Error creating user:', err);
                throw err;
            }
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT 
        user_id as "userId",
        username,
        display_name as "displayName",
        password_hash as "passwordHash",
        email,
        token_version as "tokenVersion",
        profile_picture as "profilePicture",
        email_verified as "emailVerified",
        registration_method as "registrationMethod",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM "User" WHERE user_id = $1`;
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
            const query = `
      SELECT 
        user_id as "userId",
        username,
        display_name as "displayName",
        password_hash as "passwordHash",
        email,
        token_version as "tokenVersion",
        profile_picture as "profilePicture",
        email_verified as "emailVerified",
        registration_method as "registrationMethod",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM "User" WHERE email = $1`;
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
            const query = `
      SELECT 
        user_id as "userId",
        username,
        display_name as "displayName",
        password_hash as "passwordHash",
        email,
        token_version as "tokenVersion",
        profile_picture as "profilePicture",
        email_verified as "emailVerified",
        registration_method as "registrationMethod",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM "User" WHERE username = $1`;
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
                .map((key, index) => {
                const keyMapping = {
                    passwordHash: 'password_hash',
                    emailVerified: 'email_verified',
                    tokenVersion: 'token_version',
                    profilePicture: 'profile_picture',
                    displayName: 'display_name'
                };
                key = keyMapping[key] || key;
                return `"${key}" = $${index + 2}`;
            })
                .join(", ");
            const values = [user_id, ...Object.values(updates)];
            const query = `UPDATE "User" SET ${fields} WHERE user_id = $1`;
            try {
                yield this.db.query(query, values);
                return true;
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
                return true;
            }
            catch (err) {
                console.error('Error deleting user:', err);
                throw err;
            }
        });
    }
};
UserRepository = __decorate([
    injectable(),
    __param(0, inject('Database')),
    __metadata("design:paramtypes", [Database])
], UserRepository);
export default UserRepository;
