import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserRepository, UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import bcrypt from 'bcrypt';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';

let userModel: UserRepository;
let userMetadataModel: UserMetadataRepository;
let registrationService: RegistrationService;

beforeAll(async () => {
  await clearDatabase();

  const modelContainer = await setupTestRepositoryContainer();
  userModel = modelContainer.resolve(UserRepository);

  const serviceContainer = await setupTestServiceContainer(); 
  userMetadataModel = serviceContainer.resolve(UserMetadataRepository);
  registrationService = serviceContainer.resolve(RegistrationService);
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('RegistrationService (Integration)', () => {
  test('should register a new user', async () => {
    const password = 'password';
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      tokenVersion: 0,
      emailVerified: false
    }

    await registrationService.register(userData.username, userData.email, password, userData.displayName);

    const userResult = await userModel.getUserByEmail('test@example.com');
    expect(userResult).toMatchObject({ ...userData, passwordHash: expect.any(String), userId: expect.any(String) });
    expect(bcrypt.compareSync(password, userResult?.passwordHash == null ? expect.any(String) : userResult.passwordHash)).toBe(true);

    const metadataResult = await userMetadataModel.getUserMetadataById(userResult?.userId == null ? expect.any(String) : userResult.userId);
    expect(metadataResult).toMatchObject({ userId: userResult?.userId == null ? expect.any(String) : userResult.userId, signupDate: expect.any(Date), lastLogin: null });
  });

  test('should fail if email already exists', async () => {
    await registrationService.register('testuser', 'test@example.com', 'password123');

    await expect(registrationService.register('anotheruser', 'test@example.com', 'password456')).rejects.toThrow(
      'Email already exists'
    );
  });

  test('should fail if username already exists', async () => {
    await registrationService.register('testuser', 'test@example.com', 'password123');

    await expect(registrationService.register('testuser', 'newemail@example.com', 'password456')).rejects.toThrow(
      'Username already exists'
    );
  });
});

