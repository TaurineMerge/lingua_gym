import { TagRepository } from '../../../src/repositories/tag/tag.js';
import Database from '../../../src/database/config/db-connection.js';
import { ITag } from '../../../src/database/interfaces/DbInterfaces.js';

describe('TagModel', () => {
    let mockDb: jest.Mocked<Database>;
    let tagModel: TagRepository;
    
    let mockTag: ITag;

    let mockTags: Array<ITag>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        tagModel = new TagRepository(mockDb as unknown as Database);

        mockTag = { tagId: 'tag1', name: 'Test Tag' };
        mockTags = [mockTag, { tagId: 'tag2', name: 'Test Tag 2' }];
    });

    test('createTag - should return tag_id when successful', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [{ tag_id: mockTag.tagId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await tagModel.createTag(mockTag.tagId, mockTag.name);

        expect(mockDb.query).toHaveBeenCalledWith(
            `INSERT INTO tags (tag_id, name) VALUES ($1, $2) RETURNING tag_id;`,
            [mockTag.tagId, mockTag.name]
        );
        expect(result).toBe(mockTag.tagId);
    });

    test('createTag - should return null on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await tagModel.createTag(mockTag.tagId, mockTag.name);

        expect(result).toBeNull();
    });

    test('getTagById - should return tag data when found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [mockTag], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await tagModel.getTagById(mockTag.tagId);

        expect(result).toEqual(mockTag);
    });

    test('getTagById - should return null if no tag found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await tagModel.getTagById(mockTag.tagId);

        expect(result).toBeNull();
    });

    test('getAllTags - should return list of tags', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockTags, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await tagModel.getAllTags();

        expect(result).toEqual(mockTags);
    });

    test('getAllTags - should return empty array on error', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        const result = await tagModel.getAllTags();

        expect(result).toEqual([]);
    });

    test('updateTag - should return true if tag updated', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [mockTag], rowCount: 1, command: 'UPDATE', oid: 0, fields: [] });

        const result = await tagModel.updateTag(mockTag.tagId, "New name");

        expect(result).toBe(true);
    });

    test('updateTag - should return false if no rows updated', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'UPDATE', oid: 0, fields: [] });

        const result = await tagModel.updateTag(mockTag.tagId, mockTag.name);

        expect(result).toBe(false);
    });

    test('deleteTag - should return true if tag deleted', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [mockTag], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });

        const result = await tagModel.deleteTag(mockTag.tagId);

        expect(result).toBe(true);
    });

    test('deleteTag - should return false if no rows deleted', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });

        const result = await tagModel.deleteTag(mockTag.tagId);

        expect(result).toBe(false);
    });
});
