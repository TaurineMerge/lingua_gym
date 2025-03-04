import { v4 as uuidv4 } from 'uuid';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserModel, UserMetadataModel } from '../../../../src/models/access_management/access_management.js';
import Database from '../../../../src/database/config/db-connection.js';
import bcrypt from 'bcrypt';

jest.mock('../../../../src/models/UserModel');
jest.mock('../../../../src/models/UserMetadataModel');

const mockDbInstance = {} as Database;
const mockUserModel = new UserModel(mockDbInstance) as jest.Mocked<UserModel>;
const mockUserMetadataModel = new UserMetadataModel(mockDbInstance) as jest.Mocked<UserMetadataModel>;

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
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully register a new user', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(null);
    mockUserModel.getUserByUsername.mockResolvedValue(null);
    mockUserModel.createUser.mockResolvedValue(undefined);
    mockUserMetadataModel.createUserMetadata.mockResolvedValue(undefined);

    await expect(registrationService.register(user.username, user.email, user.password_hash)).resolves.not.toBeUndefined();

    expect(mockUserModel.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(mockUserModel.getUserByUsername).toHaveBeenCalledWith(user.username);
    expect(mockUserModel.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        password_hash: expect.any(String),
        token_version: 0,
        email_verified: false,
      })
    );
    expect(mockUserMetadataModel.createUserMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: expect.any(String),
        signup_date: expect.any(Date),
      })
    );
  });

  test('should throw an error if email already exists', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(user);

    await expect(registrationService.register(user.username, user.email, user.password_hash)).rejects.toThrow('Email already exists');
    expect(mockUserModel.getUserByUsername).not.toHaveBeenCalled();
    expect(mockUserModel.createUser).not.toHaveBeenCalled();
  });

  test('should throw an error if username already exists', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(null);
    mockUserModel.getUserByUsername.mockResolvedValue(user);

    await expect(registrationService.register(user.username, user.email, user.password_hash)).rejects.toThrow('Username already exists');
    expect(mockUserModel.createUser).not.toHaveBeenCalled();
  });

  test('should handle password hashing errors', async () => {
    mockUserModel.getUserByEmail.mockResolvedValue(null);
    mockUserModel.getUserByUsername.mockResolvedValue(null);

    jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => {
      throw new Error('Hashing failed');
    });

    await expect(registrationService.register(user.username, user.email, user.password_hash)).rejects.toThrow('Password hashing failed');
  });
});
