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
import { JwtTokenManager, User } from '../../models/access_management/access_management.js';
import { UserRepository } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import TokenManagementService from './JwtTokenManagementService.js';
import { injectable, inject } from 'tsyringe';
let AuthenticationService = class AuthenticationService {
    constructor(userRepository, jwtTokenService) {
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
        this.jwtTokenManager = new JwtTokenManager();
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ email }, 'User login attempt');
                const user = new User(yield this.userRepository.getUserByEmail(email));
                user.verifyPasswordHash(password);
                const accessToken = this.jwtTokenManager.generateAccessToken(user);
                const refreshToken = this.jwtTokenManager.generateRefreshToken(user);
                logger.info({ userId: user.userId }, 'User successfully logged in');
                return { accessToken, refreshToken };
            }
            catch (err) {
                logger.error('User login failed: ', { error: err });
                throw new Error('User login failed');
            }
        });
    }
    logout(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.jwtTokenService.incrementTokenVersion(user);
                logger.info(user.userId, 'User logged out, refresh token invalidated');
            }
            catch (err) {
                logger.error('User logout failed: ', { error: err });
                throw new Error('User logout failed');
            }
        });
    }
    isAuthenticated(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return !!this.jwtTokenManager.verifyAccessToken(token);
            }
            catch (err) {
                logger.error('Access token verification failed: ', { error: err });
                throw new Error('Access token verification failed');
            }
        });
    }
};
AuthenticationService = __decorate([
    injectable(),
    __param(0, inject('UserRepository')),
    __param(1, inject('JwtTokenManagementService')),
    __metadata("design:paramtypes", [UserRepository, TokenManagementService])
], AuthenticationService);
export default AuthenticationService;
