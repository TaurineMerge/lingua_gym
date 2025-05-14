import DictionarySetService from '../../../../src/services/dictionary/DictionarySetService.js';
import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { IDictionarySet, IUser, LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import { RegistrationService } from '../../../../src/services/access_management/access_management.js';

let dictionarySetService: DictionarySetService;
let registrationService: RegistrationService;

beforeAll(async () => {
  await clearDatabase();

  const serviceContainer = await setupTestServiceContainer();
  dictionarySetService = serviceContainer.resolve(DictionarySetService);
  registrationService = serviceContainer.resolve(RegistrationService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('DictionarySetService', () => {
  let testSet: IDictionarySet;
  let testUser: Partial<IUser>;

  beforeEach(async () => {
    testUser = {
      userId: '',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    }

    testUser.userId = (await registrationService.register(testUser.username as string, testUser.email as string, 'password123', testUser.displayName as string)).userId;

    testSet = {
      dictionarySetId: uuidv4(),
      name: 'Basic verbs',
      description: 'Common verbs in English',
      ownerId: testUser.userId as string,
      isPublic: true,
      languageCode: LanguageCode.ENGLISH,
    };
  });

  test('should create a dictionary set', async () => {
    const result = await dictionarySetService.createSet(testSet);
    expect(result).not.toBeNull();
    expect(result?.dictionarySetId).toBe(testSet.dictionarySetId);
  });

  test('should return the created set by ID', async () => {
    await dictionarySetService.createSet(testSet);
    const fetched = await dictionarySetService.getSetById(testSet.dictionarySetId);
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe('Basic verbs');
  });

  test('should delete the set by ID', async () => {
    await dictionarySetService.createSet(testSet);
    const deleted = await dictionarySetService.deleteSet(testSet.dictionarySetId);
    expect(deleted).not.toBe(false);
    if (deleted !== false) {
      expect((deleted as IDictionarySet).dictionarySetId).toBe(testSet.dictionarySetId);
    }

    const afterDelete = await dictionarySetService.getSetById(testSet.dictionarySetId);
    expect(afterDelete).toBeNull();
  });

  test('should return null when creating set with invalid data', async () => {
    const badSet = { ...testSet, dictionarySetId: '', name: '', ownerId: '' };
    const result = await dictionarySetService.createSet(badSet);
    expect(result).toBeNull();
  });

  test('should return null for getSetById if ID is empty', async () => {
    const result = await dictionarySetService.getSetById('');
    expect(result).toBeNull();
  });

  test('should return false for deleteSet if ID is empty', async () => {
    const result = await dictionarySetService.deleteSet('');
    expect(result).toBe(false);
  });
});
