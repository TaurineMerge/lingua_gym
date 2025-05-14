var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CardTagRepository } from '../../../src/repositories/tag/tag.js';
describe('CardsTagsModel', () => {
    let mockDb;
    let cardTagModel;
    let mockCards;
    let mockTags;
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = {
            query: jest.fn(),
        };
        cardTagModel = new CardTagRepository(mockDb);
        mockCards = [
            { cardId: 'card1', original: 'test1', transcription: 'tɛst1', pronunciation: 'protocol://some/url.com' },
            { cardId: 'card2', original: 'test2', transcription: 'tɛst2', pronunciation: 'protocol://some/url.com' }
        ];
        mockTags = [
            { tagId: 'tag1', name: 'Test Tag' },
            { tagId: 'tag2', name: 'Test Tag 2' }
        ];
    });
    test('addTagToCard - should return true when tag is added', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardTagModel.addTagToCard(mockCards[0].cardId, mockTags[0].tagId);
        expect(mockDb.query).toHaveBeenCalledWith(`INSERT INTO cards_tags (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`, [mockCards[0].cardId, mockTags[0].tagId]);
        expect(result).toBe(true);
    }));
    test('addTagToCard - should return false on error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        const result = yield cardTagModel.addTagToCard(mockCards[0].cardId, mockTags[0].tagId);
        expect(result).toBe(false);
    }));
    test('removeTagFromCard - should return true when tag is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });
        const result = yield cardTagModel.removeTagFromCard(mockCards[0].cardId, mockTags[0].tagId);
        expect(mockDb.query).toHaveBeenCalledWith(`DELETE FROM cards_tags WHERE card_id = $1 AND tag_id = $2;`, [mockCards[0].cardId, mockTags[0].tagId]);
        expect(result).toBe(true);
    }));
    test('removeTagFromCard - should return false when no tag found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });
        const result = yield cardTagModel.removeTagFromCard(mockCards[0].cardId, mockTags[0].tagId);
        expect(result).toBe(false);
    }));
    test('getTagsForCard - should return list of tags', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardTagModel.getTagsForCard(mockCards[0].cardId);
        expect(result).toEqual(mockTags);
    }));
    test('getTagsForCard - should return empty array on error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        const result = yield cardTagModel.getTagsForCard(mockCards[0].cardId);
        expect(result).toEqual([]);
    }));
});
