import { setupTestModelContainer, setupTestServiceContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import { TagModel } from '../../../src/models/tag/tag.js';
import CardTagService from '../../../src/services/tag/CardTagService.js';
import { DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import { randomUUID } from 'crypto';

let cardTagService: CardTagService;
let tagModel: TagModel;
let cardModel: DictionaryCardModel;

beforeAll(async () => {
  const modelContainer = await setupTestModelContainer();
  tagModel = modelContainer.resolve(TagModel);
  cardModel = modelContainer.resolve(DictionaryCardModel);
  
  const serviceContainer = await setupTestServiceContainer();
  cardTagService = serviceContainer.resolve(CardTagService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('CardTagService', () => {
  test('should add a tag to a card', async () => {
    const cardId = randomUUID();
    const tagId = randomUUID();

    await cardModel.createCard(cardId, 'dog', 'собака', 'user1', 'set1');
    await tagModel.createTag(tagId, 'Animals');

    const result = await cardTagService.addTagToCard(cardId, tagId);
    expect(result).toBe(true);
  });

  test('should not add tag to card if cardId or tagId is missing', async () => {
    const result = await cardTagService.addTagToCard('', '');
    expect(result).toBe(false);
  });

  test('should remove a tag from a card', async () => {
    const cardId = randomUUID();
    const tagId = randomUUID();

    await cardModel.createCard(cardId, 'cat', 'кошка', 'user2', 'set2');
    await tagModel.createTag(tagId, 'Pets');
    await cardTagService.addTagToCard(cardId, tagId);

    const result = await cardTagService.removeTagFromCard(cardId, tagId);
    expect(result).toBe(true);
  });

  test('should not remove tag if cardId or tagId is missing', async () => {
    const result = await cardTagService.removeTagFromCard('', '');
    expect(result).toBe(false);
  });

  test('should get tags for a card', async () => {
    const cardId = randomUUID();
    const tagId1 = randomUUID();
    const tagId2 = randomUUID();

    await cardModel.createCard(cardId, 'apple', 'яблоко', 'user3', 'set3');
    await tagModel.createTag(tagId1, 'Fruits');
    await tagModel.createTag(tagId2, 'Food');
    await cardTagService.addTagToCard(cardId, tagId1);
    await cardTagService.addTagToCard(cardId, tagId2);

    const tags = await cardTagService.getTagsForCard(cardId);
    expect(tags).toEqual(expect.arrayContaining([tagId1, tagId2]));
  });

  test('should return empty array if cardId is missing', async () => {
    const tags = await cardTagService.getTagsForCard('');
    expect(tags).toEqual([]);
  });
});
