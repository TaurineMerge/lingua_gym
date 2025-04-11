import { v4 as uuidv4 } from 'uuid';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserModel, UserMetadataModel } from '../../../../src/models/access_management/access_management.js';
import Database from '../../../../src/database/config/db-connection.js';
import bcrypt from 'bcrypt';

jest.mock('../../../../src/models/access_management/access_management.js');
jest.mock('../../../../src/models/access_management/access_management.js');

const mockDbInstance = {} as Database;
const mockUserModel = new UserModel(mockDbInstance) as jest.Mocked<UserModel>;
const mockUserMetadataModel = new UserMetadataModel(mockDbInstance) as jest.Mocked<UserMetadataModel>;

const registrationService = new RegistrationService(mockUserModel, mockUserMetadataModel);

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
    mockUserModel.getUserByEmail.mockResolvedValue(null);
    mockUserModel.getUserByUsername.mockResolvedValue(null);
    mockUserModel.createUser.mockResolvedValue(undefined);
    mockUserMetadataModel.createUserMetadata.mockResolvedValue(undefined);

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).resolves.not.toBeUndefined();

    expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(mockUserModel.getUserByUsername).toHaveBeenCalledWith(user.username);
    expect(mockUserModel.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        passwordHash: expect.any(String),
        tokenVersion: 0,
        emailVerified: false,
      })
    );
    expect(mockUserMetadataModel.createUserMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expect.any(String),
        signupDate: expect.any(Date),
      })
    );
  });

  test('should throw an error if email already exists', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(user);

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Email already exists');
    expect(mockUserModel.getUserByUsername).not.toHaveBeenCalled();
    expect(mockUserModel.createUser).not.toHaveBeenCalled();
  });

  test('should throw an error if username already exists', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(null);
    mockUserModel.getUserByUsername.mockResolvedValue(user);

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Username already exists');
    expect(mockUserModel.createUser).not.toHaveBeenCalled();
  });

  test('should handle password hashing errors', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(null);
    mockUserModel.getUserByUsername.mockResolvedValue(null);

    jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
      throw new Error('Hashing failed');
    });

    await expect(registrationService.register(user.username, user.email, user.passwordHash)).rejects.toThrow('Password hashing failed');
  });
});
