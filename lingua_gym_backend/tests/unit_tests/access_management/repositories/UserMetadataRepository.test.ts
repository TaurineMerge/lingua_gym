import { UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import Database from '../../../../src/database/config/db-connection.js';
import { IUserMetadata } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UserModel', () => {
  let db: jest.Mocked<Database>;
  let userMetadataModel: UserMetadataRepository;

  beforeEach(() => {
    db = {
      query: jest.fn(),
    } as unknown as jest.Mocked<Database>;

    userMetadataModel = new UserMetadataRepository(db);

    jest.clearAllMocks();
  });

  test('createUserMetadata() should call db.query() with correct arguments', async () => {
    const userMetadata: IUserMetadata = {
      userId: '123',
      lastLogin: new Date(),
      signupDate: new Date(),
    };

    await userMetadataModel.createUserMetadata(userMetadata);

    expect(db.query).toHaveBeenCalledWith(
      `
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `,
      [userMetadata.userId, userMetadata.lastLogin, userMetadata.signupDate]
    );

    expect(logger.info).toHaveBeenCalledWith('Creating user metadata...');
    expect(logger.info).toHaveBeenCalledWith('User metadata created successfully');
  });

  test('createUserMetadata() should log an error and throw if db.query() fails', async () => {
    const userMetadata: IUserMetadata = {
      userId: '123',
      lastLogin: new Date(),
      signupDate: new Date(),
    };

    const dbError = new Error('Database connection failed');
    db.query.mockRejectedValue(dbError);

    await expect(userMetadataModel.createUserMetadata(userMetadata)).rejects.toThrow(dbError);

    expect(logger.error).toHaveBeenCalledWith('Error creating user metadata:', dbError);
  });
});
