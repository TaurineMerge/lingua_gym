import Database from '../../../../src/database/config/db-connection.js';
import { DictionarySetModel } from '../../../../src/models/dictionary/dictionary.js';
import { DictionarySet, Tag } from '../../../../src/database/interfaces/DbInterfaces.js';
import { SetTagModel } from '../../../../src/models/tag/tag.js';

describe('DictionarySetModel', () => {
    let dbMock: jest.Mocked<Database>;
    let setModel: DictionarySetModel;
    let setTagsModel: SetTagModel;

    let set: DictionarySet;
    let setId: string;
    let setName: string;
    let setOwnerId: string;
    let setDescription: string;

    let tags: Array<Tag>;

    beforeAll(() => {
        setId = 'set-uuid';
        setName = 'Test Set';
        setOwnerId = 'user-uuid';
        setDescription = 'A test set';
        set = {
            dictionarySetId: setId,
            name: setName,
            ownerId: setOwnerId,
            description: setDescription,
            isPublic: false,
            languageCode: 'en',
        };

        tags = [{ tagId: 'tag-123', name: 'tag1' }, { tagId: 'tag-456', name: 'tag2' }];
    });

    beforeEach(() => {
        dbMock = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        setModel = new DictionarySetModel(dbMock);
        setTagsModel = new SetTagModel(dbMock);
    });

    test('createSet should insert a set and return it', async () => {
        dbMock.query.mockResolvedValueOnce({ rows: [set], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await setModel.createSet(set);
        expect(result).toEqual(set);
    });

    test('getSetById should return a set if found', async () => {
        dbMock.query.mockResolvedValueOnce({ rows: [set], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await setModel.getSetById(setId);
        expect(result).toEqual(set);
    });

    test('getSetById should return null if not found', async () => {
        const invalidId = 'invalid-id';
        dbMock.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await setModel.getSetById(invalidId);
        expect(result).toBeNull();
    });

    test('deleteSet should return deleted set', async () => {
        dbMock.query.mockResolvedValueOnce({ rows: [set], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await setModel.deleteSet(setId);
        expect(result).toEqual(set);
    });

    test('addTagToSet should return true when a tag is added', async () => {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });

        const result = await setTagsModel.addTagToSet(setId, tags[0].tagId);
        expect(result).toBe(true);
    });

    test('addTagToSet should return false when a tag is not added', async () => {
        dbMock.query.mockResolvedValueOnce({ rowCount: 0, command: 'INSERT', oid: 0, fields: [], rows: [] });

        const result = await setTagsModel.addTagToSet(setId, tags[0].tagId);
        expect(result).toBe(false);
    });

    test('removeTagFromSet should return true when a tag is removed', async () => {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });

        const result = await setTagsModel.removeTagFromSet(setId, tags[0].tagId);
        expect(result).toBe(true);
    });

    test('removeTagFromSet should return false when no tag is removed', async () => {
        dbMock.query.mockResolvedValueOnce({ rowCount: 0, command: 'INSERT', oid: 0, fields: [], rows: [] });

        const result = await setTagsModel.removeTagFromSet(setId, tags[0].tagId);
        expect(result).toBe(false);
    });

    test('getTagsForSet should return a list of tag names', async () => {
        dbMock.query.mockResolvedValueOnce({ rows: [{ name: tags[0].name }, { name: tags[1].name }], rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await setTagsModel.getTagsForSet(setId);
        expect(result).toEqual([{name: tags[0].name}, {name: tags[1].name}]);
    });
});
