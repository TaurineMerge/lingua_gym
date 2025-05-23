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
import { inject, injectable } from "tsyringe";
import GoogleAuthIntegration from "../../integrations/GoogleAuthIntegration.js";
import User from "../../models/access_management/User.js";
import { UserRepository } from "../../repositories/access_management/access_management.js";
import { RegistrationService } from "./access_management.js";
import logger from '../../utils/logger/Logger.js';
import { JwtTokenManager } from '../../models/access_management/access_management.js';
import { RegistrationMethod } from '../../database/interfaces/User/IUser.js';
let GoogleAuthService = class GoogleAuthService {
    constructor(googleAuth, userRepository, registrationService, jwtTokenManager) {
        this.googleAuth = googleAuth;
        this.userRepository = userRepository;
        this.registrationService = registrationService;
        this.jwtTokenManager = jwtTokenManager;
        this.authenticateUser = (code) => __awaiter(this, void 0, void 0, function* () {
            try {
                const googleUser = yield this.googleAuth.verifyGoogleToken(code);
                if (!googleUser.email) {
                    throw new Error('Google user does not have an email');
                }
                let userData = yield this.userRepository.getUserByEmail(googleUser.email);
                if (!userData) {
                    logger.info({ email: googleUser.email }, 'Registering new user via Google');
                    yield this.registrationService.register(googleUser.name || '', googleUser.email, '', '', RegistrationMethod.GOOGLE);
                    userData = yield this.userRepository.getUserByEmail(googleUser.email);
                    if (!userData)
                        throw new Error('Failed to retrieve newly registered user');
                }
                const user = new User(userData);
                const accessToken = this.jwtTokenManager.generateAccessToken(user);
                const refreshToken = this.jwtTokenManager.generateRefreshToken(user);
                return { accessToken, refreshToken };
            }
            catch (error) {
                logger.error(error, 'Google authentication failed');
                throw new Error('Google authentication failed');
            }
        });
    }
};
GoogleAuthService = __decorate([
    injectable(),
    __param(0, inject('GoogleAuth')),
    __param(1, inject('UserRepository')),
    __param(2, inject('RegistrationService')),
    __param(3, inject('JwtTokenManager')),
    __metadata("design:paramtypes", [GoogleAuthIntegration,
        UserRepository,
        RegistrationService,
        JwtTokenManager])
], GoogleAuthService);
export default GoogleAuthService;
