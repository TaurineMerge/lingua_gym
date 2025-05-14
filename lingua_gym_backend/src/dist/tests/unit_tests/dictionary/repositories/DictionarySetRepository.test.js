var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DictionarySetRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import { LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import { SetTagRepository } from '../../../../src/repositories/tag/tag.js';
describe('DictionarySetModel', () => {
    let dbMock;
    let setModel;
    let setTagsModel;
    let set;
    let setId;
    let setName;
    let setOwnerId;
    let setDescription;
    let tags;
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
            languageCode: LanguageCode.ENGLISH,
        };
        tags = [{ tagId: 'tag-123', name: 'tag1' }, { tagId: 'tag-456', name: 'tag2' }];
    });
    beforeEach(() => {
        dbMock = {
            query: jest.fn(),
        };
        setModel = new DictionarySetRepository(dbMock);
        setTagsModel = new SetTagRepository(dbMock);
    });
    test('createSet should insert a set and return it', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [set], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setModel.createSet(set);
        expect(result).toEqual(set);
    }));
    test('getSetById should return a set if found', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [set], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setModel.getSetById(setId);
        expect(result).toEqual(set);
    }));
    test('getSetById should return null if not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = 'invalid-id';
        dbMock.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setModel.getSetById(invalidId);
        expect(result).toBeNull();
    }));
    test('deleteSet should return deleted set', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [set], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setModel.deleteSet(setId);
        expect(result).toEqual(set);
    }));
    test('addTagToSet should return true when a tag is added', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield setTagsModel.addTagToSet(setId, tags[0].tagId);
        expect(result).toBe(true);
    }));
    test('addTagToSet should return false when a tag is not added', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 0, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield setTagsModel.addTagToSet(setId, tags[0].tagId);
        expect(result).toBe(false);
    }));
    test('removeTagFromSet should return true when a tag is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield setTagsModel.removeTagFromSet(setId, tags[0].tagId);
        expect(result).toBe(true);
    }));
    test('removeTagFromSet should return false when no tag is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 0, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield setTagsModel.removeTagFromSet(setId, tags[0].tagId);
        expect(result).toBe(false);
    }));
    test('getTagsForSet should return a list of tag names', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [{ name: tags[0].name }, { name: tags[1].name }], rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setTagsModel.getTagsForSet(setId);
        expect(result).toEqual([{ name: tags[0].name }, { name: tags[1].name }]);
    }));
});
