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
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import UserModel from '../../../../src/models/access_management/UserModel.js';
import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel.js';
import bcrypt from 'bcrypt';
jest.mock('../../../../src/models/UserModel');
jest.mock('../../../../src/models/UserMetadataModel');
const mockDbInstance = {};
const mockUserModel = new UserModel(mockDbInstance);
const mockUserMetadataModel = new UserMetadataModel(mockDbInstance);
const registrationService = new RegistrationService(mockUserModel, mockUserMetadataModel);
describe('RegistrationService', () => {
    const user = {
        user_id: uuidv4(),
        username: 'testUser',
        display_name: 'Test User',
        password_hash: 'hashed_password',
        email: 'test@example.com',
        profile_picture: 'avatar.png',
        email_verified: true,
        token_version: 1,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should successfully register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserModel.getUserByEmail.mockResolvedValue(null);
        mockUserModel.getUserByUsername.mockResolvedValue(null);
        mockUserModel.createUser.mockResolvedValue(undefined);
        mockUserMetadataModel.createUserMetadata.mockResolvedValue(undefined);
        yield expect(registrationService.register(user.username, user.email, user.password_hash)).resolves.not.toBeUndefined();
        expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
        expect(mockUserModel.getUserByUsername).toHaveBeenCalledWith(user.username);
        expect(mockUserModel.createUser).toHaveBeenCalledWith(expect.objectContaining({
            user_id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            password_hash: expect.any(String),
            token_version: 0,
            email_verified: false,
        }));
        expect(mockUserMetadataModel.createUserMetadata).toHaveBeenCalledWith(expect.objectContaining({
            user_id: expect.any(String),
            signup_date: expect.any(Date),
        }));
    }));
    test('should throw an error if email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserModel.getUserByEmail.mockResolvedValue(user);
        yield expect(registrationService.register(user.username, user.email, user.password_hash)).rejects.toThrow('Email already exists');
        expect(mockUserModel.getUserByUsername).not.toHaveBeenCalled();
        expect(mockUserModel.createUser).not.toHaveBeenCalled();
    }));
    test('should throw an error if username already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserModel.getUserByEmail.mockResolvedValue(null);
        mockUserModel.getUserByUsername.mockResolvedValue(user);
        yield expect(registrationService.register(user.username, user.email, user.password_hash)).rejects.toThrow('Username already exists');
        expect(mockUserModel.createUser).not.toHaveBeenCalled();
    }));
    test('should handle password hashing errors', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserModel.getUserByEmail.mockResolvedValue(null);
        mockUserModel.getUserByUsername.mockResolvedValue(null);
        jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
            throw new Error('Hashing failed');
        });
        yield expect(registrationService.register(user.username, user.email, user.password_hash)).rejects.toThrow('Password hashing failed');
    }));
});
