var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DictionarySetModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { TagModel, SetTagModel } from '../../../../src/repositories/tag/tag.js';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';
import { UserModel } from '../../../../src/repositories/access_management/access_management.js';
import hash_password from '../../../../src/utils/hash/HashPassword.js';
describe('DictionarySetModel integration', () => {
    let setModel;
    let tagModel;
    let setTagModel;
    let userModel;
    let userId;
    const sampleSet = (ownerId) => ({
        dictionarySetId: uuidv4(),
        name: `Test Set ${Math.random().toString(36).substring(2, 8)}`,
        ownerId: ownerId || uuidv4(),
        description: 'Sample dictionary set',
        isPublic: false,
        languageCode: 'en',
    });
    const createTestTag = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (prefix = 'tag') {
        const tagName = `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
        const tagId = yield tagModel.createTag(uuidv4(), tagName);
        return tagId;
    });
    const createTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
        const userName = `Test User ${Math.random().toString(36).substring(2, 8)}`;
        const userId = uuidv4();
        const passwrod = 'password123';
        const user = {
            userId: userId,
            username: userName,
            displayName: userName,
            passwordHash: yield hash_password(passwrod),
            email: `${userName}@example.com`,
            tokenVersion: 0,
            profilePicture: 'photo.png',
            emailVerified: false
        };
        yield userModel.createUser(user);
        return userId;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        const modelContainer = yield setupTestModelContainer();
        setModel = modelContainer.resolve(DictionarySetModel);
        tagModel = modelContainer.resolve(TagModel);
        setTagModel = modelContainer.resolve(SetTagModel);
        userModel = modelContainer.resolve(UserModel);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        userId = (yield createTestUser());
        return userId;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        yield closeDatabase();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
    }));
    describe('Basic Set Operations', () => {
        test('createSet should insert a dictionary set', () => __awaiter(void 0, void 0, void 0, function* () {
            const sample = sampleSet(userId);
            const createdSet = yield setModel.createSet({
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
        }));
        test('getSetById should retrieve existing set', () => __awaiter(void 0, void 0, void 0, function* () {
            const set = sampleSet(userId);
            yield setModel.createSet(set);
            const fetchedSet = yield setModel.getSetById(set.dictionarySetId);
            expect(fetchedSet).toEqual(expect.objectContaining({
                dictionarySetId: set.dictionarySetId,
                ownerId: set.ownerId,
                description: set.description,
                isPublic: set.isPublic,
                name: set.name
            }));
        }));
        test('getSetById should return null for non-existent set', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = uuidv4();
            const result = yield setModel.getSetById(nonExistentId);
            expect(result).toBeNull();
        }));
        test('deleteSet should remove a set', () => __awaiter(void 0, void 0, void 0, function* () {
            const set = yield setModel.createSet(sampleSet(userId));
            yield setModel.deleteSet(set.dictionarySetId);
            const fetchedSet = yield setModel.getSetById(set.dictionarySetId);
            expect(fetchedSet).toBeNull();
        }));
    });
    describe('Set Tag Operations', () => {
        let testSetId;
        let testTagId;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const set = yield setModel.createSet(sampleSet(userId));
            testSetId = set.dictionarySetId;
            testTagId = yield createTestTag();
        }));
        test('addTagToSet and getTagsForSet should link tag to set', () => __awaiter(void 0, void 0, void 0, function* () {
            const isAdded = yield setTagModel.addTagToSet(testSetId, testTagId);
            expect(isAdded).toBe(true);
            const tags = yield setTagModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        }));
        test('addTagToSet should not duplicate tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const firstAdd = yield setTagModel.addTagToSet(testSetId, testTagId);
            expect(firstAdd).toBe(true);
            const secondAdd = yield setTagModel.addTagToSet(testSetId, testTagId);
            expect(secondAdd).toBe(false);
            const tags = yield setTagModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        }));
        test('removeTagFromSet should unlink tag', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setTagModel.addTagToSet(testSetId, testTagId);
            const removed = yield setTagModel.removeTagFromSet(testSetId, testTagId);
            expect(removed).toBe(true);
            const tags = yield setTagModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(0);
        }));
        test('removeTagFromSet should return false if no link existed', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonLinkedTagId = yield createTestTag();
            const removed = yield setTagModel.removeTagFromSet(testSetId, nonLinkedTagId);
            expect(removed).toBe(false);
        }));
        test('getTagsForSet should return empty array for set with no tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const tags = yield setTagModel.getTagsForSet(testSetId);
            expect(tags).toEqual([]);
        }));
    });
});
