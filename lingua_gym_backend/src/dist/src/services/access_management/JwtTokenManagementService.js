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
import { UserRepository } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
import { injectable, inject } from 'tsyringe';
import { JwtTokenManager, User } from '../../models/access_management/access_management.js';
let TokenManagementService = class TokenManagementService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.jwtTokenManager = new JwtTokenManager();
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Refresh token request received');
            const payload = this.jwtTokenManager.verifyRefreshToken(refreshToken);
            const user = new User(yield this.userRepository.getUserById(payload.userId));
            console.log(user.tokenVersion, payload.tokenVersion);
            if (!user || user.tokenVersion !== payload.tokenVersion) {
                logger.warn({ userId: payload.userId }, 'Invalid refresh token');
                throw new Error('Invalid refresh token');
            }
            const isIncremented = yield this.incrementTokenVersion(user);
            if (!isIncremented) {
                logger.error({ userId: user.userId }, 'Failed to increment token version');
                throw new Error('Could not update token version');
            }
            else {
                logger.info({ userId: user.userId }, 'Token version incremented');
                user.tokenVersion++;
            }
            const newAccessToken = this.jwtTokenManager.generateAccessToken(user);
            const newRefreshToken = this.jwtTokenManager.generateRefreshToken(user);
            logger.info({ userId: user.userId }, 'Tokens refreshed');
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
    incrementTokenVersion(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(user.userId, 'Incrementing token version');
                return yield this.userRepository.updateUserById(user.userId, { tokenVersion: user.tokenVersion + 1 });
            }
            catch (error) {
                logger.error(user.userId, { error }, 'Failed to increment token version');
                throw new Error('Could not update token version');
            }
        });
    }
    checkAccessToken(token) {
        return this.jwtTokenManager.verifyAccessToken(token);
    }
    checkRefreshToken(token) {
        return this.jwtTokenManager.verifyRefreshToken(token);
    }
};
TokenManagementService = __decorate([
    injectable(),
    __param(0, inject('UserRepository')),
    __metadata("design:paramtypes", [UserRepository])
], TokenManagementService);
export default TokenManagementService;
