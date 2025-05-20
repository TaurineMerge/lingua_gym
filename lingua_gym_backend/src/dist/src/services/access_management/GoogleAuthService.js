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
let GoogleAuthService = class GoogleAuthService {
    constructor(googleAuth, userRepository, registrationService) {
        this.googleAuth = googleAuth;
        this.userRepository = userRepository;
        this.registrationService = registrationService;
        this.authenticateUser = (token) => __awaiter(this, void 0, void 0, function* () {
            console.log(token);
            const googleUser = yield this.googleAuth.verifyGoogleToken(token);
            console.log(googleUser);
            const user = new User(yield this.userRepository.getUserByEmail(googleUser.email || ''));
            console.log(user);
            if (!user) {
                const newUser = yield this.registrationService.register(googleUser.name || '', googleUser.email || '', '', '');
                return newUser;
            }
            return user;
        });
    }
};
GoogleAuthService = __decorate([
    injectable(),
    __param(0, inject('GoogleAuth')),
    __param(1, inject('UserRepository')),
    __param(2, inject('RegistrationService')),
    __metadata("design:paramtypes", [GoogleAuthIntegration,
        UserRepository,
        RegistrationService])
], GoogleAuthService);
export default GoogleAuthService;
