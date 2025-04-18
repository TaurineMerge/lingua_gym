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
import { UserSetModel } from '../../../src/models/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';
let UserSetService = class UserSetService {
    constructor(userSetModel) {
        this.userSetModel = userSetModel;
    }
    addUserSet(userId, setId, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !setId || !permission) {
                logger.warn({ userId, setId, permission }, 'Validation failed: missing data to add user set');
                return false;
            }
            try {
                return yield this.userSetModel.addUserToSet(userId, setId, permission);
            }
            catch (error) {
                logger.error({ error, userId, setId, permission }, 'Failed to add user set');
                return false;
            }
        });
    }
    removeUserSet(userId, setId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !setId) {
                logger.warn({ userId, setId }, 'Validation failed: userId or setId missing');
                return false;
            }
            try {
                return yield this.userSetModel.removeUserFromSet(userId, setId);
            }
            catch (error) {
                logger.error({ error, userId, setId }, 'Failed to remove user set');
                return false;
            }
        });
    }
    getUserSets(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                logger.warn('User ID is required to fetch sets');
                return [];
            }
            try {
                return yield this.userSetModel.getUserSets(userId);
            }
            catch (error) {
                logger.error({ error, userId }, 'Failed to fetch sets for user');
                return [];
            }
        });
    }
    getUsersForSet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId) {
                logger.warn('Set ID is required to fetch users');
                return [];
            }
            try {
                return yield this.userSetModel.getUsersBySet(setId);
            }
            catch (error) {
                logger.error({ error, setId }, 'Failed to fetch users for set');
                return [];
            }
        });
    }
};
UserSetService = __decorate([
    injectable(),
    __param(0, inject('UserSetModel')),
    __metadata("design:paramtypes", [UserSetModel])
], UserSetService);
export default UserSetService;
