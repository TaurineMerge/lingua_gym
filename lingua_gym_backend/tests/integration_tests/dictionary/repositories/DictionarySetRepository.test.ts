import { DictionarySetRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { IDictionarySet, LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import { TagRepository, SetTagRepository } from '../../../../src/repositories/tag/tag.js';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer } from '../../../utils/di/TestContainer.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import User from '../../../../src/models/access_management/User.js';

describe('DictionarySetModel integration', () => {
    let setModel: DictionarySetRepository;
    let tagModel: TagRepository;
    let setTagModel: SetTagRepository;
    let userModel: UserRepository;

    let userId: string;

    const sampleSet = (ownerId?: string): IDictionarySet => ({
        dictionarySetId: uuidv4(),
        name: `Test Set ${Math.random().toString(36).substring(2, 8)}`,
        ownerId: ownerId || uuidv4(),
        description: 'Sample dictionary set',
        isPublic: false,
        languageCode: LanguageCode.ENGLISH,
    });

    const createTestTag = async (prefix = 'tag'): Promise<string> => {
        const tagName = `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
        const tagId = await tagModel.createTag(uuidv4(), tagName) as string;
        return tagId;
    };

    const createTestUser = async (): Promise<string> => {
        const userName = `Test User ${Math.random().toString(36).substring(2, 8)}`;
        const passwrod = 'password123';
        const user = new User({
            username: userName,
            displayName: userName,
            password: passwrod,
            email: `${userName}@example.com`,
        });
        await userModel.createUser(user);
        return userId;
    }

    beforeAll(async () => {
        await clearDatabase();
        const modelContainer = await setupTestRepositoryContainer();

        setModel = modelContainer.resolve<DictionarySetRepository>(DictionarySetRepository);
        tagModel = modelContainer.resolve<TagRepository>(TagRepository);
        setTagModel = modelContainer.resolve<SetTagRepository>(SetTagRepository);
        userModel = modelContainer.resolve<UserRepository>(UserRepository);
    });

    beforeEach(async (): Promise<string> => {
        userId = await createTestUser() as string;
        return userId;
    });

    afterAll(async () => {
        await clearDatabase();
        await closeDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    describe('Basic Set Operations', () => {
        test('createSet should insert a dictionary set', async () => {
            const sample: IDictionarySet = sampleSet(userId);
            const createdSet: IDictionarySet = await setModel.createSet({
                dictionarySetId: sample.dictionarySetId,
                name: sample.name,
                ownerId: sample.ownerId,
                description: sample.description,
                isPublic: sample.isPublic,
                languageCode: sample.languageCode
            });

            expect(createdSet).toMatchObject({
                dictionarySetId: sample.dictionarySetId,
                name: sample.name,
                ownerId: sample.ownerId,
                description: sample.description,
                isPublic: sample.isPublic,
                languageCode: sample.languageCode
            });
        });

        test('getSetById should retrieve existing set', async () => {
            const set: IDictionarySet = sampleSet(userId);
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
            const set = await setModel.createSet(sampleSet(userId));
            await setModel.deleteSet(set.dictionarySetId);
            const fetchedSet = await setModel.getSetById(set.dictionarySetId);
            expect(fetchedSet).toBeNull();
        });
    });

    describe('Set Tag Operations', () => {
        let testSetId: string;
        let testTagId: string;

        beforeEach(async () => {
            const set = await setModel.createSet(sampleSet(userId));
            testSetId = set.dictionarySetId;
            testTagId = await createTestTag();
        });

        test('addTagToSet and getTagsForSet should link tag to set', async () => {
            const isAdded = await setTagModel.addTagToSet(testSetId, testTagId);
            expect(isAdded).toBe(true);

            const tags = await setTagModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        });

        test('addTagToSet should not duplicate tags', async () => {
            const firstAdd = await setTagModel.addTagToSet(testSetId, testTagId);
            expect(firstAdd).toBe(true);

            const secondAdd = await setTagModel.addTagToSet(testSetId, testTagId);
            expect(secondAdd).toBe(false);

            const tags = await setTagModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        });

        test('removeTagFromSet should unlink tag', async () => {
            await setTagModel.addTagToSet(testSetId, testTagId);
            
            const removed = await setTagModel.removeTagFromSet(testSetId, testTagId);
            expect(removed).toBe(true);

            const tags = await setTagModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(0);
        });

        test('removeTagFromSet should return false if no link existed', async () => {
            const nonLinkedTagId = await createTestTag();
            const removed = await setTagModel.removeTagFromSet(testSetId, nonLinkedTagId);
            expect(removed).toBe(false);
        });

        test('getTagsForSet should return empty array for set with no tags', async () => {
            const tags = await setTagModel.getTagsForSet(testSetId);
            expect(tags).toEqual([]);
        });
    });
});