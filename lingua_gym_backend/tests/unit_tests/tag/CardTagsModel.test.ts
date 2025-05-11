import { CardTagModel } from '../../../src/repositories/tag/tag.js';
import Database from '../../../src/database/config/db-connection.js';
import { DictionaryCard, Tag } from '../../../src/database/interfaces/DbInterfaces.js';

describe('CardsTagsModel', () => {
    let mockDb: jest.Mocked<Database>;
    let cardTagModel: CardTagModel;
    let mockCards: Array<DictionaryCard>;
    let mockTags: Array<Tag>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        cardTagModel = new CardTagModel(mockDb as unknown as Database);

        mockCards = [
            { cardId: 'card1', original: 'test1', transcription: 'tɛst1', pronunciation: 'protocol://some/url.com' },
            { cardId: 'card2', original: 'test2', transcription: 'tɛst2', pronunciation: 'protocol://some/url.com' }
        ];

        mockTags = [
            { tagId: 'tag1', name: 'Test Tag' },
            { tagId: 'tag2', name: 'Test Tag 2' }
        ];
    });

    test('addTagToCard - should return true when tag is added', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardTagModel.addTagToCard(mockCards[0].cardId, mockTags[0].tagId);

        expect(mockDb.query).toHaveBeenCalledWith(
            `INSERT INTO cards_tags (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
            [mockCards[0].cardId, mockTags[0].tagId]
        );
        expect(result).toBe(true);
    });

    test('addTagToCard - should return false on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await cardTagModel.addTagToCard(mockCards[0].cardId, mockTags[0].tagId);

        expect(result).toBe(false);
    });

    test('removeTagFromCard - should return true when tag is removed', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });

        const result = await cardTagModel.removeTagFromCard(mockCards[0].cardId, mockTags[0].tagId);

        expect(mockDb.query).toHaveBeenCalledWith(
            `DELETE FROM cards_tags WHERE card_id = $1 AND tag_id = $2;`,
            [mockCards[0].cardId, mockTags[0].tagId]
        );
        expect(result).toBe(true);
    });

    test('removeTagFromCard - should return false when no tag found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });

        const result = await cardTagModel.removeTagFromCard(mockCards[0].cardId, mockTags[0].tagId);

        expect(result).toBe(false);
    });

    test('getTagsForCard - should return list of tags', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardTagModel.getTagsForCard(mockCards[0].cardId);

        expect(result).toEqual(mockTags);
    });

    test('getTagsForCard - should return empty array on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await cardTagModel.getTagsForCard(mockCards[0].cardId);

        expect(result).toEqual([]);
    }); 
});
