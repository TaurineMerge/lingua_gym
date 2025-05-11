import { setupTestServiceContainer, setupTestModelContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import SetTagService from '../../../src/services/tag/SetTagService.js';
import { TagModel } from '../../../src/repositories/tag/tag.js';
import { DictionarySetModel } from '../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { DictionarySet, User } from '../../../src/database/interfaces/DbInterfaces.js';
import password_hash from '../../../src/utils/hash/HashPassword.js';
import { UserModel } from '../../../src/repositories/access_management/access_management.js';

let setTagService: SetTagService;
let tagModel: TagModel;
let setModel: DictionarySetModel;
let userModel: UserModel;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestModelContainer();
  tagModel = modelContainer.resolve(TagModel);
  setModel = modelContainer.resolve(DictionarySetModel);
  userModel = modelContainer.resolve(UserModel);

  const serviceContainer = await setupTestServiceContainer();
  setTagService = serviceContainer.resolve(SetTagService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

const createUser = async () => {
  const user: User = {
    userId: uuidv4(),
    username: 'test',
    passwordHash: password_hash('test'),
    email: 'test',
    displayName: 'Test User',
    tokenVersion: 0,
    emailVerified: false
  };

  await userModel.createUser(user);

  return user.userId;
}

const createTagData = async (): Promise<string> => {
  const tagId = uuidv4();
  return tagId;
}

const createSetData = async (): Promise<DictionarySet> => {
  const setId = uuidv4();
  const set: DictionarySet = {
    dictionarySetId: setId,
    name: 'Test Set',
    ownerId: await createUser(),
    description: 'Set for testing',
    isPublic: false,
    languageCode: 'en',
  }

  return set;
}

describe('SetTagService', () => {
  test('should add a tag to a set', async () => {
    const set = await createSetData();
    const tagId = await createTagData();
    
    await setModel.createSet(set);
    await tagModel.createTag(tagId, 'Adjectives');

    const result = await setTagService.addTagToSet(set.dictionarySetId, tagId);
    expect(result).toBe(true);
  });

  test('should not add a tag to set if setId or tagId missing', async () => {
    const result = await setTagService.addTagToSet('', '');
    expect(result).toBe(false);
  });

  test('should remove a tag from a set', async () => {
    const set = await createSetData();
    const tagId = await createTagData();

    await setModel.createSet(set);
    await tagModel.createTag(tagId, 'Noun');
    await setTagService.addTagToSet(set.dictionarySetId, tagId);

    const result = await setTagService.removeTagFromSet(set.dictionarySetId, tagId);
    expect(result).toBe(true);
  });

  test('should not remove tag if setId or tagId missing', async () => {
    const result = await setTagService.removeTagFromSet('', '');
    expect(result).toBe(false);
  });

  test('should get tags for a set', async () => {
    const set = await createSetData();
    const tagId1 = await createTagData();
    const tagId2 = await createTagData();

    await setModel.createSet(set);
    await tagModel.createTag(tagId1, 'Useful');
    await tagModel.createTag(tagId2, 'Daily');
    await setTagService.addTagToSet(set.dictionarySetId, tagId1);
    await setTagService.addTagToSet(set.dictionarySetId, tagId2);

    const tags = await setTagService.getTagsForSet(set.dictionarySetId);
    console.log(tags);
    expect(tags).toBeInstanceOf(Array);
    expect(tags.length).toBe(2);
    expect(tags[0].setId).toBe(set.dictionarySetId);
  });

  test('should return empty array if setId is missing', async () => {
    const tags = await setTagService.getTagsForSet('');
    expect(tags).toEqual([]);
  });
});
