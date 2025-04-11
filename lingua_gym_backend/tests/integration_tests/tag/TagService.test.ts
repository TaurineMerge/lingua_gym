import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import TagService from '../../../src/services/tag/TagService.js';
import { v4 as uuidv4 } from 'uuid';

let tagService: TagService;

beforeAll(async () => {
  await clearDatabase();
  const serviceContainer = await setupTestServiceContainer();
  tagService = serviceContainer.resolve(TagService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('TagService', () => {
  test('should create a tag', async () => {
    const tagId = uuidv4();
    const name = 'Adjective';

    const result = await tagService.createTag(tagId, name);
    expect(result).toBe(tagId);
  });

  test('should return null when tagId or name missing on create', async () => {
    const result = await tagService.createTag('', '');
    expect(result).toBeNull();
  });

  test('should fetch a tag by ID', async () => {
    const tagId = uuidv4();
    const name = 'Adverb';
    await tagService.createTag(tagId, name);

    const tag = await tagService.getTagById(tagId);
    expect(tag).not.toBeNull();
    expect(tag?.tagId).toBe(tagId);
    expect(tag?.name).toBe(name);
  });

  test('should return null if tagId is missing in getTagById', async () => {
    const tag = await tagService.getTagById('');
    expect(tag).toBeNull();
  });

  test('should fetch all tags', async () => {
    await tagService.createTag(uuidv4(), 'Pronoun');
    await tagService.createTag(uuidv4(), 'Preposition');

    const tags = await tagService.getAllTags();
    expect(tags.length).toBeGreaterThanOrEqual(2);
    const tagNames = tags.map(tag => tag.name);
    expect(tagNames).toEqual(expect.arrayContaining(['Pronoun', 'Preposition']));
  });

  test('should update a tag name', async () => {
    const tagId = uuidv4();
    const originalName = 'Conjunction';
    const updatedName = 'Updated Conjunction';

    await tagService.createTag(tagId, originalName);
    const result = await tagService.updateTag(tagId, updatedName);
    expect(result).toBe(true);

    const updated = await tagService.getTagById(tagId);
    expect(updated?.name).toBe(updatedName);
  });

  test('should return false if update is called with missing data', async () => {
    const result = await tagService.updateTag('', '');
    expect(result).toBe(false);
  });

  test('should delete a tag', async () => {
    const tagId = uuidv4();
    const name = 'Interjection';
    await tagService.createTag(tagId, name);

    const deleted = await tagService.deleteTag(tagId);
    expect(deleted).toBe(true);

    const result = await tagService.getTagById(tagId);
    expect(result).toBeNull();
  });

  test('should return false if tagId is missing on delete', async () => {
    const result = await tagService.deleteTag('');
    expect(result).toBe(false);
  });
});
