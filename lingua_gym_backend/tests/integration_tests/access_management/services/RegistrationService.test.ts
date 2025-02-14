import Database from '../../../../src/database/config/db-connection';
import RegistrationService from '../../../../src/services/access_management/RegistrationService';
import UserModel from '../../../../src/models/access_management/UserModel';
import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel';
import bcrypt from 'bcrypt';

const db = Database.getInstance();
const userModel = new UserModel(db);
const userMetadataModel = new UserMetadataModel(db);
const registrationService = new RegistrationService(userModel, userMetadataModel);

beforeEach(async () => {
  await db.query('DELETE FROM "UserMetadata"');
  await db.query('DELETE FROM "User"');
});

afterAll(async () => {
  await db.query('DELETE FROM "UserMetadata"');
  await db.query('DELETE FROM "User"');
  await db.close();
});

describe('RegistrationService (Integration)', () => {
  it('should register a new user', async () => {
    const password = 'password';
    const user = {
      username: 'testuser',
      display_name: null,
      email: 'test@example.com',
      token_version: 0,
      email_verified: false,
    }

    await registrationService.register(user.username, user.email, password);

    const userResult = await userModel.getUserByEmail('test@example.com');
    expect(userResult).toMatchObject({ ...user, password_hash: expect.any(String), user_id: expect.any(String) });
    expect(bcrypt.compareSync(password, userResult?.password_hash == null ? expect.any(String) : userResult.password_hash)).toBe(true);

    const metadataResult = await userMetadataModel.getUserMetadataById(userResult?.user_id == null ? expect.any(String) : userResult.user_id);
    expect(metadataResult).toMatchObject({ user_id: userResult?.user_id == null ? expect.any(String) : userResult.user_id, signup_date: expect.any(Date), last_login: null });
  });

  it('should fail if email already exists', async () => {
    await registrationService.register('testuser', 'test@example.com', 'password123');

    await expect(registrationService.register('anotheruser', 'test@example.com', 'password456')).rejects.toThrow(
      'Email already exists'
    );
  });

  it('should fail if username already exists', async () => {
    await registrationService.register('testuser', 'test@example.com', 'password123');

    await expect(registrationService.register('testuser', 'newemail@example.com', 'password456')).rejects.toThrow(
      'Username already exists'
    );
  });
});
