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
import { UserRepository, UserMetadataRepository } from '../../repositories/access_management/access_management.js';
import logger from '../../utils/logger/Logger.js';
import { User } from '../../models/access_management/access_management.js';
import { inject, injectable } from 'tsyringe';
let RegistrationService = class RegistrationService {
    constructor(userRepository, userMetadataRepository) {
        this.userRepository = userRepository;
        this.userMetadataRepository = userMetadataRepository;
    }
    register(username, email, password, displayName, registrationMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ username, email }, 'User registration started');
            try {
                yield this.checkIfEmailExists(email);
                yield this.checkIfUsernameExists(username);
            }
            catch (error) {
                logger.error({ error }, 'Registration failed: Email or username already exists');
                throw error;
            }
            const user = new User({ username, password, email, displayName, registrationMethod });
            yield this.userRepository.createUser(user);
            const signupDate = new Date();
            yield this.userMetadataRepository.createUserMetadata({
                userId: user.userId,
                signupDate: signupDate,
            });
            logger.info(user.userId, user.username, user.email, 'User successfully registered');
            return user;
        });
    }
    checkIfEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ email }, 'Checking if email exists');
            const existingEmail = yield this.userRepository.getUserByEmail(email);
            if (existingEmail) {
                logger.warn({ email }, 'Registration failed: Email already exists');
            }
            else {
                logger.info({ email }, 'Email does not exist');
            }
            return !!existingEmail;
        });
    }
    checkIfUsernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ username }, 'Checking if username exists');
            const existingUsername = yield this.userRepository.getUserByUsername(username);
            if (existingUsername) {
                logger.warn({ username }, 'Registration failed: Username already exists');
            }
            else {
                logger.info({ username }, 'Username does not exist');
            }
            return !!existingUsername;
        });
    }
};
RegistrationService = __decorate([
    injectable(),
    __param(0, inject('UserRepository')),
    __param(1, inject('UserMetadataRepository')),
    __metadata("design:paramtypes", [UserRepository, UserMetadataRepository])
], RegistrationService);
export default RegistrationService;
