import { SetTagModel } from '../../../src/models/tag/tag.js';
import Database from '../../../src/database/config/db-connection.js';
import { DictionarySet, Tag } from '../../../src/database/interfaces/DbInterfaces.js';

describe('CardsTagsModel', () => {
    let mockDb: jest.Mocked<Database>;
    let setTagModel: SetTagModel;
    let mockSets: Array<DictionarySet>;
    let mockTags: Array<Tag>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        setTagModel = new SetTagModel(mockDb as unknown as Database);

        mockSets = [
            { dictionarySetId: 'set1', name: 'Test Set', ownerId: 'user1', description: 'Test set', isPublic: false, languageCode: 'en' },
            { dictionarySetId: 'set2', name: 'Test Set 2', ownerId: 'user2', description: 'Test set 2', isPublic: false, languageCode: 'en' }
        ];

        mockTags = [
            { tagId: 'tag1', name: 'Test Tag' },
            { tagId: 'tag2', name: 'Test Tag 2' }
        ];
    });

    test('addTagToSet - should return true when set is added', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await setTagModel.addTagToSet(mockSets[0].dictionarySetId, mockTags[0].tagId);

        expect(result).toBe(true);
    });

    test('addTagToSet - should return false on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await setTagModel.addTagToSet(mockSets[0].dictionarySetId, mockTags[0].tagId);

        expect(result).toBe(false);
    });

    test('removeTagFromSet - should return true when tag is removed', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });

        const result = await setTagModel.removeTagFromSet(mockSets[0].dictionarySetId, mockTags[0].tagId);

        expect(result).toBe(true);
    });

    test('removeTagFromSet - should return false when no tag found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });

        const result = await setTagModel.removeTagFromSet(mockSets[0].dictionarySetId, mockTags[0].tagId);

        expect(result).toBe(false);
    });

    test('getTagsForSet - should return list of tags', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await setTagModel.getTagsForSet(mockSets[0].dictionarySetId);

        expect(result).toEqual(mockTags);
    });

    test('getTagsForSet - should return empty array on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await setTagModel.getTagsForSet(mockSets[0].dictionarySetId);

        expect(result).toEqual([]);
    }); 
});
