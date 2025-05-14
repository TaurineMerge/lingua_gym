import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../database/interfaces/DbInterfaces.js';
import crypto from 'bcrypt';
import logger from '../../utils/logger/Logger.js';

class User {
    private _userId: string;
    private _username: string;
    private _displayName?: string | null;
    private _passwordHash: string;
    private _email: string;
    private _profilePicture?: string | null;
    private _emailVerified: boolean;
    private _tokenVersion: number;
    private _createdAt?: Date | null;
    private _updatedAt?: Date | null;

    constructor(user: IUser | { username: string, password: string, email: string, displayName?: string } | null) {
        try {
            logger.info('Initializing user');

            if (!(user instanceof Object)) {
                throw new Error('Invalid user');
            }

            if (!this.validateUsername(user.username)) {
                throw new Error('Invalid username');
            } else {
                this._username = user.username;
            }

            if ('passwordHash' in user) {
                this._passwordHash = user.passwordHash;
            } else {
                if (!this.validatePassword(user.password)) {
                    throw new Error('Invalid password');
                }
                this._passwordHash = this.hashPassword(user.password);
            }

            if (!this.validateEmail(user.email)) {
                throw new Error('Invalid email');
            } else {
                this._email = user.email;
            }

            this._userId = 'userId' in user ? user.userId : this.generateUuid();
            this._displayName = user.displayName;
            this._profilePicture = 'profilePicture' in user ? user.profilePicture : undefined;
            this._emailVerified = 'emailVerified' in user ? user.emailVerified : false;
            this._tokenVersion = 'tokenVersion' in user ? user.tokenVersion : 1;
            this._createdAt = 'createdAt' in user ? user.createdAt : undefined;
            this._updatedAt = 'updatedAt' in user ? user.updatedAt : undefined;
        } catch (err) {
            logger.error({ error: err }, 'User initialization failed');
            throw new Error('User initialization failed');
        }
    }

    public verifyPasswordHash(password: string): boolean {
        try {
          return crypto.compareSync(password, this._passwordHash);
        } catch (err) {
          logger.error({ error: err }, 'Password verification failed');
          throw new Error('Password verification failed');
        }
    }

    private validatePassword(password: string): boolean {
        if (password.length < 6) {
            logger.warn({ password }, 'Validation failed: Password must be at least 6 characters long');
            return false;
        }
    
        return true;
    };

    private hashPassword(password: string): string {
        try {
          const saltRounds = 10;
          return crypto.hashSync(password, saltRounds);
        } catch (err) {
          logger.error({ error: err }, 'Password hashing failed');
          throw new Error('Password hashing failed');
        }
    }

    private validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            logger.error({ email }, 'Invalid email format');
            throw new Error('Invalid email format');
        }
    
        return true;
    };

    private validateUsername = (username: string) => {
        if (username.length < 3) {
            logger.error('Username must be at least 3 characters long');
            return false;
        }
        return true;
    };

    private generateUuid(): string {
        return uuidv4();
    }

    public get userId(): string { return this._userId; }
    public get username(): string { return this._username; }
    public get displayName(): string | null { return this._displayName || null; }
    public get email(): string { return this._email; }
    public get profilePicture(): string | null { return this._profilePicture || null; }
    public get emailVerified(): boolean { return this._emailVerified; }
    public get tokenVersion(): number { return this._tokenVersion; }
    public get passwordHash(): string { return this._passwordHash; }
    public get updatedAt(): Date | null { return this._updatedAt || null; }
    public get createdAt(): Date | null { return this._createdAt || null; }
    
    public get user(): IUser {
        return {
            userId: this._userId,
            username: this._username,
            displayName: this._displayName || null,
            passwordHash: this._passwordHash,
            email: this._email,
            profilePicture: this._profilePicture || null,
            emailVerified: this._emailVerified,
            tokenVersion: this._tokenVersion,
            createdAt: this._createdAt || null,
            updatedAt: this._updatedAt || null,
        };
    }

    public set displayName(displayName: string | null) { this._displayName = displayName; }
    public set profilePicture(profilePicture: string | null) { this._profilePicture = profilePicture; }
    public set emailVerified(emailVerified: boolean) { this._emailVerified = emailVerified; }
    public set tokenVersion(tokenVersion: number) { this._tokenVersion = tokenVersion; }
    public set updatedAt(updatedAt: Date | null) { this._updatedAt = updatedAt; }
    public set password(password: string) { this._passwordHash = this.hashPassword(password); }
}

export default User;