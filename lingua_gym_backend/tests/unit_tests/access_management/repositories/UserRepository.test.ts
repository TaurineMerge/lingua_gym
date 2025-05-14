import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import Database from '../../../../src/database/config/db-connection.js';
import { IUser } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UserModel', () => {
  let db: jest.Mocked<Database>;
  let userModel: UserRepository;

  beforeEach(() => {
    db = { query: jest.fn() } as unknown as jest.Mocked<Database>;
    userModel = new UserRepository(db);
    jest.clearAllMocks();
  });

  const mockUser: IUser = {
    userId: '123',
    username: 'testUser',
    displayName: 'Test User',
    passwordHash: 'hashed_password',
    email: 'test@example.com',
    profilePicture: 'avatar.png',
    emailVerified: true,
    tokenVersion: 1,
  };

  test('createUser() should call db.query() with correct arguments', async () => {
    await userModel.createUser(mockUser);

    expect(db.query).toHaveBeenCalledWith('INSERT INTO "User" (user_id, username, display_name, password_hash, email, token_version, profile_picture, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        mockUser.userId,
        mockUser.username,
        mockUser.displayName,
        mockUser.passwordHash,
        mockUser.email,
        mockUser.tokenVersion,
        mockUser.profilePicture,
        mockUser.emailVerified,
      ]
    );

    expect(logger.info).toHaveBeenCalledWith('Creating user...');
    expect(logger.info).toHaveBeenCalledWith('User created successfully');
  });

  test('createUser() should log an error and throw if db.query() fails', async () => {
    const error = new Error('Database error');
    db.query.mockRejectedValue(error);

    await expect(userModel.createUser(mockUser)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith('Error creating user:', error);
  });

  test('getUserById() should return a user if found', async () => {
    db.query.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
    });

    const result = await userModel.getUserById(mockUser.userId);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE user_id = $1', [mockUser.userId]);
    expect(result).toEqual(mockUser);
  });

  test('getUserById() should return null if no user found', async () => {
    db.query.mockResolvedValue({ rows: [], rowCount: 0, command: '', oid: 0, fields: [] });

    const result = await userModel.getUserById(mockUser.userId);

    expect(result).toBeNull();
  });

  test('getUserById() should throw an error if db.query() fails', async () => {
    const error = new Error('Database error');
    db.query.mockRejectedValue(error);

    await expect(userModel.getUserById(mockUser.userId)).rejects.toThrow(error);
  });

  test('getUserByEmail() should return a user if found', async () => {
    db.query.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
    });

    const result = await userModel.getUserByEmail(mockUser.email);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE email = $1', [mockUser.email]);
    expect(result).toEqual(mockUser);
  });

  test('getUserByUsername() should return a user if found', async () => {
    db.query.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: [],
    });

    const result = await userModel.getUserByUsername(mockUser.username);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE username = $1', [mockUser.username]);
    expect(result).toEqual(mockUser);
  });

  test('updateUser() should call db.query() with correct SQL and parameters', async () => {
    const updates = { displayName: 'New Name', emailVerified: false };
    const query = 'UPDATE "User" SET "display_name" = $2, "email_verified" = $3 WHERE user_id = $1';

    await userModel.updateUserById(mockUser.userId, updates);

    expect(db.query).toHaveBeenCalledWith(query, [mockUser.userId, updates.displayName, updates.emailVerified]);
  });

  test('updateUser() should throw an error if db.query() fails', async () => {
    const error = new Error('Update failed');
    db.query.mockRejectedValue(error);

    await expect(userModel.updateUserById(mockUser.userId, { displayName: 'New Name' })).rejects.toThrow(error);
  });

  test('deleteUser() should call db.query() with correct SQL', async () => {
    await userModel.deleteUserById(mockUser.userId);

    expect(db.query).toHaveBeenCalledWith('DELETE FROM "User" WHERE user_id = $1', [mockUser.userId]);
  });

  test('deleteUser() should throw an error if db.query() fails', async () => {
    const error = new Error('Delete failed');
    db.query.mockRejectedValue(error);

    await expect(userModel.deleteUserById(mockUser.userId)).rejects.toThrow(error);
  });
});
