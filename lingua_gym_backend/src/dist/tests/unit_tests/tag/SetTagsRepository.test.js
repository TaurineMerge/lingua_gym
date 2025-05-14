var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SetTagRepository } from '../../../src/repositories/tag/tag.js';
import { LanguageCode } from '../../../src/database/interfaces/DbInterfaces.js';
describe('CardsTagsModel', () => {
    let mockDb;
    let setTagModel;
    let mockSets;
    let mockTags;
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = {
            query: jest.fn(),
        };
        setTagModel = new SetTagRepository(mockDb);
        mockSets = [
            { dictionarySetId: 'set1', name: 'Test Set', ownerId: 'user1', description: 'Test set', isPublic: false, languageCode: LanguageCode.ENGLISH },
            { dictionarySetId: 'set2', name: 'Test Set 2', ownerId: 'user2', description: 'Test set 2', isPublic: false, languageCode: LanguageCode.ENGLISH }
        ];
        mockTags = [
            { tagId: 'tag1', name: 'Test Tag' },
            { tagId: 'tag2', name: 'Test Tag 2' }
        ];
    });
    test('addTagToSet - should return true when set is added', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setTagModel.addTagToSet(mockSets[0].dictionarySetId, mockTags[0].tagId);
        expect(result).toBe(true);
    }));
    test('addTagToSet - should return false on error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        const result = yield setTagModel.addTagToSet(mockSets[0].dictionarySetId, mockTags[0].tagId);
        expect(result).toBe(false);
    }));
    test('removeTagFromSet - should return true when tag is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });
        const result = yield setTagModel.removeTagFromSet(mockSets[0].dictionarySetId, mockTags[0].tagId);
        expect(result).toBe(true);
    }));
    test('removeTagFromSet - should return false when no tag found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });
        const result = yield setTagModel.removeTagFromSet(mockSets[0].dictionarySetId, mockTags[0].tagId);
        expect(result).toBe(false);
    }));
    test('getTagsForSet - should return list of tags', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setTagModel.getTagsForSet(mockSets[0].dictionarySetId);
        expect(result).toEqual(mockTags);
    }));
    test('getTagsForSet - should return empty array on error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        const result = yield setTagModel.getTagsForSet(mockSets[0].dictionarySetId);
        expect(result).toEqual([]);
    }));
});
