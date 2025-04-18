var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import TagService from '../../../src/services/tag/TagService.js';
import { v4 as uuidv4 } from 'uuid';
let tagService;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const serviceContainer = yield setupTestServiceContainer();
    tagService = serviceContainer.resolve(TagService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('TagService', () => {
    test('should create a tag', () => __awaiter(void 0, void 0, void 0, function* () {
        const tagId = uuidv4();
        const name = 'Adjective';
        const result = yield tagService.createTag(tagId, name);
        expect(result).toBe(tagId);
    }));
    test('should return null when tagId or name missing on create', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tagService.createTag('', '');
        expect(result).toBeNull();
    }));
    test('should fetch a tag by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const tagId = uuidv4();
        const name = 'Adverb';
        yield tagService.createTag(tagId, name);
        const tag = yield tagService.getTagById(tagId);
        expect(tag).not.toBeNull();
        expect(tag === null || tag === void 0 ? void 0 : tag.tagId).toBe(tagId);
        expect(tag === null || tag === void 0 ? void 0 : tag.name).toBe(name);
    }));
    test('should return null if tagId is missing in getTagById', () => __awaiter(void 0, void 0, void 0, function* () {
        const tag = yield tagService.getTagById('');
        expect(tag).toBeNull();
    }));
    test('should fetch all tags', () => __awaiter(void 0, void 0, void 0, function* () {
        yield tagService.createTag(uuidv4(), 'Pronoun');
        yield tagService.createTag(uuidv4(), 'Preposition');
        const tags = yield tagService.getAllTags();
        expect(tags.length).toBeGreaterThanOrEqual(2);
        const tagNames = tags.map(tag => tag.name);
        expect(tagNames).toEqual(expect.arrayContaining(['Pronoun', 'Preposition']));
    }));
    test('should update a tag name', () => __awaiter(void 0, void 0, void 0, function* () {
        const tagId = uuidv4();
        const originalName = 'Conjunction';
        const updatedName = 'Updated Conjunction';
        yield tagService.createTag(tagId, originalName);
        const result = yield tagService.updateTag(tagId, updatedName);
        expect(result).toBe(true);
        const updated = yield tagService.getTagById(tagId);
        expect(updated === null || updated === void 0 ? void 0 : updated.name).toBe(updatedName);
    }));
    test('should return false if update is called with missing data', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tagService.updateTag('', '');
        expect(result).toBe(false);
    }));
    test('should delete a tag', () => __awaiter(void 0, void 0, void 0, function* () {
        const tagId = uuidv4();
        const name = 'Interjection';
        yield tagService.createTag(tagId, name);
        const deleted = yield tagService.deleteTag(tagId);
        expect(deleted).toBe(true);
        const result = yield tagService.getTagById(tagId);
        expect(result).toBeNull();
    }));
    test('should return false if tagId is missing on delete', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tagService.deleteTag('');
        expect(result).toBe(false);
    }));
});
