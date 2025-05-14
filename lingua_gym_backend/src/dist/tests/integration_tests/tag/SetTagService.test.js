var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupTestServiceContainer, setupTestRepositoryContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import SetTagService from '../../../src/services/tag/SetTagService.js';
import { TagRepository } from '../../../src/repositories/tag/tag.js';
import { DictionarySetRepository } from '../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { LanguageCode } from '../../../src/database/interfaces/DbInterfaces.js';
import { UserRepository } from '../../../src/repositories/access_management/access_management.js';
import User from '../../../src/models/access_management/User.js';
let setTagService;
let tagModel;
let setModel;
let userModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestRepositoryContainer();
    tagModel = modelContainer.resolve(TagRepository);
    setModel = modelContainer.resolve(DictionarySetRepository);
    userModel = modelContainer.resolve(UserRepository);
    const serviceContainer = yield setupTestServiceContainer();
    setTagService = serviceContainer.resolve(SetTagService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User({
        username: 'test',
        password: 'test',
        email: 'test',
    });
    yield userModel.createUser(user);
    return user.userId;
});
const createTagData = () => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = uuidv4();
    return tagId;
});
const createSetData = () => __awaiter(void 0, void 0, void 0, function* () {
    const setId = uuidv4();
    const set = {
        dictionarySetId: setId,
        name: 'Test Set',
        ownerId: yield createUser(),
        description: 'Set for testing',
        isPublic: false,
        languageCode: LanguageCode.ENGLISH,
    };
    return set;
});
describe('SetTagService', () => {
    test('should add a tag to a set', () => __awaiter(void 0, void 0, void 0, function* () {
        const set = yield createSetData();
        const tagId = yield createTagData();
        yield setModel.createSet(set);
        yield tagModel.createTag(tagId, 'Adjectives');
        const result = yield setTagService.addTagToSet(set.dictionarySetId, tagId);
        expect(result).toBe(true);
    }));
    test('should not add a tag to set if setId or tagId missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield setTagService.addTagToSet('', '');
        expect(result).toBe(false);
    }));
    test('should remove a tag from a set', () => __awaiter(void 0, void 0, void 0, function* () {
        const set = yield createSetData();
        const tagId = yield createTagData();
        yield setModel.createSet(set);
        yield tagModel.createTag(tagId, 'Noun');
        yield setTagService.addTagToSet(set.dictionarySetId, tagId);
        const result = yield setTagService.removeTagFromSet(set.dictionarySetId, tagId);
        expect(result).toBe(true);
    }));
    test('should not remove tag if setId or tagId missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield setTagService.removeTagFromSet('', '');
        expect(result).toBe(false);
    }));
    test('should get tags for a set', () => __awaiter(void 0, void 0, void 0, function* () {
        const set = yield createSetData();
        const tagId1 = yield createTagData();
        const tagId2 = yield createTagData();
        yield setModel.createSet(set);
        yield tagModel.createTag(tagId1, 'Useful');
        yield tagModel.createTag(tagId2, 'Daily');
        yield setTagService.addTagToSet(set.dictionarySetId, tagId1);
        yield setTagService.addTagToSet(set.dictionarySetId, tagId2);
        const tags = yield setTagService.getTagsForSet(set.dictionarySetId);
        console.log(tags);
        expect(tags).toBeInstanceOf(Array);
        expect(tags.length).toBe(2);
        expect(tags[0].setId).toBe(set.dictionarySetId);
    }));
    test('should return empty array if setId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const tags = yield setTagService.getTagsForSet('');
        expect(tags).toEqual([]);
    }));
});
