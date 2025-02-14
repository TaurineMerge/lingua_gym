import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel';
import Database from '../../../../src/database/config/db-connection';
import UserMetadata from '../../../../src/database/interfaces/User/UserMetadata';
import logger from '../../../../src/utils/logger/Logger';

jest.mock('../../../../src/utils/logger/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UserModel', () => {
  let db: jest.Mocked<Database>;
  let userMetadataModel: UserMetadataModel;

  beforeEach(() => {
    db = {
      query: jest.fn(),
    } as unknown as jest.Mocked<Database>;

    userMetadataModel = new UserMetadataModel(db);

    jest.clearAllMocks();
  });

  test('createUserMetadata() should call db.query() with correct arguments', async () => {
    const userMetadata: UserMetadata = {
      user_id: '123',
      last_login: new Date(),
      signup_date: new Date(),
    };

    await userMetadataModel.createUserMetadata(userMetadata);

    expect(db.query).toHaveBeenCalledWith(
      `
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `,
      [userMetadata.user_id, userMetadata.last_login, userMetadata.signup_date]
    );

    expect(logger.info).toHaveBeenCalledWith('Creating user metadata...');
    expect(logger.info).toHaveBeenCalledWith('User metadata created successfully');
  });

  test('createUserMetadata() should log an error and throw if db.query() fails', async () => {
    const userMetadata: UserMetadata = {
      user_id: '123',
      last_login: new Date(),
      signup_date: new Date(),
    };

    const dbError = new Error('Database connection failed');
    db.query.mockRejectedValue(dbError);

    await expect(userMetadataModel.createUserMetadata(userMetadata)).rejects.toThrow(dbError);

    expect(logger.error).toHaveBeenCalledWith('Error creating user metadata:', dbError);
  });
});
