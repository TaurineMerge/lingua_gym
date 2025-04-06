import Database from '../../../src/database/config/db-connection.js';
import { DictionarySetModel } from '../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { DictionarySet } from '../../../src/database/interfaces/DbInterfaces.js';
import { TagModel, SetTagsModel } from '../../../src/models/tag/tag.js';

describe('DictionarySetModel integration', () => {
    let db: Database;
    let setModel: DictionarySetModel;
    let tagModel: TagModel;
    let setTagsModel: SetTagsModel;

    const sampleSet = (ownerId?: string): DictionarySet => ({
        dictionarySetId: uuidv4(),
        name: `Test Set ${Math.random().toString(36).substring(2, 8)}`,
        ownerId: ownerId || uuidv4(),
        description: 'Sample dictionary set',
        isPublic: false,
        createdAt: new Date(),
    });

    const createTestTag = async (prefix = 'tag'): Promise<string> => {
        const tagName = `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
        const tagId = await tagModel.createTag(uuidv4(), tagName) as string;
        return tagId;
    };

    beforeAll(async () => {
        db = Database.getInstance();
        setModel = new DictionarySetModel(db);
        tagModel = new TagModel(db);
        setTagsModel = new SetTagsModel(db);

        await clearDatabase();
    });

    afterAll(async () => {
        await db.close();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    const clearDatabase = async () => {
        await db.query('DELETE FROM "SetTags"');
        await db.query('DELETE FROM "Tags"');
        await db.query('DELETE FROM "DictionarySets"');
    };

    describe('Basic Set Operations', () => {
        test('createSet should insert a dictionary set', async () => {
            const sample: DictionarySet = sampleSet();
            const createdSet: DictionarySet = await setModel.createSet({
                dictionarySetId: sample.dictionarySetId,
                name: sample.name,
                ownerId: sample.ownerId,
                description: sample.description,
                isPublic: sample.isPublic,
                createdAt: sample.createdAt
            });

            expect(createdSet).toMatchObject({
                dictionarySetId: sample.dictionarySetId,
                name: sample.name,
                ownerId: sample.ownerId,
                description: sample.description,
                isPublic: sample.isPublic,
                createdAt: expect.any(Date),
            });
        });

        test('getSetById should retrieve existing set', async () => {
            const set: DictionarySet = sampleSet();
            await setModel.createSet(set);
            
            const fetchedSet = await setModel.getSetById(set.dictionarySetId);

            expect(fetchedSet).toEqual(expect.objectContaining({
                dictionarySetId: set.dictionarySetId,
                ownerId: set.ownerId,
                description: set.description,
                isPublic: set.isPublic,
                name: set.name
            }));
        });

        test('getSetById should return null for non-existent set', async () => {
            const nonExistentId = uuidv4();
            const result = await setModel.getSetById(nonExistentId);
            expect(result).toBeNull();
        });

        test('deleteSet should remove a set', async () => {
            const set = await setModel.createSet(sampleSet());
            await setModel.deleteSet(set.dictionarySetId);
            const fetchedSet = await setModel.getSetById(set.dictionarySetId);
            expect(fetchedSet).toBeNull();
        });
    });

    describe('Set Tag Operations', () => {
        let testSetId: string;
        let testTagId: string;

        beforeEach(async () => {
            const set = await setModel.createSet(sampleSet());
            testSetId = set.dictionarySetId;
            testTagId = await createTestTag();
        });

        test('addTagToSet and getTagsForSet should link tag to set', async () => {
            const isAdded = await setTagsModel.addTagToSet(testSetId, testTagId);
            expect(isAdded).toBe(true);

            const tags = await setTagsModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        });

        test('addTagToSet should not duplicate tags', async () => {
            const firstAdd = await setTagsModel.addTagToSet(testSetId, testTagId);
            expect(firstAdd).toBe(true);

            const secondAdd = await setTagsModel.addTagToSet(testSetId, testTagId);
            expect(secondAdd).toBe(false);

            const tags = await setTagsModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        });

        test('removeTagFromSet should unlink tag', async () => {
            await setTagsModel.addTagToSet(testSetId, testTagId);
            
            const removed = await setTagsModel.removeTagFromSet(testSetId, testTagId);
            expect(removed).toBe(true);

            const tags = await setTagsModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(0);
        });

        test('removeTagFromSet should return false if no link existed', async () => {
            const nonLinkedTagId = await createTestTag();
            const removed = await setTagsModel.removeTagFromSet(testSetId, nonLinkedTagId);
            expect(removed).toBe(false);
        });

        test('getTagsForSet should return empty array for set with no tags', async () => {
            const tags = await setTagsModel.getTagsForSet(testSetId);
            expect(tags).toEqual([]);
        });
    });
});