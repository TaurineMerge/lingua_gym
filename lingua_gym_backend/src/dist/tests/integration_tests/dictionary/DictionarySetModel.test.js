var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../../src/database/config/db-connection.js';
import { DictionarySetModel } from '../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { TagModel, SetTagsModel } from '../../../src/models/tag/tag.js';
describe('DictionarySetModel integration', () => {
    let db;
    let setModel;
    let tagModel;
    let setTagsModel;
    const sampleSet = (ownerId) => ({
        dictionarySetId: uuidv4(),
        name: `Test Set ${Math.random().toString(36).substring(2, 8)}`,
        ownerId: ownerId || uuidv4(),
        description: 'Sample dictionary set',
        isPublic: false,
        createdAt: new Date(),
    });
    const createTestTag = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (prefix = 'tag') {
        const tagName = `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
        const tagId = yield tagModel.createTag(uuidv4(), tagName);
        return tagId;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = Database.getInstance();
        setModel = new DictionarySetModel(db);
        tagModel = new TagModel(db);
        setTagsModel = new SetTagsModel(db);
        yield clearDatabase();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.close();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
    }));
    const clearDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
        yield db.query('DELETE FROM "SetTags"');
        yield db.query('DELETE FROM "Tags"');
        yield db.query('DELETE FROM "DictionarySets"');
    });
    describe('Basic Set Operations', () => {
        test('createSet should insert a dictionary set', () => __awaiter(void 0, void 0, void 0, function* () {
            const sample = sampleSet();
            const createdSet = yield setModel.createSet({
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
        }));
        test('getSetById should retrieve existing set', () => __awaiter(void 0, void 0, void 0, function* () {
            const set = sampleSet();
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
            const set = yield setModel.createSet(sampleSet());
            yield setModel.deleteSet(set.dictionarySetId);
            const fetchedSet = yield setModel.getSetById(set.dictionarySetId);
            expect(fetchedSet).toBeNull();
        }));
    });
    describe('Set Tag Operations', () => {
        let testSetId;
        let testTagId;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const set = yield setModel.createSet(sampleSet());
            testSetId = set.dictionarySetId;
            testTagId = yield createTestTag();
        }));
        test('addTagToSet and getTagsForSet should link tag to set', () => __awaiter(void 0, void 0, void 0, function* () {
            const isAdded = yield setTagsModel.addTagToSet(testSetId, testTagId);
            expect(isAdded).toBe(true);
            const tags = yield setTagsModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        }));
        test('addTagToSet should not duplicate tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const firstAdd = yield setTagsModel.addTagToSet(testSetId, testTagId);
            expect(firstAdd).toBe(true);
            const secondAdd = yield setTagsModel.addTagToSet(testSetId, testTagId);
            expect(secondAdd).toBe(false);
            const tags = yield setTagsModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(1);
        }));
        test('removeTagFromSet should unlink tag', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setTagsModel.addTagToSet(testSetId, testTagId);
            const removed = yield setTagsModel.removeTagFromSet(testSetId, testTagId);
            expect(removed).toBe(true);
            const tags = yield setTagsModel.getTagsForSet(testSetId);
            expect(tags.length).toBe(0);
        }));
        test('removeTagFromSet should return false if no link existed', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonLinkedTagId = yield createTestTag();
            const removed = yield setTagsModel.removeTagFromSet(testSetId, nonLinkedTagId);
            expect(removed).toBe(false);
        }));
        test('getTagsForSet should return empty array for set with no tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const tags = yield setTagsModel.getTagsForSet(testSetId);
            expect(tags).toEqual([]);
        }));
    });
});
