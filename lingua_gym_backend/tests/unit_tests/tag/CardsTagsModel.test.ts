import { CardsTagsModel } from '../../../src/models/tag/tag.js';
import Database from '../../../src/database/config/db-connection.js';
import { DictionaryCard, Tag, User } from '../../../src/database/interfaces/DbInterfaces.js';

describe('CardsTagsModel', () => {
    let mockDb: jest.Mocked<Database>;
    let cardsTagsModel: CardsTagsModel;
    let mockCards: Array<DictionaryCard>;
    let mockTags: Array<Tag>;
    let mockUser: User;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        cardsTagsModel = new CardsTagsModel(mockDb as unknown as Database);

        mockCards = [
            { dictionaryCardId: 'card1', original: 'test1', transcription: 'tɛst1', pronunciation: 'protocol://some/url.com' },
            { dictionaryCardId: 'card2', original: 'test2', transcription: 'tɛst2', pronunciation: 'protocol://some/url.com' }
        ];

        mockTags = [
            { tagId: 'tag1', name: 'Test Tag' },
            { tagId: 'tag2', name: 'Test Tag 2' }
        ];

        mockUser = {
            user_id: 'user1',
            username: 'testUser',
            display_name: 'Test User',
            password_hash: 'hashed_password',
            email: 'test@example.com',
            token_version: 1,
            email_verified: true
        };
    });

    test('addTagToCard - should return true when tag is added', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardsTagsModel.addTagToCard(mockCards[0].dictionaryCardId, mockTags[0].tagId);

        expect(mockDb.query).toHaveBeenCalledWith(
            `INSERT INTO cards_tags (card_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
            [mockCards[0].dictionaryCardId, mockTags[0].tagId]
        );
        expect(result).toBe(true);
    });

    test('addTagToCard - should return false on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await cardsTagsModel.addTagToCard(mockCards[0].dictionaryCardId, mockTags[0].tagId);

        expect(result).toBe(false);
    });

    test('removeTagFromCard - should return true when tag is removed', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });

        const result = await cardsTagsModel.removeTagFromCard(mockCards[0].dictionaryCardId, mockTags[0].tagId);

        expect(mockDb.query).toHaveBeenCalledWith(
            `DELETE FROM cards_tags WHERE card_id = $1 AND tag_id = $2;`,
            [mockCards[0].dictionaryCardId, mockTags[0].tagId]
        );
        expect(result).toBe(true);
    });

    test('removeTagFromCard - should return false when no tag found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });

        const result = await cardsTagsModel.removeTagFromCard(mockCards[0].dictionaryCardId, mockTags[0].tagId);

        expect(result).toBe(false);
    });

    test('getTagsByCard - should return list of tags', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardsTagsModel.getTagsByCard(mockCards[0].dictionaryCardId);

        expect(result).toEqual(mockTags);
    });

    test('getTagsByCard - should return empty array on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await cardsTagsModel.getTagsByCard(mockCards[0].dictionaryCardId);

        expect(result).toEqual([]);
    });

    test('getCardsByTag - should return list of user-specific cards', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockCards, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
    
        const result = await cardsTagsModel.getUserCardsByTag(mockTags[0].tagId, mockUser.user_id);
    
        expect(mockDb.query).toHaveBeenCalledWith(
            `SELECT ct.card_id FROM cards_tags ct JOIN dictionary_cards dc ON ct.card_id = dc.dictionary_card_id WHERE ct.tag_id = $1 AND dc.owner_id = $2;`,
            [mockTags[0].tagId, mockUser.user_id]
        );
        expect(result).toEqual(mockCards);
    });
    
    test('getCardsByTag - should return empty array when user has no cards with tag', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
    
        const result = await cardsTagsModel.getUserCardsByTag(mockTags[0].tagId, mockUser.user_id);
    
        expect(result).toEqual([]);
    });
    
    test('getCardsByTag - should return empty array on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
    
        const result = await cardsTagsModel.getUserCardsByTag(mockTags[0].tagId, mockUser.user_id);
    
        expect(result).toEqual([]);
    });    
});
