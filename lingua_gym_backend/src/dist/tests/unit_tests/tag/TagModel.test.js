var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TagModel } from '../../../src/repositories/tag/tag.js';
describe('TagModel', () => {
    let mockDb;
    let tagModel;
    let mockTag;
    let mockTags;
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = {
            query: jest.fn(),
        };
        tagModel = new TagModel(mockDb);
        mockTag = { tagId: 'tag1', name: 'Test Tag' };
        mockTags = [mockTag, { tagId: 'tag2', name: 'Test Tag 2' }];
    });
    test('createTag - should return tag_id when successful', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [{ tag_id: mockTag.tagId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield tagModel.createTag(mockTag.tagId, mockTag.name);
        expect(mockDb.query).toHaveBeenCalledWith(`INSERT INTO tags (tag_id, name) VALUES ($1, $2) RETURNING tag_id;`, [mockTag.tagId, mockTag.name]);
        expect(result).toBe(mockTag.tagId);
    }));
    test('createTag - should return null on error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        const result = yield tagModel.createTag(mockTag.tagId, mockTag.name);
        expect(result).toBeNull();
    }));
    test('getTagById - should return tag data when found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [mockTag], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield tagModel.getTagById(mockTag.tagId);
        expect(result).toEqual(mockTag);
    }));
    test('getTagById - should return null if no tag found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield tagModel.getTagById(mockTag.tagId);
        expect(result).toBeNull();
    }));
    test('getAllTags - should return list of tags', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield tagModel.getAllTags();
        expect(result).toEqual(mockTags);
    }));
    test('getAllTags - should return empty array on error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        const result = yield tagModel.getAllTags();
        expect(result).toEqual([]);
    }));
    test('updateTag - should return true if tag updated', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [mockTag], rowCount: 1, command: 'UPDATE', oid: 0, fields: [] });
        const result = yield tagModel.updateTag(mockTag.tagId, "New name");
        expect(result).toBe(true);
    }));
    test('updateTag - should return false if no rows updated', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'UPDATE', oid: 0, fields: [] });
        const result = yield tagModel.updateTag(mockTag.tagId, mockTag.name);
        expect(result).toBe(false);
    }));
    test('deleteTag - should return true if tag deleted', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [mockTag], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });
        const result = yield tagModel.deleteTag(mockTag.tagId);
        expect(result).toBe(true);
    }));
    test('deleteTag - should return false if no rows deleted', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });
        const result = yield tagModel.deleteTag(mockTag.tagId);
        expect(result).toBe(false);
    }));
});
