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
import bcrypt from 'bcrypt';
import { UserModel } from '../../models/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import TokenManagementService from './JwtTokenManagementService.js';
import { injectable, inject } from 'tsyringe';
let AuthenticationService = class AuthenticationService {
    constructor(userModel, jwtTokenService) {
        this.userModel = userModel;
        this.jwtTokenService = jwtTokenService;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ email }, 'User login attempt');
            const user = yield this.userModel.getUserByEmail(email);
            if (!user) {
                logger.warn({ email }, 'Login failed: User not found');
                throw new Error('User not found');
            }
            const isPasswordValid = this.verifyPassword(password, user.passwordHash);
            if (!isPasswordValid) {
                logger.warn({ email }, 'Login failed: Invalid password');
                throw new Error('Invalid password');
            }
            const accessToken = this.jwtTokenService.generateAccessToken(user);
            const refreshToken = this.jwtTokenService.generateRefreshToken(user);
            logger.info({ userId: user.userId }, 'User successfully logged in');
            return { accessToken, refreshToken };
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.jwtTokenService.incrementTokenVersion(userId);
            logger.info({ userId }, 'User logged out, refresh token invalidated');
        });
    }
    verifyPassword(password, hashedPassword) {
        try {
            return bcrypt.compareSync(password, hashedPassword);
        }
        catch (err) {
            logger.error({ error: err }, 'Password verification failed');
            throw new Error('Password verification failed');
        }
    }
};
AuthenticationService = __decorate([
    injectable(),
    __param(0, inject('UserModel')),
    __param(1, inject('JwtTokenService')),
    __metadata("design:paramtypes", [UserModel, TokenManagementService])
], AuthenticationService);
export default AuthenticationService;
