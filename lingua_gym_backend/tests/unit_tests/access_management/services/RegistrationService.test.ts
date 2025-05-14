import { v4 as uuidv4 } from 'uuid';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserRepository, UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import Database from '../../../../src/database/config/db-connection.js';
import bcrypt from 'bcrypt';

jest.mock('../../../../src/models/access_management/access_management.js');
jest.mock('../../../../src/models/access_management/access_management.js');

const mockDbInstance = {} as Database;
const mockUserRepository = new UserRepository(mockDbInstance) as jest.Mocked<UserRepository>;
const mockUserMetadataRepository = new UserMetadataRepository(mockDbInstance) as jest.Mocked<UserMetadataRepository>;

const registrationService = new RegistrationService(mockUserRepository, mockUserMetadataRepository);

describe('RegistrationService', () => {
  const user = {
    userId: uuidv4(),
    username: 'testUser',
    displayName: 'Test User',
    passwordHash: 'hashed_password',
    email: 'test@example.com',
    profilePicture: 'avatar.png',
    emailVerified: true,
    tokenVersion: 1,
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully register a new user', async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.getUserByUsername.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue(true);
    mockUserMetadataRepository.createUserMetadata.mockResolvedValue(true);

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).resolves.not.toBeUndefined();

    expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(mockUserRepository.getUserByUsername).toHaveBeenCalledWith(user.username);
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        passwordHash: expect.any(String),
        tokenVersion: 0,
        emailVerified: false,
      })
    );
    expect(mockUserMetadataRepository.createUserMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expect.any(String),
        signupDate: expect.any(Date),
      })
    );
  });

  test('should throw an error if email already exists', async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(user);

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Email already exists');
    expect(mockUserRepository.getUserByUsername).not.toHaveBeenCalled();
    expect(mockUserRepository.createUser).not.toHaveBeenCalled();
  });

  test('should throw an error if username already exists', async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.getUserByUsername.mockResolvedValue(user);

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Username already exists');
    expect(mockUserRepository.createUser).not.toHaveBeenCalled();
  });

  test('should handle password hashing errors', async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.getUserByUsername.mockResolvedValue(null);

    jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
      throw new Error('Hashing failed');
    });

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Password hashing failed');
  });
});
