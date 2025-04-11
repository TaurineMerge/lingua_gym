import { setupTestModelContainer, setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { DictionarySetModel } from '../../../../src/models/dictionary/dictionary.js';
import UserSetService from '../../../../src/services/dictionary/UserSetService.js';
import { DictionarySet, Permission } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';

let userSetService: UserSetService;
let setModel: DictionarySetModel;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestModelContainer();
  setModel = modelContainer.resolve(DictionarySetModel);
  
  const serviceContainer = await setupTestServiceContainer();
  userSetService = serviceContainer.resolve(UserSetService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('UserSetService', () => {
  const testSet: DictionarySet = {
    dictionarySetId: uuidv4(),
    name: 'Test Set',
    description: 'Shared set',
    ownerId: uuidv4(),
    isPublic: false,
    languageCode: 'en',
  };

  test('should add user to set with permission', async () => {
    await setModel.createSet(testSet);
    const userId = uuidv4();
    const result = await userSetService.addUserSet(userId, testSet.dictionarySetId, 'read' as Permission);
    expect(result).not.toBe(false);
    if (result !== false && result !== true) {
      expect(result.setId).toBe(testSet.dictionarySetId);
      expect(result.userId).toBe(userId);
      expect(result.permission).toBe('read');
    }
  });

  test('should return sets for user', async () => {
    await setModel.createSet(testSet);
    const userId = uuidv4();
    await userSetService.addUserSet(userId, testSet.dictionarySetId, 'write' as Permission);

    const sets = await userSetService.getUserSets(userId);
    expect(sets.length).toBe(1);
    expect(sets[0].setId).toBe(testSet.dictionarySetId);
  });

  test('should return users for set', async () => {
    await setModel.createSet(testSet);
    const userId1 = uuidv4();
    const userId2 = uuidv4();
    await userSetService.addUserSet(userId1, testSet.dictionarySetId, 'read' as Permission);
    await userSetService.addUserSet(userId2, testSet.dictionarySetId, 'write' as Permission);

    const users = await userSetService.getUsersForSet(testSet.dictionarySetId);
    expect(users.length).toBe(2);
    const userIds = users.map(u => u.userId);
    expect(userIds).toContain(userId1);
    expect(userIds).toContain(userId2);
  });

  test('should remove user from set', async () => {
    await setModel.createSet(testSet);
    const userId = uuidv4();
    await userSetService.addUserSet(userId, testSet.dictionarySetId, 'read' as Permission);

    const removed = await userSetService.removeUserSet(userId, testSet.dictionarySetId);
    expect(removed).not.toBe(false);

    const users = await userSetService.getUsersForSet(testSet.dictionarySetId);
    expect(users.length).toBe(0);
  });

  test('should return false if userId or setId missing when adding', async () => {
    const result = await userSetService.addUserSet('', '', 'read' as Permission);
    expect(result).toBe(false);
  });

  test('should return false if userId or setId missing when removing', async () => {
    const result = await userSetService.removeUserSet('', '');
    expect(result).toBe(false);
  });

  test('should return empty array if userId is missing in getUserSets', async () => {
    const result = await userSetService.getUserSets('');
    expect(result).toEqual([]);
  });

  test('should return empty array if setId is missing in getUsersForSet', async () => {
    const result = await userSetService.getUsersForSet('');
    expect(result).toEqual([]);
  });
});