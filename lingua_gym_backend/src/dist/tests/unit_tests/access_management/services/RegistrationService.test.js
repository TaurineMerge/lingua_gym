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
import { UserRepository, UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import bcrypt from 'bcrypt';
import { RegistrationMethod } from '../../../../src/database/interfaces/DbInterfaces.js';
jest.mock('../../../../src/models/access_management/access_management.js');
jest.mock('../../../../src/models/access_management/access_management.js');
const mockDbInstance = {};
const mockUserRepository = new UserRepository(mockDbInstance);
const mockUserMetadataRepository = new UserMetadataRepository(mockDbInstance);
const registrationService = new RegistrationService(mockUserRepository, mockUserMetadataRepository);
describe('RegistrationService', () => {
    const user = {
        userId: uuidv4(),
        username: 'testUser',
        displayName: 'Test User',
        passwordHash: 'hashed_password',
        email: 'test@example.com',
        profilePicture: 'avatar.png',
        registrationMethod: RegistrationMethod.LOCAL,
        emailVerified: true,
        tokenVersion: 1,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should successfully register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserRepository.getUserByEmail.mockResolvedValue(null);
        mockUserRepository.getUserByUsername.mockResolvedValue(null);
        mockUserRepository.createUser.mockResolvedValue(true);
        mockUserMetadataRepository.createUserMetadata.mockResolvedValue(true);
        yield expect(registrationService.register(user.username, user.email, user.passwordHash)).resolves.not.toBeUndefined();
        expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
        expect(mockUserRepository.getUserByUsername).toHaveBeenCalledWith(user.username);
        expect(mockUserRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
            userId: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            passwordHash: expect.any(String),
            tokenVersion: 0,
            emailVerified: false,
        }));
        expect(mockUserMetadataRepository.createUserMetadata).toHaveBeenCalledWith(expect.objectContaining({
            userId: expect.any(String),
            signupDate: expect.any(Date),
        }));
    }));
    test('should throw an error if email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserRepository.getUserByEmail.mockResolvedValue(user);
        yield expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Email already exists');
        expect(mockUserRepository.getUserByUsername).not.toHaveBeenCalled();
        expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    }));
    test('should throw an error if username already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserRepository.getUserByEmail.mockResolvedValue(null);
        mockUserRepository.getUserByUsername.mockResolvedValue(user);
        yield expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Username already exists');
        expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    }));
    test('should handle password hashing errors', () => __awaiter(void 0, void 0, void 0, function* () {
        mockUserRepository.getUserByEmail.mockResolvedValue(null);
        mockUserRepository.getUserByUsername.mockResolvedValue(null);
        jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
            throw new Error('Hashing failed');
        });
        yield expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Password hashing failed');
    }));
});
