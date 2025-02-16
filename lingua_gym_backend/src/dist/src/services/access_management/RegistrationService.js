var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from 'uuid';
import hashPassword from '../../utils/hash/HashPassword.js';
import logger from '../../utils/logger/Logger.js';
class RegistrationService {
    constructor(userModel, userMetadataModel) {
        this.userModel = userModel;
        this.userMetadataModel = userMetadataModel;
    }
    register(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ username, email }, 'User registration started');
            const existingEmail = yield this.userModel.getUserByEmail(email);
            if (existingEmail) {
                logger.warn({ email }, 'Registration failed: Email already exists');
                throw new Error('Email already exists');
            }
            const existingUsername = yield this.userModel.getUserByUsername(username);
            if (existingUsername) {
                logger.warn({ username }, 'Registration failed: Username already exists');
                throw new Error('Username already exists');
            }
            const hashedPassword = hashPassword(password);
            const userId = uuidv4();
            const user = {
                user_id: userId,
                username,
                email,
                password_hash: hashedPassword,
                token_version: 0,
                email_verified: false
            };
            yield this.userModel.createUser(user);
            const signupDate = new Date();
            yield this.userMetadataModel.createUserMetadata({
                user_id: userId,
                signup_date: signupDate,
            });
            logger.info({ userId, username, email }, 'User successfully registered');
            return user;
        });
    }
}
export default RegistrationService;
