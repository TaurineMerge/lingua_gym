import { v4 as uuidv4 } from 'uuid';
import crypto from 'bcrypt';
import logger from '../../utils/logger/Logger.js';
import { RegistrationMethod } from '../../database/interfaces/User/IUser.js';
class User {
    constructor(user) {
        this.validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.error({ email }, 'Invalid email format');
                throw new Error('Invalid email format');
            }
            return true;
        };
        this.validateUsername = (username) => {
            if (username.length < 3) {
                logger.error('Username must be at least 3 characters long');
                return false;
            }
            return true;
        };
        try {
            logger.info('Initializing user');
            if (!user) {
                throw new Error('Invalid user');
            }
            this._registrationMethod = 'registrationMethod' in user && user.registrationMethod ? user.registrationMethod : RegistrationMethod.LOCAL;
            if (!(user instanceof Object)) {
                throw new Error('Invalid user');
            }
            if (!this.validateUsername(user.username)) {
                throw new Error('Invalid username');
            }
            else {
                this._username = user.username;
            }
            if (this._registrationMethod === RegistrationMethod.LOCAL) {
                if ('passwordHash' in user) {
                    this._passwordHash = user.passwordHash;
                }
                else {
                    if (!this.validatePassword(user.password)) {
                        throw new Error('Invalid password');
                    }
                    this._passwordHash = this.hashPassword(user.password);
                }
            }
            else {
                this._passwordHash = null;
            }
            if (!this.validateEmail(user.email)) {
                throw new Error('Invalid email');
            }
            else {
                this._email = user.email;
            }
            this._userId = 'userId' in user ? user.userId : this.generateUuid();
            this._displayName = user.displayName;
            this._profilePicture = 'profilePicture' in user ? user.profilePicture : undefined;
            this._emailVerified = 'emailVerified' in user ? user.emailVerified : false;
            this._tokenVersion = 'tokenVersion' in user ? user.tokenVersion : 1;
            this._createdAt = 'createdAt' in user ? user.createdAt : undefined;
            this._updatedAt = 'updatedAt' in user ? user.updatedAt : undefined;
        }
        catch (err) {
            logger.error({ error: err }, 'User initialization failed');
            throw new Error('User initialization failed');
        }
    }
    verifyPasswordHash(password) {
        try {
            if (!this._passwordHash) {
                return false;
            }
            return crypto.compareSync(password, this._passwordHash);
        }
        catch (err) {
            logger.error({ error: err }, 'Password verification failed');
            throw new Error('Password verification failed');
        }
    }
    validatePassword(password) {
        if (password.length < 6) {
            logger.warn({ password }, 'Validation failed: Password must be at least 6 characters long');
            return false;
        }
        return true;
    }
    ;
    hashPassword(password) {
        try {
            const saltRounds = 10;
            return crypto.hashSync(password, saltRounds);
        }
        catch (err) {
            logger.error({ error: err }, 'Password hashing failed');
            throw new Error('Password hashing failed');
        }
    }
    generateUuid() {
        return uuidv4();
    }
    get userId() { return this._userId; }
    get username() { return this._username; }
    get displayName() { return this._displayName || null; }
    get email() { return this._email; }
    get profilePicture() { return this._profilePicture || null; }
    get emailVerified() { return this._emailVerified; }
    get tokenVersion() { return this._tokenVersion; }
    get passwordHash() { return this._passwordHash; }
    get updatedAt() { return this._updatedAt || null; }
    get createdAt() { return this._createdAt || null; }
    get registrationMethod() { return this._registrationMethod; }
    get user() {
        return {
            userId: this._userId,
            username: this._username,
            displayName: this._displayName || null,
            passwordHash: this._passwordHash || null,
            email: this._email,
            profilePicture: this._profilePicture || null,
            emailVerified: this._emailVerified,
            tokenVersion: this._tokenVersion,
            registrationMethod: this._registrationMethod,
            createdAt: this._createdAt || null,
            updatedAt: this._updatedAt || null,
        };
    }
    set displayName(displayName) { this._displayName = displayName; }
    set profilePicture(profilePicture) { this._profilePicture = profilePicture; }
    set emailVerified(emailVerified) { this._emailVerified = emailVerified; }
    set tokenVersion(tokenVersion) { this._tokenVersion = tokenVersion; }
    set updatedAt(updatedAt) { this._updatedAt = updatedAt; }
    set password(password) { this._passwordHash = this.hashPassword(password); }
}
export default User;
