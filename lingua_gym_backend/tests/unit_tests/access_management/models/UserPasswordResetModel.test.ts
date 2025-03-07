import UserPasswordResetModel from '../../../../src/models/access_management/UserPasswordResetModel.js';
import Database from '../../../../src/database/config/db-connection.js';
import UserPasswordReset from '../../../../src/database/interfaces/User/UserPasswordReset.js';

jest.mock('../../../../src/database/config/db-connection');

const mockDb = {
  query: jest.fn(),
} as unknown as Database;

const userPasswordResetModel = new UserPasswordResetModel(mockDb);

const mockResetEntry: UserPasswordReset = {
  user_id: '123',
  password_reset_token: 'reset-token',
  password_reset_token_expiration: new Date(Date.now() + 3600000),
};

describe('UserPasswordResetModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createResetEntry() should insert a new reset entry', async () => {
    (mockDb.query as jest.Mock).mockResolvedValue({});

    await userPasswordResetModel.createResetEntry(mockResetEntry);

    expect(mockDb.query).toHaveBeenCalledWith(
      'INSERT INTO "UserPasswordReset" (user_id, password_reset_token, password_reset_token_expiration) VALUES ($1, $2, $3)',
      [mockResetEntry.user_id, mockResetEntry.password_reset_token, mockResetEntry.password_reset_token_expiration]
    );
  });

  test('getByToken() should return a reset entry if found', async () => {
    (mockDb.query as jest.Mock).mockResolvedValue({
      rows: [mockResetEntry],
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: [],
    });

    const result = await userPasswordResetModel.getByToken(mockResetEntry.password_reset_token);

    expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM "UserPasswordReset" WHERE password_reset_token = $1',[mockResetEntry.password_reset_token]);
    expect(result).toEqual(mockResetEntry);
  });

  test('getByToken() should return null if no entry found', async () => {
    (mockDb.query as jest.Mock).mockResolvedValue({
      rows: [],
      rowCount: 0,
      command: 'SELECT',
      oid: 0,
      fields: [],
    });

    const result = await userPasswordResetModel.getByToken('invalid-token');

    expect(result).toBeNull();
  });

  test('invalidateToken() should delete the reset token', async () => {
    (mockDb.query as jest.Mock).mockResolvedValue({});

    await userPasswordResetModel.invalidateToken(mockResetEntry.password_reset_token);

    expect(mockDb.query).toHaveBeenCalledWith(
      'DELETE FROM "UserPasswordReset" WHERE password_reset_token = $1',
      [mockResetEntry.password_reset_token]
    );
  });

  test('deleteRequestByUserId() should delete requests by user_id', async () => {
    (mockDb.query as jest.Mock).mockResolvedValue({});

    await userPasswordResetModel.deleteRequestByUserId(mockResetEntry.user_id);

    expect(mockDb.query).toHaveBeenCalledWith(
      'DELETE FROM "UserPasswordReset" WHERE user_id = $1',
      [mockResetEntry.user_id]
    );
  });

  test('deleteExpiredRequests() should delete expired requests', async () => {
    (mockDb.query as jest.Mock).mockResolvedValue({});

    await userPasswordResetModel.deleteExpiredRequests();

    expect(mockDb.query).toHaveBeenCalledWith(
      'DELETE FROM "UserPasswordReset" WHERE password_reset_token_expiration <= NOW()'
    );
  });
});
