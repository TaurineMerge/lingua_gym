import { setupTestServiceContainer, setupTestRepositoryContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import SetTagService from '../../../src/services/tag/SetTagService.js';
import { TagRepository } from '../../../src/repositories/tag/tag.js';
import { DictionarySetRepository } from '../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { IDictionarySet, LanguageCode } from '../../../src/database/interfaces/DbInterfaces.js';
import { UserRepository } from '../../../src/repositories/access_management/access_management.js';
import User from '../../../src/models/access_management/User.js';

let setTagService: SetTagService;
let tagModel: TagRepository;
let setModel: DictionarySetRepository;
let userModel: UserRepository;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestRepositoryContainer();
  tagModel = modelContainer.resolve(TagRepository);
  setModel = modelContainer.resolve(DictionarySetRepository);
  userModel = modelContainer.resolve(UserRepository);

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
  const user = new User({
    username: 'test',
    password: 'test',
    email: 'test',
  });

  await userModel.createUser(user);

  return user.userId;
}

const createTagData = async (): Promise<string> => {
  const tagId = uuidv4();
  return tagId;
}

const createSetData = async (): Promise<IDictionarySet> => {
  const setId = uuidv4();
  const set: IDictionarySet = {
    dictionarySetId: setId,
    name: 'Test Set',
    ownerId: await createUser(),
    description: 'Set for testing',
    isPublic: false,
    languageCode: LanguageCode.ENGLISH,
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
